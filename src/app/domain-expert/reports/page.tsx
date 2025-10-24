"use client"

import type React from "react"

import { useState } from "react"
import {
  Download,
  Calendar,
  Filter,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react"

type TimeRange = "7d" | "30d" | "90d" | "custom"
type ReportType = "overview" | "financial" | "students" | "engagement" | "performance"

interface CustomDateRange {
  startDate: string
  endDate: string
}

interface ReportTemplate {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
  estimatedTime: string
  lastGenerated: string
  color: string
}

interface RecentReport {
  id: string
  title: string
  type: string
  generatedDate: string
  status: "completed" | "processing" | "failed"
  fileSize: string
  format: string
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d")
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
    startDate: "",
    endDate: "",
  })
  const [activeReport, setActiveReport] = useState<ReportType>("overview")
  const [selectedReportType, setSelectedReportType] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const reportTemplates: ReportTemplate[] = [
    {
      id: "financial-summary",
      title: "Financial Summary",
      description: "Revenue, expenses, and profit analysis",
      icon: <DollarSign className="h-6 w-6" />,
      category: "Financial",
      estimatedTime: "2-3 minutes",
      lastGenerated: "2 days ago",
      color: "bg-green-500",
    },
    {
      id: "student-progress",
      title: "Student Progress Report",
      description: "Individual and overall student performance metrics",
      icon: <Users className="h-6 w-6" />,
      category: "Academic",
      estimatedTime: "3-5 minutes",
      lastGenerated: "1 week ago",
      color: "bg-blue-500",
    },
    {
      id: "engagement-analytics",
      title: "Student Engagement Analytics",
      description: "Communication frequency and response times",
      icon: <TrendingUp className="h-6 w-6" />,
      category: "Analytics",
      estimatedTime: "2-4 minutes",
      lastGenerated: "5 days ago",
      color: "bg-orange-500",
    },
    {
      id: "performance-metrics",
      title: "Performance Metrics",
      description: "KPIs, ratings, and review summaries",
      icon: <PieChart className="h-6 w-6" />,
      category: "Performance",
      estimatedTime: "3-4 minutes",
      lastGenerated: "1 week ago",
      color: "bg-pink-500",
    },
    {
      id: "time-tracking",
      title: "Time Tracking Report",
      description: "Hours spent on different activities and projects",
      icon: <Clock className="h-6 w-6" />,
      category: "Productivity",
      estimatedTime: "1-2 minutes",
      lastGenerated: "1 day ago",
      color: "bg-indigo-500",
    },
    {
      id: "package-performance",
      title: "Package Performance Analysis",
      description: "Revenue and enrollment data by service package",
      icon: <BarChart3 className="h-6 w-6" />,
      category: "Business",
      estimatedTime: "2-3 minutes",
      lastGenerated: "3 days ago",
      color: "bg-purple-500",
    },
  ]

  const recentReports: RecentReport[] = [
    {
      id: "1",
      title: "Monthly Financial Summary - January 2025",
      type: "Financial",
      generatedDate: "2025-01-06",
      status: "completed",
      fileSize: "2.4 MB",
      format: "PDF",
    },
    {
      id: "2",
      title: "Q4 Student Progress Report",
      type: "Academic",
      generatedDate: "2025-01-05",
      status: "completed",
      fileSize: "1.8 MB",
      format: "PDF",
    },
    {
      id: "3",
      title: "Package Performance Analysis - December",
      type: "Business",
      generatedDate: "2025-01-04",
      status: "completed",
      fileSize: "956 KB",
      format: "PDF",
    },
    {
      id: "4",
      title: "Weekly Engagement Analytics",
      type: "Analytics",
      generatedDate: "2025-01-03",
      status: "processing",
      fileSize: "Processing...",
      format: "PDF",
    },
  ]

  const handleGenerateReport = async (templateId: string) => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)

    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#" // In real app, this would be the PDF blob URL
    link.download = `${templateId}-report-${new Date().toISOString().split("T")[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log(`Generated and downloaded report: ${templateId}`)
  }

  const handleDownloadReport = (reportId: string, title: string) => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#" // In real app, this would be the actual PDF URL
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log(`Downloaded report: ${reportId}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

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

  const filteredTemplates = reportTemplates.filter(
    (template) => selectedReportType === "all" || template.category.toLowerCase() === selectedReportType,
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-2 text-gray-600">Generate comprehensive reports and analyze your performance metrics</p>
          </div>
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

          {/* Report Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Report Category</label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="financial">Financial</option>
              <option value="academic">Academic</option>
              <option value="analytics">Analytics</option>
              <option value="performance">Performance</option>
              <option value="productivity">Productivity</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        {/* Selected Time Range Display */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected Period:</strong> {getTimeRangeLabel()}
          </p>
        </div>
      </div>

      {/* Report Templates */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="flex flex-col justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${template.color} bg-opacity-10`}>
                  <div className={`text-${template.color.split("-")[1]}-600`}>{template.icon}</div>
                </div>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">{template.category}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center justify-between">
                  <span>Estimated time:</span>
                  <span>{template.estimatedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last generated:</span>
                  <span>{template.lastGenerated}</span>
                </div>
              </div>

              <button
                onClick={() => handleGenerateReport(template.id)}
                disabled={isGenerating}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate & Download PDF
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
              <p className="text-sm text-gray-600 mt-1">View and download your recently generated reports</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(report.status)}
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{report.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {report.type}</span>
                      <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                      <span>Size: {report.fileSize}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{report.format}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownloadReport(report.id, report.title)}
                    disabled={report.status !== "completed"}
                    className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
