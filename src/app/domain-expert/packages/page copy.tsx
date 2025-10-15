"use client"

import type React from "react"

import { useState } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  MoreVertical,
} from "lucide-react"

interface Package {
  id: string
  title: string
  description: string
  price: number
  duration: string
  features: string[]
  popular: boolean
  students: number
  revenue: number
  rating: number
  completionRate: number
  status: "active" | "draft" | "archived"
  createdAt: string
  lastUpdated: string
}

interface PackageStats {
  totalRevenue: number
  totalStudents: number
  averageRating: number
  completionRate: number
  revenueChange: number
  studentsChange: number
  ratingChange: number
  completionChange: number
}

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState<"active" | "draft" | "archived">("active")
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showPackageModal, setShowPackageModal] = useState(false)

  // Dummy data for packages
  const packages: Package[] = [
    {
      id: "1",
      title: "Quick Consultation",
      description: "30-minute one-on-one session to address specific questions",
      price: 50,
      duration: "30 minutes",
      features: ["1-on-1 video call", "Personalized advice", "Follow-up email"],
      popular: false,
      students: 24,
      revenue: 1200,
      rating: 4.6,
      completionRate: 95,
      status: "active",
      createdAt: "2024-01-15",
      lastUpdated: "2024-12-20",
    },
    {
      id: "2",
      title: "Standard Mentorship",
      description: "Regular mentorship sessions with assignments and feedback",
      price: 150,
      duration: "4 weeks",
      features: ["Weekly 1-hour sessions", "Personalized assignments", "Email support", "Progress tracking"],
      popular: true,
      students: 56,
      revenue: 8400,
      rating: 4.8,
      completionRate: 89,
      status: "active",
      createdAt: "2024-01-10",
      lastUpdated: "2024-12-18",
    },
    {
      id: "3",
      title: "Premium Mentorship",
      description: "Comprehensive mentorship program with priority support",
      price: 300,
      duration: "8 weeks",
      features: [
        "Bi-weekly 1-hour sessions",
        "Custom curriculum",
        "Priority support",
        "Career guidance",
        "Certificate of completion",
      ],
      popular: false,
      students: 18,
      revenue: 5400,
      rating: 4.9,
      completionRate: 92,
      status: "active",
      createdAt: "2024-01-05",
      lastUpdated: "2024-12-15",
    },
    {
      id: "4",
      title: "Group Workshop",
      description: "Interactive group sessions for collaborative learning",
      price: 75,
      duration: "2 hours",
      features: ["Group video session", "Interactive exercises", "Resource materials"],
      popular: false,
      students: 12,
      revenue: 900,
      rating: 4.4,
      completionRate: 88,
      status: "draft",
      createdAt: "2024-12-01",
      lastUpdated: "2024-12-10",
    },
    {
      id: "5",
      title: "Group Workshop",
      description: "Interactive group sessions for collaborative learning",
      price: 75,
      duration: "2 hours",
      features: ["Group video session", "Interactive exercises", "Resource materials"],
      popular: false,
      students: 12,
      revenue: 900,
      rating: 4.4,
      completionRate: 88,
      status: "archived",
      createdAt: "2024-12-01",
      lastUpdated: "2024-12-10",
    },
  ]

  // Calculate statistics
  const activePackages = packages.filter((pkg) => pkg.status === "active")
  const draftPackages = packages.filter((pkg) => pkg.status === "draft")
  const archivedPackages = packages.filter((pkg) => pkg.status === "archived")

  const stats: PackageStats = {
    totalRevenue: activePackages.reduce((sum, pkg) => sum + pkg.revenue, 0),
    totalStudents: activePackages.reduce((sum, pkg) => sum + pkg.students, 0),
    averageRating: activePackages.reduce((sum, pkg) => sum + pkg.rating, 0) / activePackages.length,
    completionRate: activePackages.reduce((sum, pkg) => sum + pkg.completionRate, 0) / activePackages.length,
    revenueChange: 15.3,
    studentsChange: 8.7,
    ratingChange: 0.2,
    completionChange: -2.1,
  }

  // Chart data for package performance
  const packagePerformanceData = activePackages.map((pkg) => ({
    name: pkg.title.split(" ")[0],
    students: pkg.students,
    revenue: pkg.revenue,
    rating: pkg.rating,
  }))

  // Revenue distribution data
  const revenueDistributionData = activePackages.map((pkg) => ({
    name: pkg.title,
    value: pkg.revenue,
    percentage: Math.round((pkg.revenue / stats.totalRevenue) * 100),
  }))

  const getCurrentPackages = () => {
    switch (activeTab) {
      case "active":
        return activePackages
      case "draft":
        return draftPackages
      case "archived":
        return archivedPackages
      default:
        return activePackages
    }
  }

  const getTabCount = (tab: "active" | "drafts" | "archived") => {
    switch (tab) {
      case "active":
        return activePackages.length
      case "drafts":
        return draftPackages.length
      case "archived":
        return archivedPackages.length
      default:
        return 0
    }
  }

  const renderStatCard = (title: string, value: string, change: number, icon: React.ReactNode, color: string) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  )

  const renderPackagePerformanceChart = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Package Performance</h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {packagePerformanceData.map((pkg, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{pkg.name}</span>
              <span className="text-sm text-gray-500">{pkg.students} students</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(pkg.students / Math.max(...packagePerformanceData.map((p) => p.students))) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">{pkg.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderRevenueDistributionChart = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Distribution</h3>
        <PieChart className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {revenueDistributionData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  index === 0
                    ? "bg-blue-500"
                    : index === 1
                      ? "bg-green-500"
                      : index === 2
                        ? "bg-purple-500"
                        : "bg-orange-500"
                }`}
              ></div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">${item.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Service Packages</h1>
              <p className="mt-2 text-gray-600">Manage your mentorship service offerings and track performance</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Create Package
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {renderStatCard(
              "Total Revenue",
              `$${stats.totalRevenue.toLocaleString()}`,
              stats.revenueChange,
              <DollarSign className="h-5 w-5" />,
              "bg-green-500",
            )}
            {renderStatCard(
              "Total Students",
              stats.totalStudents.toString(),
              stats.studentsChange,
              <Users className="h-5 w-5" />,
              "bg-blue-500",
            )}
            {renderStatCard(
              "Average Rating",
              stats.averageRating.toFixed(1),
              stats.ratingChange,
              <Star className="h-5 w-5" />,
              "bg-yellow-500",
            )}
            {renderStatCard(
              "Completion Rate",
              `${stats.completionRate.toFixed(1)}%`,
              stats.completionChange,
              <Activity className="h-5 w-5" />,
              "bg-purple-500",
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPackagePerformanceChart()}
            {renderRevenueDistributionChart()}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: "active", label: "Active Packages" },
                { key: "drafts", label: "Drafts" },
                { key: "archived", label: "Archived" },
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
                  {tab.label} ({getTabCount(tab.key as any)})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getCurrentPackages().map((pkg) => (
            <div key={pkg.id} className="flex justify-between flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
              {pkg.popular && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-blue-500 text-white text-xs rounded">Popular</div>
              )}

              {/* Package Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                  <span className="ml-1 text-sm text-gray-500">/ {pkg.duration}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {pkg.features.map((feature, j) => (
                  <div key={j} className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between space-x-2">
                <button className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </button>
                <button className="flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getCurrentPackages().length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No packages found</h3>
            <p className="mt-2 text-gray-500">
              {activeTab === "active"
                ? "You don't have any active packages yet."
                : activeTab === "draft"
                  ? "No draft packages to show."
                  : "No archived packages to show."}
            </p>
            <button className="mt-4 flex items-center mx-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Package
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
