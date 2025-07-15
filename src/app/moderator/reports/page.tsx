'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  User,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Clock,
  Flag,
  UserX
} from 'lucide-react';

interface Report {
  id: string;
  type: 'harassment' | 'spam' | 'inappropriate' | 'content_violation' | 'fake_profile' | 'scam' | 'bullying' | 'hate_speech' | 'privacy_violation' | 'copyright' | 'misinformation' | 'other';
  title: string;
  description: string;
  reportedBy: {
    name: string;
    id: string;
    avatar?: string;
  };
  reportedUser?: {
    name: string;
    id: string;
    avatar?: string;
  };
  reportedContent?: {
    type: 'post' | 'comment' | 'message';
    content: string;
    id: string;
  };
  status: 'pending' | 'investigating' | 'dismissed' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState({
    status: 'all',
    priority: 'all',
    type: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const [reports] = useState<Report[]>([
    {
      id: 'RPT-001',
      type: 'harassment',
      title: 'Inappropriate messages in chat',
      description: 'User has been sending inappropriate messages to multiple female students in private chat.',
      reportedBy: { name: 'Sarah Johnson', id: 'USR-123' },
      reportedUser: { name: 'John Doe', id: 'USR-456' },
      status: 'pending',
      priority: 'high',
      createdAt: '2025-01-08T10:30:00Z',
      updatedAt: '2025-01-08T10:30:00Z',
    },
    {
      id: 'RPT-002',
      type: 'spam',
      title: 'Spam content in community post',
      description: 'User posted promotional content multiple times in the community forum.',
      reportedBy: { name: 'Mike Chen', id: 'USR-789' },
      reportedUser: { name: 'Spammer Bot', id: 'USR-999' },
      reportedContent: {
        type: 'post',
        content: 'Buy our amazing course for 90% off! Limited time offer!!!',
        id: 'POST-123'
      },
      status: 'investigating',
      priority: 'medium',
      createdAt: '2025-01-08T09:15:00Z',
      updatedAt: '2025-01-08T11:45:00Z',
      assignedTo: 'MOD-001'
    },
    {
      id: 'RPT-003',
      type: 'inappropriate',
      title: 'Inappropriate profile content',
      description: 'User has uploaded inappropriate images in their profile.',
      reportedBy: { name: 'Emily Davis', id: 'USR-321' },
      reportedUser: { name: 'Bad Actor', id: 'USR-666' },
      status: 'investigating',
      priority: 'high',
      createdAt: '2025-01-07T14:20:00Z',
      updatedAt: '2025-01-08T08:30:00Z',
      assignedTo: 'MOD-002'
    },
    {
      id: 'RPT-004',
      type: 'bullying',
      title: 'Cyberbullying in group chat',
      description: 'User keeps posting the same question in multiple forum categories.',
      reportedBy: { name: 'David Wilson', id: 'USR-555' },
      reportedUser: { name: 'Confused Student', id: 'USR-777' },
      status: 'dismissed',
      priority: 'low',
      createdAt: '2025-01-07T16:45:00Z',
      updatedAt: '2025-01-08T09:00:00Z',
      assignedTo: 'MOD-001'
    },
    {
      id: 'RPT-005',
      type: 'fake_profile',
      title: 'Fake expert profile',
      description: 'User is impersonating a well-known expert with fake credentials.',
      reportedBy: { name: 'Dr. Amanda Miller', id: 'USR-888' },
      reportedUser: { name: 'Fake Expert', id: 'USR-999' },
      status: 'pending',
      priority: 'critical',
      createdAt: '2025-01-08T14:30:00Z',
      updatedAt: '2025-01-08T14:30:00Z'
    },
    {
      id: 'RPT-006',
      type: 'scam',
      title: 'Financial scam attempt',
      description: 'User is trying to scam students by offering fake scholarship opportunities.',
      reportedBy: { name: 'Jennifer Lee', id: 'USR-234' },
      reportedUser: { name: 'Scammer Joe', id: 'USR-101' },
      status: 'investigating',
      priority: 'critical',
      createdAt: '2025-01-08T13:15:00Z',
      updatedAt: '2025-01-08T15:00:00Z',
      assignedTo: 'MOD-003'
    },
    {
      id: 'RPT-007',
      type: 'misinformation',
      title: 'Spreading false academic information',
      description: 'User is sharing incorrect information about university admission requirements.',
      reportedBy: { name: 'Academic Advisor', id: 'USR-345' },
      reportedUser: { name: 'Misinformed User', id: 'USR-678' },
      status: 'pending',
      priority: 'medium',
      createdAt: '2025-01-08T11:00:00Z',
      updatedAt: '2025-01-08T11:00:00Z'
    },
    {
      id: 'RPT-008',
      type: 'hate_speech',
      title: 'Discriminatory language in chat',
      description: 'User posted discriminatory content targeting specific ethnic groups.',
      reportedBy: { name: 'Community Member', id: 'USR-456' },
      reportedUser: { name: 'Offensive User', id: 'USR-789' },
      status: 'investigating',
      priority: 'high',
      createdAt: '2025-01-08T09:30:00Z',
      updatedAt: '2025-01-08T12:00:00Z',
      assignedTo: 'MOD-001'
    },
    {
      id: 'RPT-009',
      type: 'privacy_violation',
      title: 'Sharing personal information without consent',
      description: 'User posted screenshots containing other students\' private contact information.',
      reportedBy: { name: 'Privacy Advocate', id: 'USR-567' },
      reportedUser: { name: 'Careless User', id: 'USR-890' },
      status: 'pending',
      priority: 'high',
      createdAt: '2025-01-08T08:00:00Z',
      updatedAt: '2025-01-08T08:00:00Z'
    },
    {
      id: 'RPT-010',
      type: 'other',
      title: 'Repeated violation of community guidelines',
      description: 'User continues to violate multiple community guidelines despite warnings.',
      reportedBy: { name: 'Moderator Team', id: 'MOD-002' },
      reportedUser: { name: 'Repeat Offender', id: 'USR-901' },
      status: 'investigating',
      priority: 'medium',
      createdAt: '2025-01-08T07:00:00Z',
      updatedAt: '2025-01-08T10:30:00Z',
      assignedTo: 'MOD-003'
    },
    {
      id: 'RPT-011',
      type: 'spam',
      title: 'Promotional content in project discussion',
      description: 'User posted multiple promotional links for unrelated courses in project discussion threads.',
      reportedBy: { name: 'Student Leader', id: 'USR-445' },
      reportedUser: { name: 'Course Promoter', id: 'USR-556' },
      reportedContent: {
        type: 'post',
        content: 'Check out this amazing discount on programming courses! 70% off today only! Link: example.com/courses',
        id: 'POST-445'
      },
      status: 'resolved',
      priority: 'medium',
      createdAt: '2025-01-07T13:20:00Z',
      updatedAt: '2025-01-08T09:15:00Z',
      assignedTo: 'MOD-001'
    },
    {
      id: 'RPT-012',
      type: 'inappropriate',
      title: 'Inappropriate language in group chat',
      description: 'User used offensive language and inappropriate jokes in a project group chat.',
      reportedBy: { name: 'Project Member', id: 'USR-667' },
      reportedUser: { name: 'Inappropriate User', id: 'USR-778' },
      status: 'resolved',
      priority: 'low',
      createdAt: '2025-01-06T16:30:00Z',
      updatedAt: '2025-01-07T14:20:00Z',
      assignedTo: 'MOD-002'
    },
    {
      id: 'RPT-013',
      type: 'content_violation',
      title: 'Sharing copyrighted material without permission',
      description: 'User shared entire textbook chapters and copyrighted research papers in public forums.',
      reportedBy: { name: 'Academic Integrity Officer', id: 'USR-889' },
      reportedUser: { name: 'Material Sharer', id: 'USR-990' },
      reportedContent: {
        type: 'post',
        content: 'Here are the complete chapters from Advanced Machine Learning textbook for free download...',
        id: 'POST-667'
      },
      status: 'resolved',
      priority: 'high',
      createdAt: '2025-01-05T11:45:00Z',
      updatedAt: '2025-01-06T16:30:00Z',
      assignedTo: 'MOD-003'
    },
    {
      id: 'RPT-014',
      type: 'fake_profile',
      title: 'Impersonating university professor',
      description: 'User created a fake profile claiming to be Dr. Smith from Computer Science department.',
      reportedBy: { name: 'Real Dr. Smith', id: 'USR-111' },
      reportedUser: { name: 'Fake Dr. Smith', id: 'USR-222' },
      status: 'resolved',
      priority: 'critical',
      createdAt: '2025-01-04T09:00:00Z',
      updatedAt: '2025-01-05T12:30:00Z',
      assignedTo: 'ADMIN-001'
    },
    {
      id: 'RPT-015',
      type: 'harassment',
      title: 'Persistent unwanted contact',
      description: 'User continues to send unwanted messages despite being asked to stop multiple times.',
      reportedBy: { name: 'Student Victim', id: 'USR-333' },
      reportedUser: { name: 'Persistent User', id: 'USR-444' },
      status: 'resolved',
      priority: 'high',
      createdAt: '2025-01-03T14:15:00Z',
      updatedAt: '2025-01-04T10:45:00Z',
      assignedTo: 'MOD-001'
    }
  ]);

  const getStatusBadge = (status: Report['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      investigating: 'bg-blue-100 text-blue-800 border-blue-200',
      dismissed: 'bg-gray-100 text-gray-800 border-gray-200',
      resolved: 'bg-green-100 text-green-800 border-green-200'
    };
    return variants[status];
  };

  const getPriorityBadge = (priority: Report['priority']) => {
    const variants = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return variants[priority];
  };

  const getTypeIcon = (type: Report['type']) => {
    const icons = {
      harassment: AlertTriangle,
      spam: User,
      inappropriate: Flag,
      content_violation: Flag,
      fake_profile: User,
      scam: User,
      bullying: User,
      hate_speech: User,
      privacy_violation: User,
      copyright: Flag,
      misinformation: AlertTriangle,
      other: AlertTriangle
    };
    return icons[type] || AlertTriangle;
  };

  const getTypeDisplayName = (type: Report['type']) => {
    const names = {
      harassment: 'Harassment',
      spam: 'Spam',
      inappropriate: 'Inappropriate Content',
      content_violation: 'Content Violation',
      fake_profile: 'Fake Profile',
      scam: 'Scam',
      bullying: 'Bullying',
      hate_speech: 'Hate Speech',
      privacy_violation: 'Privacy Violation',
      copyright: 'Copyright Violation',
      misinformation: 'Misinformation',
      other: 'Other'
    };
    return names[type] || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewReport = (report: Report) => {
    router.push(`/moderator/reports/${report.id}`);
  };

  const handleInvestigateReport = (reportId: string) => {
    // Handle investigate action
    console.log('Investigating report:', reportId);
  };

  const handleResolveReport = (reportId: string) => {
    // Handle resolve action
    console.log('Resolving report:', reportId);
  };

  const handleDismissReport = (reportId: string) => {
    // Handle dismiss action
    console.log('Dismissing report:', reportId);
  };

  const handleAssignReport = (reportId: string, moderatorId: string) => {
    // Handle assign action
    console.log('Assigning report:', reportId, 'to:', moderatorId);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filter.status === 'all' || report.status === filter.status;
    const matchesPriority = filter.priority === 'all' || report.priority === filter.priority;
    const matchesType = filter.type === 'all' || report.type === filter.type;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const stats = {
    total: reports.length,
    critical: reports.filter(r => r.priority === 'critical').length,
    high: reports.filter(r => r.priority === 'high').length,
    medium: reports.filter(r => r.priority === 'medium').length,
    low: reports.filter(r => r.priority === 'low').length
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports and Complaints</h1>
          <p className="text-gray-600 mt-1">Monitor community health and manage reports & complaints</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600">All reports submitted</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Priority</p>
              <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
            </div>
            <div className="p-3 rounded-full bg-red-500 text-white">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-red-600">Immediate attention</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500 text-white">
              <Flag className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-orange-600">Urgent review needed</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-gray-900">{stats.medium}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-yellow-600">Moderate attention</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Priority</p>
              <p className="text-2xl font-bold text-gray-900">{stats.low}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500 text-white">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">Standard processing</span>
          </div>
        </div>
      </div>

      {/* Reports Management Section */}
      <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        {/* Filters and Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports by title, description, or user..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[120px]"
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="dismissed">Dismissed</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[120px]"
                value={filter.priority}
                onChange={(e) => setFilter({...filter, priority: e.target.value})}
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[120px]"
                value={filter.type}
                onChange={(e) => setFilter({...filter, type: e.target.value})}
              >
                <option value="all">All Types</option>
                <option value="harassment">Harassment</option>
                <option value="spam">Spam</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="content_violation">Content Violation</option>
                <option value="fake_profile">Fake Profile</option>
                <option value="scam">Scam</option>
                <option value="bullying">Bullying</option>
                <option value="hate_speech">Hate Speech</option>
                <option value="privacy_violation">Privacy Violation</option>
                <option value="copyright">Copyright</option>
                <option value="misinformation">Misinformation</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="p-0">
          <div className="space-y-0">
            {filteredReports.map((report, index) => {
              const TypeIcon = getTypeIcon(report.type);
              return (
                <div 
                  key={report.id} 
                  className={`p-5 ${index !== filteredReports.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-all duration-200 group cursor-pointer`}
                  onClick={() => handleViewReport(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                        report.priority === 'critical' ? 'bg-red-100' : 
                        report.priority === 'high' ? 'bg-orange-100' : 
                        report.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <TypeIcon className={`w-5 h-5 ${
                          report.priority === 'critical' ? 'text-red-600' : 
                          report.priority === 'high' ? 'text-orange-600' : 
                          report.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors mb-2">{report.title}</h4>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge 
                                className={`text-xs font-medium px-3 py-1 rounded-full ${
                                  report.priority === 'critical' 
                                    ? 'bg-red-100 text-red-800 border border-red-300' 
                                    : report.priority === 'high' 
                                    ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                                    : report.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                                }`}
                              >
                                <Flag className="w-3 h-3 mr-1" />
                                {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                              </Badge>
                              <Badge 
                                className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusBadge(report.status)}`}
                              >
                                {report.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                {report.status === 'investigating' && <Eye className="w-3 h-3 mr-1" />}
                                {report.status === 'dismissed' && <XCircle className="w-3 h-3 mr-1" />}
                                {report.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-mono">#{report.id}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Reported by: <strong className="text-gray-700">{report.reportedBy.name}</strong></span>
                          </div>
                          {report.reportedUser && (
                            <div className="flex items-center gap-1">
                              <UserX className="w-3 h-3" />
                              <span>Against: <strong className="text-gray-700">{report.reportedUser.name}</strong></span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(report.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 ml-6" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewReport(report)}
                        className="text-xs px-4 py-2 font-medium transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      
                      {report.status === 'pending' ? (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInvestigateReport(report.id);
                          }}
                          className="text-white text-xs px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 border-blue-600"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Investigate
                        </Button>
                      ) : report.status === 'investigating' ? (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolveReport(report.id);
                          }}
                          className="text-white text-xs px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 bg-green-600 hover:bg-green-700 border-green-600"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          disabled
                          className="text-white text-xs px-4 py-2 font-medium bg-gray-400 border-gray-400 cursor-not-allowed"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {report.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismissReport(report.id);
                        }}
                        className="text-xs px-4 py-2 font-medium transition-all duration-200 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        disabled={report.status === 'dismissed' || report.status === 'resolved'}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredReports.length === 0 && (
            <div className="p-12 text-center">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms to find reports</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}