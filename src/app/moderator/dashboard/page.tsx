"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  AlertTriangle, 
  DollarSign,
  Clock,
  TrendingUp,
  FileText,
  Bell,
  Award,
  UserCheck,
  UserX,
  ExternalLink
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  pendingReports: number;
  expertApprovals: number;
  withdrawalRequests: number;
}

interface RecentReport {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'urgent' | 'resolved';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface ExpertApproval {
  id: string;
  name: string;
  date: string;
}

interface WithdrawalRequest {
  id: string;
  name: string;
  amount: string;
  method: string;
  requestDate: string;
}

export default function ModeratorDashboard() {
  // Sample data
  const stats: DashboardStats = {
    totalUsers: 2847,
    pendingReports: 23,
    expertApprovals: 8,
    withdrawalRequests: 15
  };

  const recentReports: RecentReport[] = [
    {
      id: '1',
      type: 'Inappropriate Content',
      description: 'Offensive language used in community post',
      status: 'urgent',
      date: '2 hours ago',
      priority: 'high'
    },
    {
      id: '2',
      type: 'Plagiarism Report',
      description: 'Research content copied by another user',
      status: 'pending',
      date: '4 hours ago',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'Technical Issue',
      description: 'Video call platform showing glitches',
      status: 'pending',
      date: '1 day ago',
      priority: 'low'
    }
  ];

  const expertApprovals: ExpertApproval[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      date: '2 days ago'
    },
    {
      id: '2',
      name: 'Prof. Michael Chen',
      date: '1 day ago'
    },
    {
      id: '3',
      name: 'Dr. Elena Rodriguez',
      date: '3 hours ago'
    },
    {
      id: '4',
      name: 'Prof. James Wilson',
      date: '5 hours ago'
    }
  ];

  const withdrawalRequests: WithdrawalRequest[] = [
    {
      id: '1',
      name: 'Emily Rodriguez',
      amount: '$1,250.00',
      method: 'Bank Transfer',
      requestDate: '3 hours ago'
    },
    {
      id: '2',
      name: 'David Thompson',
      amount: '$850.50',
      method: 'PayPal',
      requestDate: '1 day ago'
    },
    {
      id: '3',
      name: 'Sarah Mitchell',
      amount: '$2,100.75',
      method: 'Wire Transfer',
      requestDate: '6 hours ago'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage platform content and user activities</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              </div>
              <div className="p-3 rounded-full bg-red-500 text-white">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-red-600">3 urgent</span>
              <span className="text-sm text-gray-600"> require attention</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expert Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expertApprovals}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500 text-white">
                <Award className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-yellow-600">Awaiting review</span>
              <span className="text-sm text-gray-600"> pending</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Withdrawal Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withdrawalRequests}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500 text-white">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">$8,450 pending</span>
              <span className="text-sm text-gray-600"> total amount</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <Card className="lg:col-span-2 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                  Recent Reports
                </h3>
                <button className="hover:opacity-80 text-sm font-medium flex items-center" style={{ color: '#3D52A0' }}>
                  View All Reports
                  <ExternalLink className="w-4 h-4 ml-1" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 ml-8">
              <div className="space-y-0">
                {recentReports.map((report, index) => (
                  <div key={report.id} className={`p-5 ${index !== recentReports.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-all duration-200 group`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                          report.priority === 'high' ? 'bg-red-100' : 
                          report.priority === 'medium' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                          <AlertTriangle className={`w-5 h-5 ${
                            report.priority === 'high' ? 'text-red-600' : 
                            report.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-base group-hover:text-gray-700 transition-colors">{report.type}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium px-3 py-1 ${
                                report.priority === 'high' 
                                  ? 'bg-red-100 text-red-800 border-red-300' 
                                  : report.priority === 'medium' 
                                  ? 'bg-orange-100 text-orange-800 border-orange-300' 
                                  : 'bg-blue-100 text-blue-800 border-blue-300'
                              }`}
                            >
                              {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{report.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{report.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-8">
                        <Button 
                          size="sm" 
                          className="text-white text-xs px-6 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                          style={{ backgroundColor: '#3D52A0', borderColor: '#3D52A0' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2A3F7A';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3D52A0';
                          }}
                        >
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs px-6 py-2 font-medium transition-all duration-200"
                          style={{ borderColor: '#3D52A0', color: '#3D52A0' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#3D52A0';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#3D52A0';
                          }}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Analytics & Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                User Analytics & Distribution
              </h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            {/* User Distribution Chart */}
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Project Members</span>
                  <span className="text-sm text-gray-500">2,124</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{ 
                      width: `${(2124 / 2847) * 100}%`,
                      backgroundColor: '#3D52A0'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Domain Experts</span>
                  <span className="text-sm text-gray-500">723</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{ width: `${(723 / 2847) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#3D52A0' }}></div>
                  <span className="text-xs font-medium text-gray-600">Project Members</span>
                </div>
                <span className="text-lg font-bold text-gray-900">74.6%</span>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs font-medium text-gray-600">Domain Experts</span>
                </div>
                <span className="text-lg font-bold text-gray-900">25.4%</span>
              </div>
            </div>

            {/* User Activity Metrics */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Active Today</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">1,247 users</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-gray-600">New This Week</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">89 users</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">Inactive (30+ days)</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">342 users</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs py-2 font-medium transition-all duration-200"
                  style={{ borderColor: '#3D52A0', color: '#3D52A0' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3D52A0';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#3D52A0';
                  }}
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  View All Users
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs py-2 font-medium transition-all duration-200"
                  style={{ borderColor: '#10B981', color: '#10B981' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#10B981';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#10B981';
                  }}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Analytics
                </Button>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Total Active Users: <span className="text-gray-900 font-medium">2,847</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Growth: <span className="text-green-600 font-medium">+12% this month</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expert Approval Queue */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                  Expert Approval Queue
                </h3>
                <button className="hover:opacity-80 text-sm font-medium flex items-center" style={{ color: '#3D52A0' }}>
                  View All Experts
                  <ExternalLink className="w-4 h-4 ml-1" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 ml-8">
              <div className="space-y-0">
                {expertApprovals.map((expert, index) => (
                  <div key={expert.id} className={`p-5 ${index !== expertApprovals.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-all duration-200 group`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <span className="text-sm font-bold text-blue-700">{expert.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-base group-hover:text-gray-700 transition-colors">{expert.name}</h4>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Applied {expert.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-8">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs px-4 py-2 font-medium transition-all duration-200"
                          style={{ borderColor: '#3D52A0', color: '#3D52A0' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#3D52A0';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#3D52A0';
                          }}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="text-white text-xs px-6 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                          style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#059669';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#10B981';
                          }}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs px-6 py-2 font-medium transition-all duration-200"
                          style={{ borderColor: '#EF4444', color: '#EF4444' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#EF4444';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#EF4444';
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Withdrawal Requests */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                  Pending Withdrawal Requests
                </h3>
                <button className="hover:opacity-80 text-sm font-medium flex items-center" style={{ color: '#3D52A0' }}>
                  View All Requests
                  <ExternalLink className="w-4 h-4 ml-1" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 ml-8">
              <div className="space-y-0">
                {withdrawalRequests.map((request, index) => (
                  <div key={request.id} className={`p-5 ${index !== withdrawalRequests.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-all duration-200 group`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <span className="text-sm font-bold text-green-700">{request.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-base group-hover:text-gray-700 transition-colors">{request.name}</h4>
                            <span className="text-lg font-bold text-green-600">{request.amount}</span>
                          </div>
                          <p className="text-sm font-medium mb-1" style={{ color: '#3D52A0' }}>{request.method}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>Requested {request.requestDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-8">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs px-4 py-2 font-medium transition-all duration-200 w-full"
                          style={{ borderColor: '#3D52A0', color: '#3D52A0' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#3D52A0';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#3D52A0';
                          }}
                        >
                          Review
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            className="text-white text-xs px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                            style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#059669';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#10B981';
                            }}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-4 py-2 font-medium transition-all duration-200"
                            style={{ borderColor: '#EF4444', color: '#EF4444' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#EF4444';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#EF4444';
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}