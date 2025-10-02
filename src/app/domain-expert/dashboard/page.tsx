"use client"

import type React from "react"
import { DollarSign, Package, BookOpen, Star, Video, TrendingUp, Users, Activity } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from '@/contexts/AuthContext'; 
import ProfileSetupPopup from "@/components/domainExpert/profileSetup";


// Custom Icons
const BrainIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
)

interface DashboardCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  color: string
}

interface RecentActivity {
  id: number
  title: string
  description: string
  time: string
  type: string
}

interface ChartData {
  name: string
  value: number
  color?: string
}

interface DomainExpertProfile {
  createdAt?: string
  updatedAt?: string
  // add other fields as needed
}

export default function DashboardPage() {
  const [domainExpert, setDomainExpert] = useState<boolean | null>(null); // null means loading
  const { user } = useAuth();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  console.log("User: ", user);
  

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios.get(
      `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/domain-experts/${user?.id}/profile-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then((res) => setDomainExpert(Boolean(res.data))) // force boolean
      .catch((err) => {
        console.error(err);
        setDomainExpert(false);
      });
  }, []);
  
  useEffect(() => {
    console.log("statussssssssssssss: ", domainExpert);

    if (domainExpert === false) {
      setShowProfilePopup(true);
    }
  }, [domainExpert]);
  
  
  const dashboardCards: DashboardCard[] = [
    {
      title: "Total Earnings",
      value: "Rs.12,546.00",
      change: "+15%",
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      title: "Active Packages",
      value: "8",
      change: "+3",
      icon: <Package className="h-6 w-6" />,
      color: "bg-primary",
    },
    {
      title: "Pending Requests",
      value: "3",
      change: "+2",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-orange-500",
    },
    {
      title: "Average Rating",
      value: "4.8/5.0",
      change: "+0.2",
      icon: <Star className="h-6 w-6" />,
      color: "bg-yellow-500",
    },
  ]

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      title: "New Appointment Request",
      description: "Alex Johnson requested Premium Mentorship for Machine Learning",
      time: "2 hours ago",
      type: "request",
    },
    {
      id: 2,
      title: "Payment Received",
      description: "Payment of $300.00 received from Sarah Williams",
      time: "4 hours ago",
      type: "payment",
    },
    {
      id: 3,
      title: "Video Call Completed",
      description: "1-hour session completed with Michael Brown",
      time: "1 day ago",
      type: "call",
    },
    {
      id: 4,
      title: "New Review",
      description: "Emily Davis left a 5-star review for your mentorship",
      time: "2 days ago",
      type: "review",
    },
  ]

  // Chart data for revenue trend
  const revenueData: ChartData[] = [
    { name: "Jan", value: 2400 },
    { name: "Feb", value: 1398 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 3908 },
    { name: "May", value: 4800 },
    { name: "Jun", value: 3800 },
    { name: "Jul", value: 4300 },
  ]

  const renderRevenueChart = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>
      <div className="h-48 flex items-end justify-between space-x-2">
        {revenueData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-primary rounded-t-sm hover:bg-blue-600 transition-colors cursor-pointer"
              style={{ height: `${(item.value / Math.max(...revenueData.map((d) => d.value))) * 150}px` }}
              title={`${item.name}: $${item.value}`}
            ></div>
            <span className="text-xs text-gray-500 mt-2">{item.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Monthly revenue growth: <span className="text-green-600 font-medium">+15.3%</span>
        </p>
      </div>
    </div>
  )

  const handleSetUpProfile = () => {
    window.location.href = "/domain-expert/profile-completion";
  };

  const handleNotNow = () => {
    setShowProfilePopup(false);
  };

  return (
    <div className="flex-1 overflow-auto">
      <ProfileSetupPopup
        open={showProfilePopup}
        onSetUpProfile={handleSetUpProfile}
        onNotNow={handleNotNow}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Domain Expert Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your mentorship services and track your progress with students.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color} text-white`}>{card.icon}</div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-green-600">{card.change}</span>
                <span className="text-sm text-gray-600"> from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="w-full mb-8">
          {renderRevenueChart()}
        </div>

        {/* Recent Appointment Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointment Requests</h2>
            <div className="space-y-4">
              {[
                {
                  name: "Alex Johnson",
                  topic: "Advanced Machine Learning Concepts",
                  package: "Premium Mentorship",
                  date: "Today",
                  avatar: "AJ",
                },
                {
                  name: "Sarah Williams",
                  topic: "Data Structures & Algorithms",
                  package: "Standard Mentorship",
                  date: "Yesterday",
                  avatar: "SW",
                },
                {
                  name: "Michael Brown",
                  topic: "Web Development Fundamentals",
                  package: "Quick Consultation",
                  date: "2 days ago",
                  avatar: "MB",
                },
              ].map((request, i) => (
                <div key={i} className="flex items-center justify-between space-x-4 rounded-md border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {request.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.name}</p>
                      <p className="text-sm text-gray-600">{request.topic}</p>
                      <div className="flex items-center pt-1">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{request.package}</span>
                        <span className="mx-2 text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{request.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Decline
                    </button>
                    <button className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-blue-600 transition-colors">
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Video Calls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Video Calls</h2>
            <div className="space-y-4">
              {[
                {
                  name: "Emily Davis",
                  time: "11:00 AM - 12:00 PM",
                  topic: "Project Review",
                  avatar: "ED",
                },
                {
                  name: "James Wilson",
                  time: "2:30 PM - 3:30 PM",
                  topic: "Career Guidance",
                  avatar: "JW",
                },
              ].map((meeting, i) => (
                <div key={i} className="flex flex-col space-y-2 rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        {meeting.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{meeting.name}</span>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{meeting.time}</span>
                  </div>
                  <p className="text-xs text-gray-600">{meeting.topic}</p>
                  <button className="w-full flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Video className="mr-2 h-4 w-4" />
                    Join Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <BrainIcon />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Management</h3>
            <div className="space-y-3">
              <button className="block w-full text-left p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Review New Requests
              </button>
              <button className="block w-full text-left p-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                Manage Active Students
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content & Packages</h3>
            <div className="space-y-3">
              <button className="block w-full text-left p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Create New Package
              </button>
              <button className="block w-full text-left p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Update Materials
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Balance</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">$3,240.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Earnings</span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">$850.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">$2,100.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
