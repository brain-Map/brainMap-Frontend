'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  User,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface WithdrawalRequest {
  id: string;
  expertId: string;
  expertName: string;
  expertEmail: string;
  amount: number;
  currency: string;
  paymentMethod: 'bank_transfer' | 'paypal' | 'payhere' | 'stripe' | 'crypto' | 'check';
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountHolderName: string;
  };
  paypalEmail?: string;
  payhereDetails?: {
    merchantId: string;
    phoneNumber: string;
  };
  stripeAccountId?: string;
  cryptoWallet?: {
    address: string;
    currency: string;
  };
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'dismissed';
  reason?: string;
  requestedAt: string;
  reviewedAt?: string;
  processedAt?: string;
  reviewedBy?: string;
  totalEarnings: number;
  withdrawableAmount: number;
  minimumThreshold: number;
  taxInfo?: {
    hasW9: boolean;
    taxId: string;
  };
  verificationStatus: 'verified' | 'pending' | 'failed';
  notes?: string;
  // Enhanced for BrainMap workflow
  sessionLogs: {
    totalSessions: number;
    completedSessions: number;
    pendingSessions: number;
    lastSessionDate: string;
  };
  pendingReports: number;
  disputeCount: number;
  lastWithdrawalDate?: string;
  withdrawalFrequency: 'first_time' | 'regular' | 'frequent' | 'suspicious';
  earnings: {
    sessionEarnings: number;
    packageEarnings: number;
    bonusEarnings: number;
    totalEarnings: number;
  };
  auditTrail: {
    requestSubmitted: string;
    moderatorAssigned?: string;
    reviewStarted?: string;
    verificationChecked?: string;
    decisionMade?: string;
    paymentProcessed?: string;
  };
}

export default function WithdrawalsPage() {
  const [withdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: 'WDR-001',
      expertId: 'EXP-001',
      expertName: 'Dr. Emily Johnson',
      expertEmail: 'emily.johnson@university.edu',
      amount: 1250.00,
      currency: 'USD',
      paymentMethod: 'payhere',
      payhereDetails: {
        merchantId: 'PAYHERE_MERCHANT_001',
        phoneNumber: '+94771234567'
      },
      status: 'pending',
      requestedAt: '2025-01-10T09:30:00Z',
      totalEarnings: 3750.00,
      withdrawableAmount: 1250.00,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-1234'
      },
      verificationStatus: 'verified',
      sessionLogs: {
        totalSessions: 45,
        completedSessions: 42,
        pendingSessions: 3,
        lastSessionDate: '2025-01-09T16:00:00Z'
      },
      pendingReports: 0,
      disputeCount: 0,
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 1100.00,
        packageEarnings: 150.00,
        bonusEarnings: 0.00,
        totalEarnings: 1250.00
      },
      auditTrail: {
        requestSubmitted: '2025-01-10T09:30:00Z',
        moderatorAssigned: '2025-01-10T09:45:00Z'
      }
    },
    {
      id: 'WDR-002',
      expertId: 'EXP-002',
      expertName: 'Prof. Michael Chen',
      expertEmail: 'michael.chen@techuni.edu',
      amount: 890.50,
      currency: 'USD',
      paymentMethod: 'bank_transfer',
      bankDetails: {
        accountNumber: '****1234',
        routingNumber: '021000021',
        bankName: 'Commercial Bank',
        accountHolderName: 'Michael Chen'
      },
      status: 'reviewing',
      requestedAt: '2025-01-09T16:20:00Z',
      reviewedAt: '2025-01-10T08:15:00Z',
      reviewedBy: 'MOD-002',
      totalEarnings: 2670.50,
      withdrawableAmount: 890.50,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-5678'
      },
      verificationStatus: 'verified',
      sessionLogs: {
        totalSessions: 28,
        completedSessions: 28,
        pendingSessions: 0,
        lastSessionDate: '2025-01-09T14:30:00Z'
      },
      pendingReports: 0,
      disputeCount: 1,
      lastWithdrawalDate: '2024-12-15T10:00:00Z',
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 720.50,
        packageEarnings: 170.00,
        bonusEarnings: 0.00,
        totalEarnings: 890.50
      },
      auditTrail: {
        requestSubmitted: '2025-01-09T16:20:00Z',
        moderatorAssigned: '2025-01-09T17:00:00Z',
        reviewStarted: '2025-01-10T08:15:00Z',
        verificationChecked: '2025-01-10T08:30:00Z'
      }
    },

    {
      id: 'WDR-006',
      expertId: 'EXP-006',
      expertName: 'Prof. David Kim',
      expertEmail: 'david.kim@businessschool.edu',
      amount: 750.00,
      currency: 'USD',
      paymentMethod: 'payhere',
      payhereDetails: {
        merchantId: 'PAYHERE_MERCHANT_006',
        phoneNumber: '+94712345678'
      },
      status: 'pending',
      requestedAt: '2025-01-10T15:30:00Z',
      totalEarnings: 2250.00,
      withdrawableAmount: 750.00,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-7890'
      },
      verificationStatus: 'pending',
      notes: 'Expert requesting expedited processing due to urgent financial need',
      sessionLogs: {
        totalSessions: 35,
        completedSessions: 33,
        pendingSessions: 2,
        lastSessionDate: '2025-01-10T14:00:00Z'
      },
      pendingReports: 0,
      disputeCount: 0,
      withdrawalFrequency: 'frequent',
      earnings: {
        sessionEarnings: 600.00,
        packageEarnings: 150.00,
        bonusEarnings: 0.00,
        totalEarnings: 750.00
      },
      auditTrail: {
        requestSubmitted: '2025-01-10T15:30:00Z'
      }
    },
    // Approved withdrawal requests
    {
      id: 'WDR-003',
      expertId: 'EXP-003',
      expertName: 'Dr. Sarah Williams',
      expertEmail: 'sarah.williams@medschool.edu',
      amount: 1150.75,
      currency: 'USD',
      paymentMethod: 'bank_transfer',
      bankDetails: {
        accountNumber: '****5678',
        routingNumber: '021000021',
        bankName: 'National Bank',
        accountHolderName: 'Sarah Williams'
      },
      status: 'approved',
      requestedAt: '2025-01-08T10:15:00Z',
      reviewedAt: '2025-01-08T14:30:00Z',
      processedAt: '2025-01-09T09:00:00Z',
      reviewedBy: 'MOD-001',
      totalEarnings: 4520.75,
      withdrawableAmount: 1150.75,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-9012'
      },
      verificationStatus: 'verified',
      sessionLogs: {
        totalSessions: 52,
        completedSessions: 50,
        pendingSessions: 2,
        lastSessionDate: '2025-01-08T16:30:00Z'
      },
      pendingReports: 0,
      disputeCount: 0,
      lastWithdrawalDate: '2024-11-20T10:00:00Z',
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 980.75,
        packageEarnings: 170.00,
        bonusEarnings: 0.00,
        totalEarnings: 1150.75
      },
      auditTrail: {
        requestSubmitted: '2025-01-08T10:15:00Z',
        moderatorAssigned: '2025-01-08T11:00:00Z',
        reviewStarted: '2025-01-08T14:30:00Z',
        verificationChecked: '2025-01-08T14:45:00Z',
        decisionMade: '2025-01-08T15:00:00Z',
        paymentProcessed: '2025-01-09T09:00:00Z'
      }
    },
    {
      id: 'WDR-004',
      expertId: 'EXP-004',
      expertName: 'Prof. James Anderson',
      expertEmail: 'james.anderson@engineering.edu',
      amount: 2100.00,
      currency: 'USD',
      paymentMethod: 'paypal',
      paypalEmail: 'james.anderson.payments@gmail.com',
      status: 'approved',
      requestedAt: '2025-01-07T13:45:00Z',
      reviewedAt: '2025-01-07T16:20:00Z',
      processedAt: '2025-01-08T11:30:00Z',
      reviewedBy: 'MOD-003',
      totalEarnings: 8750.00,
      withdrawableAmount: 2100.00,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-3456'
      },
      verificationStatus: 'verified',
      notes: 'Large withdrawal approved after thorough verification',
      sessionLogs: {
        totalSessions: 78,
        completedSessions: 75,
        pendingSessions: 3,
        lastSessionDate: '2025-01-07T18:00:00Z'
      },
      pendingReports: 0,
      disputeCount: 0,
      lastWithdrawalDate: '2024-12-01T10:00:00Z',
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 1850.00,
        packageEarnings: 200.00,
        bonusEarnings: 50.00,
        totalEarnings: 2100.00
      },
      auditTrail: {
        requestSubmitted: '2025-01-07T13:45:00Z',
        moderatorAssigned: '2025-01-07T14:00:00Z',
        reviewStarted: '2025-01-07T16:20:00Z',
        verificationChecked: '2025-01-07T16:35:00Z',
        decisionMade: '2025-01-07T17:00:00Z',
        paymentProcessed: '2025-01-08T11:30:00Z'
      }
    },
    // Rejected withdrawal requests
    {
      id: 'WDR-005',
      expertId: 'EXP-005',
      expertName: 'Dr. Maria Rodriguez',
      expertEmail: 'maria.rodriguez@university.edu',
      amount: 450.25,
      currency: 'USD',
      paymentMethod: 'bank_transfer',
      bankDetails: {
        accountNumber: '****9876',
        routingNumber: '021000021',
        bankName: 'City Bank',
        accountHolderName: 'Maria Rodriguez'
      },
      status: 'rejected',
      reason: 'Insufficient documentation - W9 form required before processing withdrawal',
      requestedAt: '2025-01-09T08:20:00Z',
      reviewedAt: '2025-01-09T12:45:00Z',
      reviewedBy: 'MOD-002',
      totalEarnings: 1350.25,
      withdrawableAmount: 450.25,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: false,
        taxId: ''
      },
      verificationStatus: 'failed',
      sessionLogs: {
        totalSessions: 18,
        completedSessions: 16,
        pendingSessions: 2,
        lastSessionDate: '2025-01-09T15:30:00Z'
      },
      pendingReports: 0,
      disputeCount: 0,
      withdrawalFrequency: 'first_time',
      earnings: {
        sessionEarnings: 380.25,
        packageEarnings: 70.00,
        bonusEarnings: 0.00,
        totalEarnings: 450.25
      },
      auditTrail: {
        requestSubmitted: '2025-01-09T08:20:00Z',
        moderatorAssigned: '2025-01-09T09:00:00Z',
        reviewStarted: '2025-01-09T12:45:00Z',
        verificationChecked: '2025-01-09T12:50:00Z',
        decisionMade: '2025-01-09T13:00:00Z'
      }
    },
    {
      id: 'WDR-007',
      expertId: 'EXP-007',
      expertName: 'Dr. Robert Lee',
      expertEmail: 'robert.lee@techcollege.edu',
      amount: 980.50,
      currency: 'USD',
      paymentMethod: 'payhere',
      payhereDetails: {
        merchantId: 'PAYHERE_MERCHANT_007',
        phoneNumber: '+94773456789'
      },
      status: 'rejected',
      reason: 'Multiple pending misconduct reports require investigation before withdrawal approval',
      requestedAt: '2025-01-09T14:10:00Z',
      reviewedAt: '2025-01-09T17:30:00Z',
      reviewedBy: 'MOD-001',
      totalEarnings: 2940.50,
      withdrawableAmount: 980.50,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-6789'
      },
      verificationStatus: 'verified',
      sessionLogs: {
        totalSessions: 41,
        completedSessions: 38,
        pendingSessions: 3,
        lastSessionDate: '2025-01-09T13:00:00Z'
      },
      pendingReports: 3,
      disputeCount: 5,
      lastWithdrawalDate: '2024-10-15T10:00:00Z',
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 780.50,
        packageEarnings: 150.00,
        bonusEarnings: 50.00,
        totalEarnings: 980.50
      },
      auditTrail: {
        requestSubmitted: '2025-01-09T14:10:00Z',
        moderatorAssigned: '2025-01-09T14:30:00Z',
        reviewStarted: '2025-01-09T17:30:00Z',
        verificationChecked: '2025-01-09T17:35:00Z',
        decisionMade: '2025-01-09T17:45:00Z'
      }
    },
    // Dismissed withdrawal request
    {
      id: 'WDR-008',
      expertId: 'EXP-008',
      expertName: 'Dr. Amanda Wilson',
      expertEmail: 'amanda.wilson@college.edu',
      amount: 325.75,
      currency: 'USD',
      paymentMethod: 'bank_transfer',
      bankDetails: {
        accountNumber: '****5432',
        routingNumber: '021000021',
        bankName: 'Regional Bank',
        accountHolderName: 'Amanda Wilson'
      },
      status: 'dismissed',
      reason: 'Duplicate withdrawal request - expert submitted same request twice within 24 hours',
      requestedAt: '2025-01-10T11:30:00Z',
      reviewedAt: '2025-01-10T13:15:00Z',
      reviewedBy: 'MOD-001',
      totalEarnings: 975.75,
      withdrawableAmount: 325.75,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-4567'
      },
      verificationStatus: 'verified',
      sessionLogs: {
        totalSessions: 22,
        completedSessions: 21,
        pendingSessions: 1,
        lastSessionDate: '2025-01-10T10:00:00Z'
      },
      pendingReports: 0,
      disputeCount: 0,
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 275.75,
        packageEarnings: 50.00,
        bonusEarnings: 0.00,
        totalEarnings: 325.75
      },
      auditTrail: {
        requestSubmitted: '2025-01-10T11:30:00Z',
        moderatorAssigned: '2025-01-10T12:00:00Z',
        reviewStarted: '2025-01-10T13:15:00Z',
        verificationChecked: '2025-01-10T13:20:00Z',
        decisionMade: '2025-01-10T13:25:00Z'
      }
    }
  ]);

  const [filter, setFilter] = useState({
    status: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      dismissed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return variants[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const filteredRequests = withdrawalRequests.filter(request => {
    const matchesSearch = request.expertName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filter.status === 'all' || request.status === filter.status;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: withdrawalRequests.filter(r => r.status === 'pending').length,
    reviewing: withdrawalRequests.filter(r => r.status === 'reviewing').length,
    approved: withdrawalRequests.filter(r => r.status === 'approved').length,
    rejected: withdrawalRequests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h1>
          <p className="text-gray-600 mt-1">Manage domain expert withdrawal requests and payments</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-yellow-600">Awaiting review</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviewing Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reviewing}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <Eye className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600">Under review</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500 text-white">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">Ready for payment</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
            <div className="p-3 rounded-full bg-red-500 text-white">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-red-600">Declined requests</span>
          </div>
        </div>
      </div>

      {/* Withdrawal Requests Management Section */}
      <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        {/* Filters and Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by expert name or request ID..."
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
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Withdrawal Requests List */}
        <div className="p-0">
          <div className="space-y-0">
            {filteredRequests.map((request, index) => {
              return (
                <div key={request.id} className={`p-5 ${index !== filteredRequests.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-all duration-200 group`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm bg-blue-100">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 text-base group-hover:text-gray-700 transition-colors">{request.expertName}</h4>
                            </div>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <Badge 
                                className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusBadge(request.status)}`}
                              >
                                {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                {request.status === 'reviewing' && <Eye className="w-3 h-3 mr-1" />}
                                {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                {request.status === 'dismissed' && <XCircle className="w-3 h-3 mr-1" />}
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-mono">#{request.id}</span>
                              <span className="text-lg font-bold text-green-600">{formatCurrency(request.amount)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Requested: {formatDate(request.requestedAt)}</span>
                          </div>
                          {request.status === 'reviewing' && request.reviewedAt && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>Review started: {formatDate(request.reviewedAt)}</span>
                            </div>
                          )}
                          {request.status === 'approved' && request.processedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Approved & processed: {formatDate(request.processedAt)}</span>
                            </div>
                          )}
                          {request.status === 'rejected' && request.reviewedAt && (
                            <div className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>Rejected: {formatDate(request.reviewedAt)}</span>
                            </div>
                          )}
                          {request.status === 'dismissed' && request.reviewedAt && (
                            <div className="flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>Dismissed: {formatDate(request.reviewedAt)}</span>
                            </div>
                          )}
                          {request.reviewedBy && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>By: {request.reviewedBy}</span>
                            </div>
                          )}
                        </div>

                        {/* Earnings Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="text-xs">
                            <span className="text-gray-600">Total Earned Amount (lifetime):</span>
                            <div className="font-bold text-green-700 text-sm">
                              {formatCurrency(request.totalEarnings)}
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-600">Current Available Balance:</span>
                            <div className="font-bold text-blue-700 text-sm">
                              {formatCurrency(request.withdrawableAmount)}
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-600">Amount Requested for Withdrawal:</span>
                            <div className="font-bold text-purple-700 text-sm">
                              {formatCurrency(request.amount)}
                            </div>
                          </div>
                        </div>

                        {/* BrainMap Supervision Info */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs">
                            <span className="text-gray-500">Expert Rating:</span>
                            <div className="font-semibold text-amber-600">
                              ⭐ 4.8/5.0 (127 reviews)
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">Misconduct Reports:</span>
                            <div className={`font-semibold ${request.pendingReports > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {request.pendingReports} pending
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">Time with BrainMap:</span>
                            <div className="font-semibold text-purple-600">
                              2 years, 4 months
                            </div>
                          </div>
                        </div>

                        {/* Approval/Success Message */}
                        {request.status === 'approved' && (
                          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <strong className="text-green-800 text-sm">Withdrawal Approved</strong>
                            </div>
                            <div className="text-xs text-green-700">
                              Payment of {formatCurrency(request.amount)} has been processed successfully.
                              {request.notes && <div className="mt-1 font-medium">Note: {request.notes}</div>}
                            </div>
                          </div>
                        )}

                        {/* Expert Notes */}
                        {request.notes && request.status !== 'approved' && (
                          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-amber-600" />
                              <strong className="text-amber-800 text-sm">Expert's Note</strong>
                            </div>
                            <div className="text-xs text-amber-700">
                              {request.notes}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Tax Info: <strong className={`${request.taxInfo?.hasW9 ? 'text-green-700' : 'text-red-700'}`}>
                            {request.taxInfo?.hasW9 ? 'W9 Complete' : 'W9 Required'}
                          </strong></span>
                          <span>Threshold: <strong className="text-gray-700">{formatCurrency(request.minimumThreshold)}</strong></span>
                        </div>
                        {request.reason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                            <strong>Rejection Reason:</strong> {request.reason}
                          </div>
                        )}

                        {/* Supervision Warnings */}
                        {(request.pendingReports > 0 || request.disputeCount > 2 || request.withdrawalFrequency === 'suspicious') && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <strong className="text-red-800 text-sm">Supervision Alert</strong>
                            </div>
                            <div className="space-y-1 text-xs text-red-700">
                              {request.pendingReports > 0 && (
                                <div>• {request.pendingReports} pending misconduct report(s) require investigation</div>
                              )}
                              {request.disputeCount > 2 && (
                                <div>• High dispute count ({request.disputeCount}) - review expert history</div>
                              )}
                              {request.withdrawalFrequency === 'suspicious' && (
                                <div>• Suspicious withdrawal pattern detected - verify legitimacy</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 ml-6">
                      {request.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-4 py-2 font-medium transition-all duration-200 text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                          
                          <Button 
                            size="sm" 
                            className="text-white text-xs px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 bg-green-600 hover:bg-green-700 border-green-600"
                            disabled={request.pendingReports > 0}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-4 py-2 font-medium transition-all duration-200 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-4 py-2 font-medium transition-all duration-200 text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Dismiss
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'reviewing' && (
                        <>
                          <Button 
                            size="sm" 
                            className="text-white text-xs px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 bg-green-600 hover:bg-green-700 border-green-600"
                            disabled={request.pendingReports > 0}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-4 py-2 font-medium transition-all duration-200 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-4 py-2 font-medium transition-all duration-200 text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Dismiss
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredRequests.length === 0 && (
            <div className="p-12 text-center">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No withdrawal requests found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms to find requests</p>
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