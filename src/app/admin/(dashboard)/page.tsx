'use client';

import React, { useState, useEffect } from 'react';

import SummaryCard from '@/components/admin/SummaryCard';

// Import additional icons
import { 
  UserCheck,
  Brain,
  FolderOpen,
  AlertTriangle
} from 'lucide-react';

import CountChart from '@/components/admin/CountChart';

// Dashboard Icons
const BrainIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

interface DashboardCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivity {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'brain-map' | 'analysis' | 'collaboration' | 'learning';
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API
  const dashboardCards: DashboardCard[] = [
    {
      title: 'Total Brain Maps',
      value: '2544',
      change: '+12%',
      icon: <Brain className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Projects',
      value: '156',
      change: '+8%',
      icon: <FolderOpen className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Pending Expert Verfications',
      value: '89',
      change: '+15%',
      icon: <UserCheck className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Open Issues',
      value: '12',
      change: '+3%',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      title: 'New Brain Map Created',
      description: 'You created a new brain map for "Cognitive Neuroscience"',
      time: '2 hours ago',
      type: 'brain-map'
    },
    {
      id: 2,
      title: 'Analysis Completed',
      description: 'Pattern analysis completed for "Memory Networks"',
      time: '4 hours ago',
      type: 'analysis'
    },
    {
      id: 3,
      title: 'Collaboration Invitation',
      description: 'Dr. Smith invited you to collaborate on "Neural Pathways"',
      time: '1 day ago',
      type: 'collaboration'
    },
    {
      id: 4,
      title: 'Module Completed',
      description: 'You completed "Advanced Brain Mapping Techniques"',
      time: '2 days ago',
      type: 'learning'
    }
  ];

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage users, content, and system settings from your admin control panel.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <SummaryCard
              key={index}
              title={card.title}
              value={card.value}
              change={card.change}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <CountChart />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
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

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => console.log('Navigate to new-users')}
                className="block w-full text-left p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Review New Users
              </button>
              <button
                onClick={() => console.log('Navigate to banned-users')}
                className="block w-full text-left p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Manage Banned Users
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Moderation</h3>
            <div className="space-y-3">
              <button
                onClick={() => console.log('Navigate to reported-posts')}
                className="block w-full text-left p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Review Reports
              </button>
              <button
                onClick={() => console.log('Navigate to pending-reviews')}
                className="block w-full text-left p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Pending Reviews
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Security</span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">2 Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
