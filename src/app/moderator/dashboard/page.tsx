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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-blue-800 block mb-1">Total Users</span>
                  <p className="text-2xl font-bold text-blue-900 mb-1">{stats.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center justify-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% growth
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300 relative">
                  <AlertTriangle className="w-8 h-8 text-white" />
                  {stats.pendingReports > 20 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">!</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-red-800 block mb-1">Pending Reports</span>
                  <p className="text-2xl font-bold text-red-900 mb-1">{stats.pendingReports}</p>
                  <div className="flex items-center justify-center text-xs text-red-700 bg-red-50 px-2 py-1 rounded-full">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    3 urgent
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-yellow-800 block mb-1">Expert Approvals</span>
                  <p className="text-2xl font-bold text-yellow-900 mb-1">{stats.expertApprovals}</p>
                  <div className="flex items-center justify-center text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    Awaiting review
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-sm font-semibold text-green-800 block mb-1">Withdrawal Requests</span>
                  <p className="text-2xl font-bold text-green-900 mb-1">{stats.withdrawalRequests}</p>
                  <div className="flex items-center justify-center text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    <DollarSign className="w-3 h-3 mr-1" />
                    $8,450 pending
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <Card className="lg:col-span-2 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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

          {/* Quick Actions */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                Quick Actions
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Button className="w-full justify-start text-sm py-3 bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Approve Experts
                </Button>
                <Button className="w-full justify-start text-sm py-3 bg-green-500 hover:bg-green-600 text-white" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Review Whitelist
                </Button>
                <Button className="w-full justify-start text-sm py-3 bg-red-500 hover:bg-red-600 text-white" size="sm">
                  <UserX className="w-4 h-4 mr-2" />
                  Suspend User
                </Button>
                <Button className="w-full justify-start text-sm py-3 bg-purple-500 hover:bg-purple-600 text-white" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expert Approval Queue */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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