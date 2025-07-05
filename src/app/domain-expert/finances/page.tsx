import { ArrowDownToLine, ArrowUpFromLine, CreditCard, DollarSign, TrendingUp } from "lucide-react"

const stat = [
    {
        title: "Available Balance",
        value: "Rs.3,240.00",
        change: "Available for withdrawal",
        icon: <DollarSign className="h-6 w-6" />,
        color: "bg-green-500",
    },
    {
        title: "Pending Earnings",
        value: "Rs.850.00",
        change: "Will be available in 7 days",
        icon: <CreditCard className="h-6 w-6" />,
        color: "bg-yellow-500",
    },
    {
        title: "Total Earnings",
        value: "Rs.12,546.00",
        change: "Lifetime earnings",
        icon: <TrendingUp className="h-6 w-6" />,
        color: "bg-blue-500",
    },
    {
        title: "Total Withdrawn",
        value: "Rs.9,306.00",
        change: "Lifetime withdrawals",
        icon: <ArrowUpFromLine className="h-6 w-6" />,
        color: "bg-purple-500",
    },
]

const transactionHistory = [
    {
    description: "Premium Mentorship Payment",
    date: "Jul 1, 2025",
    student: "Alex Johnson",
    status: "completed",
    amount: "+Rs.300.00",
    },
    {
    description: "Standard Mentorship Payment",
    date: "Jun 28, 2025",
    student: "Sarah Williams",
    status: "completed",
    amount: "+Rs.150.00",
    },
    {
    description: "Quick Consultation",
    date: "Jun 25, 2025",
    student: "Michael Brown",
    status: "completed",
    amount: "+Rs.50.00",
    },
    {
    description: "Premium Mentorship Payment",
    date: "Jun 20, 2025",
    student: "Emily Davis",
    status: "completed",
    amount: "+Rs.300.00",
    },
    {
    description: "Withdrawal to Bank Account",
    date: "Jun 15, 2025",
    student: "-",
    status: "withdrawal",
    amount: "-Rs.800.00",
    },
]


export default function FinancesPage() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
              <p className="mt-2 text-gray-600">Manage your earnings and payouts</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Withdraw Funds
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stat.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color} text-white`}>{card.icon}</div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">{card.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                Transactions
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Withdrawals
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                Payment Methods
              </button>
            </nav>
          </div>
        </div>

        {/* Transaction History */}
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
                {transactionHistory.map((transaction, i) => (
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
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
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
      </div>
    </div>
  )
}
