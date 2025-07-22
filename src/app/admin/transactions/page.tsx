"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionDetailsModal from "@/components/admin/TransactionDetailsModal";
import ExportUtils from "@/components/admin/ExportUtils";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Flag,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Users,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  CreditCard,
  Activity,
} from "lucide-react";

// Types
interface Transaction {
  id: string;
  username: string;
  userRole: "Student" | "Expert";
  type: "Payment" | "Withdrawal";
  amount: number;
  status: "Pending" | "Approved" | "Rejected" | "Failed";
  date: string;
  paymentMethod?: string;
  projectName?: string;
  notes?: string;
  proofUrl?: string;
}

interface AuditLog {
  id: string;
  transactionId: string;
  action: string;
  adminUser: string;
  timestamp: string;
  details: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    username: "john.doe@email.com",
    userRole: "Student",
    type: "Payment",
    amount: 150.0,
    status: "Approved",
    date: "2025-07-15T10:30:00Z",
    paymentMethod: "Credit Card",
    projectName: "Machine Learning Research",
    notes: "Payment for ML expertise consultation",
    proofUrl: "https://example.com/proof1.jpg",
  },
  {
    id: "TXN-002",
    username: "dr.smith@email.com",
    userRole: "Expert",
    type: "Withdrawal",
    amount: 450.0,
    status: "Pending",
    date: "2025-07-14T15:45:00Z",
    paymentMethod: "Bank Transfer",
    notes: "Monthly earnings withdrawal",
  },
  {
    id: "TXN-003",
    username: "alice.johnson@email.com",
    userRole: "Student",
    type: "Payment",
    amount: 200.0,
    status: "Failed",
    date: "2025-07-14T09:20:00Z",
    paymentMethod: "PayPal",
    projectName: "Data Science Mentorship",
    notes: "Payment declined by bank",
  },
  {
    id: "TXN-004",
    username: "prof.wilson@email.com",
    userRole: "Expert",
    type: "Withdrawal",
    amount: 320.0,
    status: "Approved",
    date: "2025-07-13T14:10:00Z",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "TXN-005",
    username: "sarah.brown@email.com",
    userRole: "Student",
    type: "Payment",
    amount: 100.0,
    status: "Pending",
    date: "2025-07-13T11:00:00Z",
    paymentMethod: "Credit Card",
    projectName: "Research Paper Review",
    proofUrl: "https://example.com/proof2.jpg",
  },
  {
    id: "TXN-006",
    username: "mike.taylor@email.com",
    userRole: "Expert",
    type: "Withdrawal",
    amount: 275.5,
    status: "Rejected",
    date: "2025-07-12T16:20:00Z",
    paymentMethod: "Bank Transfer",
    notes: "Insufficient verification documents",
  },
  {
    id: "TXN-007",
    username: "emma.davis@email.com",
    userRole: "Student",
    type: "Payment",
    amount: 80.0,
    status: "Approved",
    date: "2025-07-12T08:15:00Z",
    paymentMethod: "PayPal",
    projectName: "Statistical Analysis Help",
  },
  {
    id: "TXN-008",
    username: "robert.chen@email.com",
    userRole: "Expert",
    type: "Withdrawal",
    amount: 500.0,
    status: "Pending",
    date: "2025-07-11T14:30:00Z",
    paymentMethod: "Cryptocurrency",
    notes: "Weekly earnings withdrawal",
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "AUDIT-001",
    transactionId: "TXN-001",
    action: "Approved",
    adminUser: "admin@brainmap.com",
    timestamp: "2025-07-15T11:00:00Z",
    details: "Transaction approved after verification",
  },
  {
    id: "AUDIT-002",
    transactionId: "TXN-006",
    action: "Rejected",
    adminUser: "admin@brainmap.com",
    timestamp: "2025-07-12T17:00:00Z",
    details: "Rejected due to insufficient documentation",
  },
  {
    id: "AUDIT-003",
    transactionId: "TXN-007",
    action: "Approved",
    adminUser: "moderator@brainmap.com",
    timestamp: "2025-07-12T09:00:00Z",
    details: "Fast-tracked approval for verified user",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Failed":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getTypeColor = (type: string) => {
  return type === "Payment"
    ? "bg-blue-100 text-blue-800"
    : "bg-purple-100 text-purple-800";
};

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Apply filters
  useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (txn) =>
          txn.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (txn.projectName &&
            txn.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter((txn) => txn.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((txn) => txn.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== "All") {
      filtered = filtered.filter((txn) => txn.userRole === roleFilter);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((txn) => {
        const txnDate = new Date(txn.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return txnDate >= startDate && txnDate <= endDate;
      });
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [
    searchQuery,
    typeFilter,
    statusFilter,
    roleFilter,
    dateRange,
    transactions,
  ]);

  // Calculate summary stats
  const summaryStats = {
    totalTransactions: transactions.length,
    totalPayments: transactions
      .filter((txn) => txn.type === "Payment" && txn.status === "Approved")
      .reduce((sum, txn) => sum + txn.amount, 0),
    totalWithdrawals: transactions
      .filter((txn) => txn.type === "Withdrawal" && txn.status === "Approved")
      .reduce((sum, txn) => sum + txn.amount, 0),
    pendingWithdrawals: transactions.filter(
      (txn) => txn.type === "Withdrawal" && txn.status === "Pending"
    ).length,
    failedTransactions: transactions.filter((txn) => txn.status === "Failed")
      .length,
    recentTransactions: transactions.filter(
      (txn) => new Date(txn.date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length,
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleClearFilters = () => {
    setSearchQuery("");
    setTypeFilter("All");
    setStatusFilter("All");
    setRoleFilter("All");
    setDateRange({ start: "", end: "" });
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleTransactionAction = (
    txnId: string,
    action: "approve" | "reject" | "flag"
  ) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === txnId
          ? {
              ...txn,
              status:
                action === "approve"
                  ? "Approved"
                  : action === "reject"
                  ? "Rejected"
                  : txn.status,
              notes:
                action === "flag"
                  ? (txn.notes || "") + " [FLAGGED]"
                  : txn.notes,
            }
          : txn
      )
    );
  };

  const quickStats = [
    {
      title: "Today's Transactions",
      value: summaryStats.recentTransactions,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Reviews",
      value: transactions.filter((t) => t.status === "Pending").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Payment Methods",
      value: new Set(transactions.map((t) => t.paymentMethod).filter(Boolean))
        .size,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span>Admin</span>
            <ChevronLeft className="h-4 w-4 mx-1 rotate-180" />
            <span className="text-gray-900 font-medium">Transactions</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Transaction Management
            </h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <ExportUtils transactions={filteredTransactions} />
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="mt-3 p-2 grid w-full h-15 grid-cols-3 gap-3">
            <TabsTrigger className=" data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-secondary bg-gray-200 text-xl focus:bg-primary focus:text-white" value="overview">Overview</TabsTrigger>
            <TabsTrigger className=" data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-secondary bg-gray-200 text-xl focus:bg-primary focus:text-white" value="transactions">Transactions</TabsTrigger>
            <TabsTrigger className=" data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-secondary bg-gray-200 text-xl focus:bg-primary focus:text-white" value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6 ">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Transactions
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {summaryStats.totalTransactions}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Payments
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ${summaryStats.totalPayments.toFixed(2)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Withdrawals
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${summaryStats.totalWithdrawals.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending Withdrawals
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {summaryStats.pendingWithdrawals}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Failed Transactions
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {summaryStats.failedTransactions}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Transactions Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          className={getTypeColor(transaction.type)}
                          variant="secondary"
                        >
                          {transaction.type}
                        </Badge>
                        <div>
                          <p className="font-medium">{transaction.username}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <Badge
                          className={getStatusColor(transaction.status)}
                          variant="secondary"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="search"
                        placeholder="Search by username, ID, or project"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Payment">Payment</SelectItem>
                        <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <Label htmlFor="role">User Role</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Roles</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <Label htmlFor="dateStart">Start Date</Label>
                    <Input
                      id="dateStart"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateEnd">End Date</Label>
                    <Input
                      id="dateEnd"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Transactions ({filteredTransactions.length} results)
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm">
                            {transaction.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {transaction.username}
                              </p>
                              {transaction.projectName && (
                                <p className="text-xs text-gray-500">
                                  {transaction.projectName}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transaction.userRole === "Expert"
                                  ? "border-purple-200 text-purple-700"
                                  : "border-blue-200 text-blue-700"
                              }
                            >
                              {transaction.userRole}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(transaction.type)}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${transaction.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setIsDetailsModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {transaction.status === "Pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleTransactionAction(
                                        transaction.id,
                                        "approve"
                                      )
                                    }
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleTransactionAction(
                                        transaction.id,
                                        "reject"
                                      )
                                    }
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleTransactionAction(
                                    transaction.id,
                                    "flag"
                                  )
                                }
                                className="text-orange-600 hover:text-orange-700"
                              >
                                <Flag className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-700">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredTransactions.length)} of{" "}
                      {filteredTransactions.length} results
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{log.action}</Badge>
                          <span className="font-mono text-sm text-gray-600">
                            {log.transactionId}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        {log.details}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {log.adminUser}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transaction Details Modal */}
        <TransactionDetailsModal
          transaction={selectedTransaction}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onAction={handleTransactionAction}
        />
      </div>
    </div>
  );
}
