"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/utils/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Pagination from "@/components/Pagination"
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Calendar, CreditCard, DollarSign, RefreshCcw, Wallet } from "lucide-react"

type Transaction = {
  transactionId: string
  amount: number
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  status: string
  paymentType: string
  createdAt: string
}

type PageResp<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

type WalletResp = {
  walletId: string
  holdAmount: number
  releasedAmount: number
  systemCharged: number
  withdrawnAmount: number
  belongsTo: string
  domainExpertName: string
  status: string
  createdAt: string
  updatedAt: string
  lastTransactionAt: string
}

type SortKey = "date" | "amount"
type SortOrder = "asc" | "desc"

export default function FinancesPage() {
  const { user, loading: authLoading } = useAuth()

  const [wallet, setWallet] = useState<WalletResp | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)

  const [txPage, setTxPage] = useState<PageResp<Transaction> | null>(null)
  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Format helpers
  const currency = useMemo(() => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }), [])
  const formatAmount = (n: number) => currency.format(n || 0)
  const formatDateTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "-")

  // Derived values
  const totalBalance = (wallet?.holdAmount || 0) + (wallet?.releasedAmount || 0)

  // Fetch wallet
  useEffect(() => {
    if (!user?.id) return
    setWalletLoading(true)
    setWalletError(null)
    api
      .get<WalletResp>(`/api/v1/wallet/${user.id}`)
      .then((res) => setWallet(res.data))
      .catch((err) => {
        console.error(err)
        setWalletError(err?.response?.data?.message || "Failed to load wallet")
      })
      .finally(() => setWalletLoading(false))
  }, [user?.id])

  // Fetch transactions (server-paginated). Use backend sort when sorting by date.
  useEffect(() => {
    if (!user?.id) return
    setTxLoading(true)
    setTxError(null)
    const params: Record<string, any> = { page: page - 1, size: pageSize }
    if (sortKey === "date") params.sort = `createdAt,${sortOrder}`
    api
      .get<PageResp<Transaction>>(`/api/transactions/user/${user.id}`, { params })
      .then((res) => setTxPage(res.data))
      .catch((err) => {
        console.error(err)
        setTxError(err?.response?.data?.message || "Failed to load transactions")
      })
      .finally(() => setTxLoading(false))
  }, [user?.id, page, pageSize, sortKey, sortOrder])

  // Client-side filtering and amount sorting on the current page
  const visibleTransactions = useMemo(() => {
    const list = txPage?.content || []
    let filtered = list
    if (paymentTypeFilter !== "all") {
      filtered = filtered.filter((t) => t.paymentType?.toLowerCase() === paymentTypeFilter)
    }
    if (dateFrom) {
      const from = new Date(dateFrom)
      filtered = filtered.filter((t) => new Date(t.createdAt) >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo)
      // Include whole end day
      to.setHours(23, 59, 59, 999)
      filtered = filtered.filter((t) => new Date(t.createdAt) <= to)
    }
    if (sortKey === "amount") {
      filtered = [...filtered].sort((a, b) => (sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount))
    }
    return filtered
  }, [txPage?.content, paymentTypeFilter, dateFrom, dateTo, sortKey, sortOrder])

  const uniqueTypes = useMemo(() => {
    const set = new Set<string>()
    for (const t of txPage?.content || []) {
      if (t.paymentType) set.add(t.paymentType.toLowerCase())
    }
    return Array.from(set)
  }, [txPage?.content])

  const isLoading = authLoading || walletLoading

  const reload = () => {
    if (!user?.id) return
    // trigger effects by resetting page (noop) and refetching wallet via dependency
    setPage((p) => p)
    setWalletLoading(true)
    setWalletError(null)
    api
      .get<WalletResp>(`/api/v1/wallet/${user.id}`)
      .then((res) => setWallet(res.data))
      .catch((err) => setWalletError(err?.response?.data?.message || "Failed to load wallet"))
      .finally(() => setWalletLoading(false))

    setTxLoading(true)
    setTxError(null)
    const params: Record<string, any> = { page: page - 1, size: pageSize }
    if (sortKey === "date") params.sort = `createdAt,${sortOrder}`
    api
      .get<PageResp<Transaction>>(`/api/transactions/user/${user.id}`, { params })
      .then((res) => setTxPage(res.data))
      .catch((err) => setTxError(err?.response?.data?.message || "Failed to load transactions"))
      .finally(() => setTxLoading(false))
  }

  if (!authLoading && !user) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-lg border bg-white p-6">
            <h1 className="text-xl font-semibold mb-2">Unauthorized</h1>
            <p className="text-sm text-gray-600">Please sign in to view your finances.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finances</h1>
            <p className="mt-1 text-gray-600">Track your wallet and review all transactions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={reload} aria-label="Refresh">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
            <Button onClick={() => (window.location.href = "/domain-expert/withdraw")}>
              <DollarSign className="h-4 w-4" /> Withdraw
            </Button>
          </div>
        </div>

        {/* Wallet Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <SummaryCard
            title="Holding Amount"
            icon={<Wallet className="h-6 w-6" />}
            value={isLoading ? undefined : formatAmount(wallet?.holdAmount || 0)}
            loading={isLoading}
          />
          <SummaryCard
            title="Released Amount"
            icon={<CreditCard className="h-6 w-6" />}
            value={isLoading ? undefined : formatAmount(wallet?.releasedAmount || 0)}
            loading={isLoading}
          />
          <SummaryCard
            title="Service Charge Rate"
            icon={<ArrowDownWideNarrow className="h-6 w-6" />}
            value= "5%"
            loading={isLoading}
          />
          <SummaryCard
            title="Total Balance"
            icon={<ArrowUpWideNarrow className="h-6 w-6" />}
            value={isLoading ? undefined : formatAmount(totalBalance)}
            loading={isLoading}
          />
        </div>

        {walletError && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {walletError}
          </div>
        )}

        {/* Transactions */}
        <Card className="bg-white border shadow-sm">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Transactions</CardTitle>
                <p className="text-sm text-gray-600 mt-1">All wallet activities</p>
              </div>
              <div className="flex items-center gap-2">
                <FilterBar
                  uniqueTypes={uniqueTypes}
                  paymentType={paymentTypeFilter}
                  onPaymentTypeChange={setPaymentTypeFilter}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  onDateFromChange={setDateFrom}
                  onDateToChange={setDateTo}
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  onSortKeyChange={setSortKey}
                  onSortOrderChange={setSortOrder}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {txError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {txError}
              </div>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txLoading ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="flex items-center justify-center py-10 text-gray-500">
                          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                          Loading transactions...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : visibleTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                          <Calendar className="h-5 w-5 mb-2" />
                          No transactions found
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleTransactions.map((t) => (
                      <TableRow key={t.transactionId}>
                        <TableCell>{formatDateTime(t.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {t.paymentType || "unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate" title={t.senderName}>
                          {t.senderName || "-"}
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate" title={t.receiverName}>
                          {t.receiverName || "-"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={t.status} />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatAmount(t.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={Math.max(1, txPage?.totalPages || 1)}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon,
  loading,
}: {
  title: string
  value?: string
  icon: React.ReactNode
  loading?: boolean
}) {
  return (
    <Card className="bg-white border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="p-2 rounded-full bg-gray-100 text-gray-700">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
        ) : (
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase()
  if (s.includes("success") || s === "completed" || s === "paid") {
    return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
  }
  if (s.includes("pending")) {
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
  }
  if (s.includes("failed") || s.includes("cancel")) {
    return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
  }
  if (s.includes("withdraw")) {
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Withdrawal</Badge>
  }
  return <Badge variant="outline" className="capitalize">{status || "Unknown"}</Badge>
}

function FilterBar({
  uniqueTypes,
  paymentType,
  onPaymentTypeChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  sortKey,
  sortOrder,
  onSortKeyChange,
  onSortOrderChange,
}: {
  uniqueTypes: string[]
  paymentType: string
  onPaymentTypeChange: (v: string) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  sortKey: SortKey
  sortOrder: SortOrder
  onSortKeyChange: (v: SortKey) => void
  onSortOrderChange: (v: SortOrder) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={paymentType} onValueChange={onPaymentTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {uniqueTypes.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">From</label>
        <input
          type="date"
          className="rounded-md border px-2 py-1 text-sm"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">To</label>
        <input
          type="date"
          className="rounded-md border px-2 py-1 text-sm"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
        />
      </div>

      <Select value={sortKey} onValueChange={(v) => onSortKeyChange(v as SortKey)}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="amount">Amount</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={(v) => onSortOrderChange(v as SortOrder)}>
        <SelectTrigger>
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// display a domain expert's wallet and transaction history.
// The page should include:
//
// 1. A wallet summary section showing:
//    - Holding Amount
//    - Released Amount
//    - System Charge Percentage
//    - Total Balance (holding + released)
// 2. A transaction table below that lists all transactions fetched from /api/transactions/user/{expertId}:
//the response will include:
/* {
  "totalElements": 0,
  "totalPages": 0,
  "pageable": {
    "paged": true,
    "pageNumber": 0,
    "pageSize": 0,
    "unpaged": true,
    "offset": 0,
    "sort": {
      "sorted": true,
      "unsorted": true,
      "empty": true
    }
  },
  "first": true,
  "last": true,
  "size": 0,
  "content": [
    {
      "transactionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "amount": 0,
      "senderId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "senderName": "string",
      "receiverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "receiverName": "string",
      "status": "string",
      "paymentType": "string",
      "createdAt": "2025-10-20T15:01:04.226Z"
    }
  ],
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": true,
    "empty": true
  },
  "numberOfElements": 0,
  "empty": true
} */
// 3. Fetch wallet data from /api/v1/wallet/{domainExpertId} 
/*
{
  "walletId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "holdAmount": 0,
  "releasedAmount": 0,
  "systemCharged": 0,
  "withdrawnAmount": 0,
  "belongsTo": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "domainExpertName": "string",
  "status": "string",
  "createdAt": "2025-10-20T15:07:19.578Z",
  "updatedAt": "2025-10-20T15:07:19.578Z",
  "lastTransactionAt": "2025-10-20T15:07:19.578Z"
}
*/
// 4. Add loading states and error handling for both API calls.
// 5. use comprehensive ui 
// 7. allow sorting or filtering transactions by type or date.
