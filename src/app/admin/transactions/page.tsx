"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ChevronLeft, ChevronRight, DollarSign, PiggyBank, Wallet, Percent, ArrowUpFromLine } from "lucide-react";
import api from "@/utils/api";

interface TransactionDetail {
  transactionId: string;
  senderName: string;
  senderEmail: string;
  senderRole: "PROJECT_MEMBER" | "MENTOR" | string;
  receiverName: string;
  receiverEmail: string;
  receiverRole: "PROJECT_MEMBER" | "MENTOR" | string;
  amount: number;
  status: string; // PENDING | COMPLETED | FAILED | REJECTED
  paymentType: string; // PAYMENT | WITHDRAWAL | REFUND
  createdAt: string; // ISO timestamp
  serviceListTitle: string | null;
}

interface WalletTotals {
  holdTotal: number;
  releasedTotal: number;
  systemChargedTotal: number;
  withdrawnTotal: number;
}

const statusBadgeClass = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "SUCCESS") return "bg-green-100 text-green-700";
  if (s === "REFUNDED") return "bg-sky-100 text-sky-700";
  if (s === "PENDING") return "bg-yellow-100 text-yellow-700";
  if (s === "FAILED" || s === "CANCELLED") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

const typeBadgeClass = (type: string) => {
  const t = type?.toUpperCase();
  if (t === "PAYMENT") return "bg-blue-100 text-blue-700";
  if (t === "REFUND") return "bg-teal-100 text-teal-700";
  if (t === "WITHDRAWAL") return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-700";
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wallet Totals
  const [walletTotals, setWalletTotals] = useState<WalletTotals | null>(null);
  const [totalsLoading, setTotalsLoading] = useState(true);
  const [totalsError, setTotalsError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all"); // Matches either sender or receiver role
  const [datePeriod, setDatePeriod] = useState("all"); // all | today | 7d | 30d | 90d

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<TransactionDetail[]>("/api/transactions/details/all");
        setTransactions(res.data || []);
      } catch (e: any) {
        console.error("Failed to fetch transactions:", e);
        setError(e?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        setTotalsLoading(true);
        setTotalsError(null);
  const res = await api.get<WalletTotals>("/api/v1/wallet/totals");
  setWalletTotals(res.data || { holdTotal: 0, releasedTotal: 0, systemChargedTotal: 0, withdrawnTotal: 0 });
      } catch (e: any) {
        console.error("Failed to fetch wallet totals:", e);
        setTotalsError(e?.message || "Failed to load totals");
      } finally {
        setTotalsLoading(false);
      }
    };
    fetchTotals();
  }, []);

  const filtered = useMemo(() => {
    let list = [...transactions];

    // Search by id, names, emails, service title
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((t) =>
        t.transactionId.toLowerCase().includes(q) ||
        t.senderName.toLowerCase().includes(q) ||
        t.senderEmail.toLowerCase().includes(q) ||
        t.receiverName.toLowerCase().includes(q) ||
        t.receiverEmail.toLowerCase().includes(q) ||
        (t.serviceListTitle?.toLowerCase() || "").includes(q)
      );
    }

    // Status filter (PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED)
    if (statusFilter !== "all") {
      list = list.filter((t) => t.status?.toUpperCase() === statusFilter.toUpperCase());
    }

    // Type filter (PAYMENT, REFUND, WITHDRAWAL)
    if (typeFilter !== "all") {
      list = list.filter((t) => t.paymentType?.toUpperCase() === typeFilter.toUpperCase());
    }

    // Role filter (sender or receiver)
    if (roleFilter !== "all") {
      const rf = roleFilter.toUpperCase();
      list = list.filter((t) => t.senderRole?.toUpperCase() === rf || t.receiverRole?.toUpperCase() === rf);
    }

    // Day period filter
    if (datePeriod !== "all") {
      const now = new Date();
      let threshold: Date | null = null;
      if (datePeriod === "today") {
        // Start of today
        threshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        list = list.filter((t) => new Date(t.createdAt) >= threshold!);
      } else {
        const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
        const days = daysMap[datePeriod];
        if (days) {
          const ms = days * 24 * 60 * 60 * 1000;
          const since = new Date(now.getTime() - ms);
          list = list.filter((t) => new Date(t.createdAt) >= since);
        }
      }
    }

    return list;
  }, [transactions, searchTerm, statusFilter, typeFilter, roleFilter, datePeriod]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    // Reset to first page when filters/search change
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, roleFilter, datePeriod]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setRoleFilter("all");
    setDatePeriod("all");
    setCurrentPage(1);
  };

  // Format currency as LKR
  const lkr = useMemo(() => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }), []);
  const formatCurrency = (n?: number) => lkr.format(n ?? 0);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-3">
        {/* Header */}
        <div className="flex justify-between">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 grid gap-1">
                <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                <p className="text-gray-600">View and filter all transactions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Totals Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* On-Hold Total */}
              <div className="rounded-lg border border-gray-200 p-5 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-700">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Total On-Hold</div>
                  <div className="text-2xl font-semibold text-gray-900 mt-1">
                    {totalsLoading ? (
                      <span className="inline-block h-6 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      formatCurrency(walletTotals?.holdTotal)
                    )}
                  </div>
                </div>
              </div>

              {/* Released Total */}
              <div className="rounded-lg border border-gray-200 p-5 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Total Released</div>
                  <div className="text-2xl font-semibold text-gray-900 mt-1">
                    {totalsLoading ? (
                      <span className="inline-block h-6 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      formatCurrency(walletTotals?.releasedTotal)
                    )}
                  </div>
                </div>
              </div>

              {/* System Charges */}
              <div className="rounded-lg border border-gray-200 p-5 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700">
                  <Percent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Brain-Map Earnings</div>
                  <div className="text-2xl font-semibold text-gray-900 mt-1">
                    {totalsLoading ? (
                      <span className="inline-block h-6 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      formatCurrency(walletTotals?.systemChargedTotal)
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">5% platform fee on expert payments</div>
                </div>
              </div>

              {/* Total Withdrawn */}
              <div className="rounded-lg border border-gray-200 p-5 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-700">
                  <ArrowUpFromLine className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Total Withdrawn</div>
                  <div className="text-2xl font-semibold text-gray-900 mt-1">
                    {totalsLoading ? (
                      <span className="inline-block h-6 w-24 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      formatCurrency(walletTotals?.withdrawnTotal)
                    )}
                  </div>
                </div>
              </div>
            </div>

            {totalsError && (
              <div className="mt-4 text-sm text-red-600">{totalsError}</div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Transactions</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by id, name, email, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 lg:w-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SUCCESS">Success</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="PAYMENT">Payment</SelectItem>
                      <SelectItem value="REFUND">Refund</SelectItem>
                      <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="PROJECT_MEMBER">Member</SelectItem>
                      <SelectItem value="MENTOR">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <Select value={datePeriod} onValueChange={setDatePeriod}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Periods" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 lg:mb-0"
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Transactions ({paginated.length} of {filtered.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filtered.length <= itemsPerPage
                    ? "Showing all transactions"
                    : `Filtered results: ${filtered.length} transactions found`}
                </p>
              </div>
              {filtered.length > 0 && totalPages > 1 && (
                <div className="text-sm text-gray-500">Page {currentPage} of {totalPages}</div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-900 py-4">Transaction</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Sender</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Receiver</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Type</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Status</TableHead>
                  {/* <TableHead className="font-semibold text-gray-900 py-4">Service</TableHead> */}
                  <TableHead className="font-semibold text-gray-900 py-4">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                      <p className="text-gray-500 mb-4">No transactions match your current search criteria.</p>
                      <Button variant="outline" onClick={clearFilters} className="border-gray-300 text-gray-700 hover:bg-gray-50">Clear Filters</Button>
                    </TableCell>
                  </TableRow>
                )}

                {loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-gray-600">Loading transactions...</TableCell>
                  </TableRow>
                )}

                {!loading && paginated.map((t) => {
                  const created = new Date(t.createdAt);
                  const createdStr = created.toLocaleString();
                  const amountStr = formatCurrency(t.amount);
                  return (
                    <TableRow key={t.transactionId} className="hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-gray-900">{t.transactionId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-gray-700">
                        <div className="space-y-0.5">
                          <div className="font-medium text-gray-900">{t.senderName || "-"}</div>
                          <div className="text-xs text-gray-500">{t.senderEmail || "-"}</div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {t.senderRole}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-gray-700">
                        <div className="space-y-0.5">
                          <div className="font-medium text-gray-900">{t.receiverName || "-"}</div>
                          <div className="text-xs text-gray-500">{t.receiverEmail || "-"}</div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {t.receiverRole}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={typeBadgeClass(t.paymentType)}>{t.paymentType}</Badge>
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-gray-900">{amountStr}</TableCell>
                      <TableCell className="py-4">
                        <Badge className={statusBadgeClass(t.status)}>{t.status}</Badge>
                      </TableCell>
                      {/* <TableCell className="py-4 text-gray-700">{t.serviceListTitle ?? "-"}</TableCell> */}
                      <TableCell className="py-4 text-gray-700">{createdStr}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filtered.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) page = i + 1;
                    else if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? "bg-[#3D52A0] text-white hover:bg-[#2A3B7D] border-[#3D52A0]"
                            : "border-gray-300 text-gray-700 hover:bg-white"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
