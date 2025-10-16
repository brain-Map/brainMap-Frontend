'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  User,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Flag,
  Shield,
  UserX,
  MessageCircle,
  Ban,
  AlertCircle,
  Download,
  HelpCircle,
  ArrowLeft,
  DollarSign,
  Lock,
  Users,
  ShieldAlert
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

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  // Mock data - replace with actual data fetching
  const reports: Report[] = [
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
    // Add more reports as needed
  ];

  const report = reports.find(r => r.id === reportId);

  if (!report) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/moderator/reports')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Reports
        </button>
        
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">The report you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

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
      spam: MessageSquare,
      inappropriate: Flag,
      content_violation: FileText,
      fake_profile: User,
      scam: DollarSign,
      bullying: Users,
      hate_speech: MessageCircle,
      privacy_violation: Lock,
      copyright: FileText,
      misinformation: AlertCircle,
      other: HelpCircle
    };
    return icons[type] || HelpCircle;
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

  const handleResolveReport = (reportId: string) => {
    console.log('Resolving report:', reportId);
    // Add your resolution logic here
  };

  const handleDismissReport = (reportId: string) => {
    console.log('Dismissing report:', reportId);
    // Add your dismiss logic here
  };

  const handleReportToAdmin = (reportId: string) => {
    console.log('Reporting to admin:', reportId);
    // Add your report to admin logic here
  };

  const TypeIcon = getTypeIcon(report.type);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => router.push('/moderator/reports')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Reports
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl py-6 border border-blue-100">
        <div className="flex items-center justify-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${
                report.priority === 'critical' ? 'bg-red-100' : 
                report.priority === 'high' ? 'bg-orange-100' : 
                report.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <TypeIcon className={`w-6 h-6 ${
                  report.priority === 'critical' ? 'text-red-600' : 
                  report.priority === 'high' ? 'text-orange-600' : 
                  report.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report Overview</h1>
                <p className="text-sm text-gray-600">Report ID: #{report.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Report Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Title & Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{report.title}</h2>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs font-medium px-3 py-1 rounded-full border ${getPriorityBadge(report.priority)}`}>
                  <Flag className="w-3 h-3 mr-1" />
                  {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                </Badge>
                <Badge className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusBadge(report.status)}`}>
                  {report.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                  {report.status === 'investigating' && <Eye className="w-3 h-3 mr-1" />}
                  {report.status === 'dismissed' && <XCircle className="w-3 h-3 mr-1" />}
                  {report.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Badge>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-mono">
                  {getTypeDisplayName(report.type)}
                </span>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{report.description}</p>
          </div>

          {/* Reporter & Reported User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Reported By
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-blue-800 text-lg">{report.reportedBy.name}</p>
                <p className="text-sm text-blue-600">ID: {report.reportedBy.id}</p>
                <p className="text-xs text-blue-500">Reported: {formatDate(report.createdAt)}</p>
              </div>
            </div>
            
            {report.reportedUser && (
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                  <UserX className="w-5 h-5 mr-2" />
                  Reported User
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-red-800 text-lg">{report.reportedUser.name}</p>
                  <p className="text-sm text-red-600">ID: {report.reportedUser.id}</p>
                </div>
              </div>
            )}
          </div>

          {/* Moderator Assignment Info */}
          {(report.status === 'investigating' || report.status === 'resolved') && report.assignedTo && (
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Assigned Moderator
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-purple-800 text-lg">
                  {report.assignedTo === 'MOD-001' ? 'Moderator Alex' :
                   report.assignedTo === 'MOD-002' ? 'Moderator Jessica' :
                   report.assignedTo === 'MOD-003' ? 'Moderator Sam' :
                   report.assignedTo === 'ADMIN-001' ? 'Admin Sarah' :
                   report.assignedTo}
                </p>
                <p className="text-sm text-purple-600">ID: {report.assignedTo}</p>
                <p className="text-xs text-purple-500">
                  Status: {report.status === 'investigating' ? 'Currently investigating' : 'Investigation completed'}
                </p>
              </div>
            </div>
          )}

          {/* Reported Content/Evidence */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h3 className="font-semibold text-orange-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Reported Content/Evidence
              {report.reportedContent && (
                <span className="text-xs font-normal text-orange-600 ml-2">({report.reportedContent.type})</span>
              )}
            </h3>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              {report.reportedContent ? (
                <>
                  <p className="text-sm text-gray-700 italic">"{report.reportedContent.content}"</p>
                  <p className="text-xs text-orange-600 mt-3">Content ID: {report.reportedContent.id}</p>
                </>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-2">No specific content attached to this report</p>
                  <p className="text-xs text-gray-400">Evidence may include user behavior, profile information, or general conduct issues</p>
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Right Panel - Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button 
                onClick={() => handleResolveReport(report.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={report.status === 'resolved'}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Resolved
              </Button>

              <Button 
                onClick={() => handleDismissReport(report.id)}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                disabled={report.status === 'dismissed' || report.status === 'resolved'}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Dismiss Report
              </Button>

              <Button variant="outline" className="w-full hover:bg-blue-100">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Reporter
              </Button>
              
              <Button variant="outline" className="w-full hover:bg-blue-100">
                <User className="w-4 h-4 mr-2" />
                View Reported Profile
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspend Reported Profile
              </Button>

              <Button 
                onClick={() => handleReportToAdmin(report.id)}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                disabled={report.status === 'dismissed' || report.status === 'resolved'}
              >
                <ShieldAlert className="w-4 h-4 mr-2" />
                Report to Admin
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Report Created</p>
                  <p className="text-xs text-gray-500">{formatDate(report.createdAt)}</p>
                </div>
              </div>
              {report.updatedAt !== report.createdAt && (
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">{formatDate(report.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Additional Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-xs hover:bg-blue-100">
                <Download className="w-3 h-3 mr-2" />
                Export Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
