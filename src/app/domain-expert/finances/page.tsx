"use client"

import { useState } from "react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Filter,
  DollarSignIcon
} from "lucide-react"

type TimeRange = "7d" | "30d" | "90d" | "custom"


interface ChartData {
  name: string
  value: number
  color?: string
}

interface CustomDateRange {
  startDate: string
  endDate: string
}


export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState<"transactions" | "withdrawals" | "analytics">("transactions")
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
      startDate: "",
      endDate: "",
    })
    const [timeRange, setTimeRange] = useState<TimeRange>("30d")
    const [showDatePicker, setShowDatePicker] = useState(false)
    
  

  // Monthly earnings data
  const monthlyEarningsData: ChartData[] = [
    { name: "Jan", value: 2400 },
    { name: "Feb", value: 1398 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 3908 },
    { name: "May", value: 4800 },
    { name: "Jun", value: 3800 },
    { name: "Jul", value: 4300 },
    { name: "Aug", value: 5200 },
    { name: "Sep", value: 4100 },
    { name: "Oct", value: 6800 },
    { name: "Nov", value: 5900 },
    { name: "Dec", value: 7200 },
  ]
  
  // Revenue by package type
  const revenueByPackageData: ChartData[] = [
    { name: "Premium Mentorship", value: 8400, color: "bg-purple-500" },
    { name: "Standard Mentorship", value: 5400, color: "bg-blue-500" },
    { name: "Quick Consultation", value: 1200, color: "bg-green-500" },
    { name: "Group Workshop", value: 900, color: "bg-orange-500" },
  ]
  
  // Payment methods distribution
  const paymentMethodsData: ChartData[] = [
    { name: "Credit Card", value: 65, color: "bg-blue-500" },
    { name: "PayPal", value: 25, color: "bg-yellow-500" },
    { name: "Bank Transfer", value: 10, color: "bg-green-500" },
  ]
  
  const getTimeRangeLabel = () => {
      switch (timeRange) {
        case "7d":
          return "Last 7 days"
        case "30d":
          return "Last 30 days"
        case "90d":
          return "Last 90 days"
        case "custom":
          return customDateRange.startDate && customDateRange.endDate
            ? `${customDateRange.startDate} to ${customDateRange.endDate}`
            : "Custom range"
        default:
          return "Last 30 days"
      }
    }
  const renderMonthlyEarningsChart = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Earnings Trend</h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>
      <div className="h-64 flex items-end justify-between space-x-1">
        {monthlyEarningsData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
              style={{ height: `${(item.value / Math.max(...monthlyEarningsData.map((d) => d.value))) * 200}px` }}
              title={`${item.name}: Rs.${item.value.toLocaleString()}`}
            ></div>
            <span className="text-xs text-gray-500 mt-2">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-600">Total Annual Revenue</span>
        <span className="font-semibold text-gray-900">
          ${monthlyEarningsData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
        </span>
      </div>
    </div>
  )

  const renderRevenueByPackageChart = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue by Package Type</h3>
        <PieChart className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {revenueByPackageData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">${item.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${(item.value / Math.max(...revenueByPackageData.map((d) => d.value))) * 100}%` }}
              ></div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {Math.round((item.value / revenueByPackageData.reduce((sum, d) => sum + d.value, 0)) * 100)}% of total
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
              <p className="mt-2 text-gray-600">Manage your earnings, track performance, and analyze revenue trends</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <DollarSignIcon className="mr-2 h-4 w-4" />
              Withdraw Funds
            </button>
          </div>
        </div>
      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Report Configuration</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Time Range Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Time Period</label>
            <select
              value={timeRange}
              onChange={(e) => {
                const value = e.target.value as TimeRange
                setTimeRange(value)
                if (value === "custom") {
                  setShowDatePicker(true)
                } else {
                  setShowDatePicker(false)
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {showDatePicker && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}
          
          {/* Generate Report Button */}
          <div className="space-y-2 flex flex-col justify-end">
            <button className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full h-[42px]">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Selected Time Range Display */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected Period:</strong> {getTimeRangeLabel()}
          </p>
        </div>
      </div>
        {/* Financial Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            {
              title: "Available Balance",
              value: "Rs.3,240.00",
              change: "Available for withdrawal",
              icon: <DollarSign className="h-6 w-6" />,
              color: "bg-green-500",
              changeType: "neutral" as const,
            },
            {
              title: "Pending Earnings",
              value: "Rs.850.00",
              change: "+12.5%",
              icon: <CreditCard className="h-6 w-6" />,
              color: "bg-yellow-500",
              changeType: "increase" as const,
            },
            {
              title: "Total Earnings",
              value: "Rs.12,546.00",
              change: "+15.3%",
              icon: <TrendingUp className="h-6 w-6" />,
              color: "bg-blue-500",
              changeType: "increase" as const,
            },
            {
              title: "Total Withdrawn",
              value: "Rs.9,306.00",
              change: "+8.2%",
              icon: <ArrowUpFromLine className="h-6 w-6" />,
              color: "bg-purple-500",
              changeType: "increase" as const,
            },
            {
            title: "Total Withdrawn",
            value: "Rs.9,306.00",
            change: "-2.1%", // Changed to show a decrease
            icon: <ArrowUpFromLine className="h-6 w-6" />,
            color: "bg-purple-500",
            changeType: "decrease" as const, // Changed to decrease
          },
          ].map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color} text-white`}>{card.icon}</div>
              </div>
              <div className="mt-4 flex items-center">
                {card.changeType === "increase" && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                {card.changeType === "decrease" && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
                <span
                  className={`text-sm ${
                    card.changeType === "increase"
                      ? "text-green-600"
                      : card.changeType === "decrease"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderMonthlyEarningsChart()}
          {renderRevenueByPackageChart()}
        </div>

        {/* Payment Methods Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Session Rate</span>
                  <span className="text-lg font-semibold text-gray-900">Rs.85</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Growth Rate</span>
                  <span className="text-lg font-semibold text-green-600">+15.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Best Performing Package</span>
                  <span className="text-sm font-semibold text-gray-900">Premium Mentorship</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Sessions This Month</span>
                  <span className="text-lg font-semibold text-gray-900">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue Per Student</span>
                  <span className="text-lg font-semibold text-gray-900">Rs.523</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-lg font-semibold text-blue-600">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "transactions", label: "Transactions" },
                { key: "withdrawals", label: "Withdrawals" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Transaction History */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-600 mt-1">View all your earnings and payouts</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      description: "Premium Mentorship Payment",
                      date: "Jan 6, 2025",
                      student: "Alex Johnson",
                      status: "completed",
                      amount: "+Rs.300.00",
                    },
                    {
                      description: "Standard Mentorship Payment",
                      date: "Jan 5, 2025",
                      student: "Sarah Williams",
                      status: "completed",
                      amount: "+Rs.150.00",
                    },
                    {
                      description: "Quick Consultation",
                      date: "Jan 4, 2025",
                      student: "Michael Brown",
                      status: "completed",
                      amount: "+Rs.50.00",
                    },
                    {
                      description: "Premium Mentorship Payment",
                      date: "Jan 3, 2025",
                      student: "Emily Davis",
                      status: "pending",
                      amount: "+Rs.300.00",
                    },
                    {
                      description: "Withdrawal to Bank Account",
                      date: "Jan 1, 2025",
                      student: "-",
                      status: "withdrawal",
                      amount: "-Rs.800.00",
                    },
                  ].map((transaction, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.student}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {transaction.status === "completed"
                            ? "Completed"
                            : transaction.status === "pending"
                              ? "Pending"
                              : "Withdrawal"}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                          transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === "withdrawals" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal History</h2>
            <div className="text-center py-8">
              <ArrowUpFromLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Withdrawals</h3>
              <p className="text-gray-500 mb-4">Your withdrawal history will appear here</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Request Withdrawal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
