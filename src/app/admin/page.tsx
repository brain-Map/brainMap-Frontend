"use client";

import React, { useState, useEffect } from "react";

import SummaryCard from "@/components/admin/SummaryCard";

// Import additional icons
import {
  UserCheck,
  Brain,
  FolderOpen,
  AlertTriangle,
  Shield,
} from "lucide-react";

import CountChart from "@/components/admin/CountChart";
import api from "@/utils/api";

// Dashboard Icons
const BrainIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

interface DashboardCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivity {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "brain-map" | "analysis" | "collaboration" | "learning";
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [DashboardOverview, setDashboardOverview] = useState<any>(null);
  const [UserTrendData, setUserTrendData] = useState<any>(null);
  const [ServerHealth, setServerHealth] = useState<boolean | any>(null);
  useEffect(() => {

    async function fetchOverview() {
      try {
        // Health check first
        const healthRes = await api.get('/api/v1/admin/dashboard/helthcheck');
        const isServerOnline = healthRes.status >= 200 && healthRes.status < 300;
        setServerHealth(isServerOnline);

        if (!isServerOnline) {
          setIsLoading(false);
          return; // skip fetching other data if server is down
        }

        // Fetch dashboard data only if server is healthy
        const overviewRes = await api.get('/api/v1/admin/dashboard/overview');
        const chartRes = await api.get('/api/v1/admin/dashboard/user_trend')


        setDashboardOverview(overviewRes);
        setUserTrendData(chartRes);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard overview:", error);
        setServerHealth(false);
        setIsLoading(false);
      }
    }

    // Run once immediately
    fetchOverview();

    // Refresh every 60 seconds
    const interval = setInterval(() => {fetchOverview();}, 60000); 
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer); // cleanup
  }, []);

  const dashboardCards: DashboardCard[] = [
    {
      title: "Total Brain Maps",
      value: DashboardOverview?.data?.userCount || "0",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Active Projects",
      value: DashboardOverview?.data?.activeProjects || "0",
      icon: <FolderOpen className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      title: "Pending Expert Verfications",
      value: DashboardOverview?.data?.pendingDomainExperts || "0",
      icon: <UserCheck className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Open Issues",
      value: DashboardOverview?.data?.openIssues || "0",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "bg-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1 grid gap-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage users, content, and system settings from your admin
                control panel.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <span className="font-medium text-gray-700">Server Status</span>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${ServerHealth ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className={`font-medium text-sm ${ServerHealth ? 'text-green-600' : 'text-red-600'}`}>
                    {ServerHealth ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <SummaryCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <CountChart userTrend={UserTrendData?.data}/>
        </div>


        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => console.log("Navigate to new-users")}
                className="block w-full text-left p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Review New Users
              </button>
              <button
                onClick={() => console.log("Navigate to banned-users")}
                className="block w-full text-left p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Manage Banned Users
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Content Moderation
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => console.log("Navigate to reported-posts")}
                className="block w-full text-left p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Review Reports
              </button>
              <button
                onClick={() => console.log("Navigate to pending-reviews")}
                className="block w-full text-left p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Pending Reviews
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
