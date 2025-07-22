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
  UserCheck,
  UserPlus,
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
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-3">
        {/* Header */}
        <div className="flex justify-between">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 grid gap-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Transaction Management
                </h1>
                <p className="text-gray-600">
                  Manage and oversee all financial transactions in the system.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
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

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="mt-3 p-2 grid w-full h-15 grid-cols-3 gap-3">
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-secondary bg-gray-200 text-xl focus:bg-primary focus:text-white"
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-secondary bg-gray-200 text-xl focus:bg-primary focus:text-white"
              value="transactions"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-secondary bg-gray-200 text-xl focus:bg-primary focus:text-white"
              value="audit"
            >
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Transactions
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {summaryStats.totalTransactions}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-green-600">+12%</span>
                  <span className="text-sm text-gray-600"> from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Payments
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${summaryStats.totalPayments.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-500 text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-green-600">+8%</span>
                  <span className="text-sm text-gray-600"> from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Withdrawals
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${summaryStats.totalWithdrawals.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-500 text-white">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-green-600">+15%</span>
                  <span className="text-sm text-gray-600"> from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pending Withdrawals
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {summaryStats.pendingWithdrawals}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-emerald-500 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-green-600">+5%</span>
                  <span className="text-sm text-gray-600"> from last month</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
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
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
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
            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Transactions
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by username, ID, or project..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 lg:w-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type
                      </label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="All">All Types</SelectItem>
                          <SelectItem value="Payment">Payment</SelectItem>
                          <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                          <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="All">All Roles</SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) =>
                            setDateRange((prev) => ({
                              ...prev,
                              start: e.target.value,
                            }))
                          }
                          className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
                        />
                        <Input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) =>
                            setDateRange((prev) => ({
                              ...prev,
                              end: e.target.value,
                            }))
                          }
                          className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
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
                      Transactions ({filteredTransactions.length} of {transactions.length})
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredTransactions.length === transactions.length
                        ? "Showing all transactions"
                        : `Filtered results: ${filteredTransactions.length} transactions found`}
                    </p>
                  </div>
                  {filteredTransactions.length > 0 && totalPages > 1 && (
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-900 py-4">Transaction ID</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">Username</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">Role</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">Type</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">Status</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-4">Date</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {currentTransactions.length > 0 ? (
                        currentTransactions.map((transaction, index) => (
                          <TableRow
                            key={transaction.id}
                            className={`border-gray-200 hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                            }`}
                          >
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No transactions found
                            </h3>
                            <p className="text-gray-500 mb-4">
                              No transactions match your current search criteria.
                            </p>
                            <Button
                              variant="outline"
                              onClick={handleClearFilters}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              Clear Filters
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {filteredTransactions.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredTransactions.length)} of{" "}
                      {filteredTransactions.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }

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
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
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
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
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
