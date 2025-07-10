'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  User,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Calendar,
  MoreVertical,
  FileText,
  TrendingUp,
  Users,
  Bell,
  Activity,
  AlertTriangle,
  CreditCard,
  Banknote,
  Wallet,
  Download,
  RefreshCw,
  ExternalLink,
  UserCheck,
  Lock,
  HelpCircle,
  Shield
} from 'lucide-react';

interface RecentActivity {
  id: string;
  type: 'withdrawal_approved' | 'withdrawal_rejected' | 'payment_processed' | 'verification_required';
  description: string;
  timestamp: string;
  moderator: string;
}

interface WithdrawalRequest {
  id: string;
  expertId: string;
  expertName: string;
  expertEmail: string;
  expertAvatar?: string;
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
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'processing' | 'completed';
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
  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: 'ACT-001',
      type: 'withdrawal_approved',
      description: 'Withdrawal request WDR-001 for $1,250 approved',
      timestamp: '2025-01-10T14:30:00Z',
      moderator: 'Admin Sarah'
    },
    {
      id: 'ACT-002',
      type: 'payment_processed',
      description: 'Payment of $890 processed to Dr. Smith',
      timestamp: '2025-01-10T13:15:00Z',
      moderator: 'Finance Team'
    },
    {
      id: 'ACT-003',
      type: 'withdrawal_rejected',
      description: 'Withdrawal request WDR-005 rejected - incomplete documentation',
      timestamp: '2025-01-10T11:45:00Z',
      moderator: 'Mod Alex'
    },
    {
      id: 'ACT-004',
      type: 'verification_required',
      description: 'Additional verification required for WDR-007',
      timestamp: '2025-01-10T10:20:00Z',
      moderator: 'Compliance Team'
    }
  ]);

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
      id: 'WDR-003',
      expertId: 'EXP-003',
      expertName: 'Dr. Sarah Williams',
      expertEmail: 'sarah.williams@medschool.edu',
      amount: 2100.00,
      currency: 'USD',
      paymentMethod: 'payhere',
      payhereDetails: {
        merchantId: 'PAYHERE_MERCHANT_003',
        phoneNumber: '+94777654321'
      },
      status: 'approved',
      requestedAt: '2025-01-08T14:45:00Z',
      reviewedAt: '2025-01-09T10:30:00Z',
      reviewedBy: 'MOD-001',
      totalEarnings: 6300.00,
      withdrawableAmount: 2100.00,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-9012'
      },
      verificationStatus: 'verified',
      sessionLogs: {
        totalSessions: 67,
        completedSessions: 65,
        pendingSessions: 2,
        lastSessionDate: '2025-01-08T18:00:00Z'
      },
      pendingReports: 0,
      disputeCount: 0,
      lastWithdrawalDate: '2024-11-20T15:30:00Z',
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 1800.00,
        packageEarnings: 300.00,
        bonusEarnings: 0.00,
        totalEarnings: 2100.00
      },
      auditTrail: {
        requestSubmitted: '2025-01-08T14:45:00Z',
        moderatorAssigned: '2025-01-08T15:00:00Z',
        reviewStarted: '2025-01-09T09:00:00Z',
        verificationChecked: '2025-01-09T09:30:00Z',
        decisionMade: '2025-01-09T10:30:00Z'
      }
    },
    {
      id: 'WDR-004',
      expertId: 'EXP-004',
      expertName: 'Dr. James Rodriguez',
      expertEmail: 'james.rodriguez@university.edu',
      amount: 560.25,
      currency: 'USD',
      paymentMethod: 'bank_transfer',
      bankDetails: {
        accountNumber: '****5678',
        routingNumber: '111000025',
        bankName: 'People\'s Bank',
        accountHolderName: 'James Rodriguez'
      },
      status: 'rejected',
      reason: 'Pending misconduct report requires investigation before withdrawal approval',
      requestedAt: '2025-01-07T11:20:00Z',
      reviewedAt: '2025-01-08T09:45:00Z',
      reviewedBy: 'MOD-003',
      totalEarnings: 1680.75,
      withdrawableAmount: 560.25,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: false,
        taxId: ''
      },
      verificationStatus: 'failed',
      notes: 'Expert has unresolved misconduct report - withdrawal blocked until investigation complete',
      sessionLogs: {
        totalSessions: 22,
        completedSessions: 18,
        pendingSessions: 4,
        lastSessionDate: '2025-01-06T11:00:00Z'
      },
      pendingReports: 2,
      disputeCount: 3,
      lastWithdrawalDate: '2024-10-05T12:00:00Z',
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 450.25,
        packageEarnings: 110.00,
        bonusEarnings: 0.00,
        totalEarnings: 560.25
      },
      auditTrail: {
        requestSubmitted: '2025-01-07T11:20:00Z',
        moderatorAssigned: '2025-01-07T12:00:00Z',
        reviewStarted: '2025-01-08T09:00:00Z',
        verificationChecked: '2025-01-08T09:30:00Z',
        decisionMade: '2025-01-08T09:45:00Z'
      }
    },
    {
      id: 'WDR-005',
      expertId: 'EXP-005',
      expertName: 'Dr. Lisa Thompson',
      expertEmail: 'lisa.thompson@engineering.edu',
      amount: 1575.00,
      currency: 'USD',
      paymentMethod: 'payhere',
      payhereDetails: {
        merchantId: 'PAYHERE_MERCHANT_005',
        phoneNumber: '+94781234567'
      },
      status: 'processing',
      requestedAt: '2025-01-06T13:15:00Z',
      reviewedAt: '2025-01-07T14:20:00Z',
      processedAt: '2025-01-09T11:30:00Z',
      reviewedBy: 'MOD-001',
      totalEarnings: 4725.00,
      withdrawableAmount: 1575.00,
      minimumThreshold: 100.00,
      taxInfo: {
        hasW9: true,
        taxId: '***-**-3456'
      },
      verificationStatus: 'verified',
      sessionLogs: {
        totalSessions: 52,
        completedSessions: 50,
        pendingSessions: 2,
        lastSessionDate: '2025-01-06T17:00:00Z'
      },
      pendingReports: 0,
      disputeCount: 0,
      lastWithdrawalDate: '2024-12-01T09:00:00Z',
      withdrawalFrequency: 'regular',
      earnings: {
        sessionEarnings: 1200.00,
        packageEarnings: 375.00,
        bonusEarnings: 0.00,
        totalEarnings: 1575.00
      },
      auditTrail: {
        requestSubmitted: '2025-01-06T13:15:00Z',
        moderatorAssigned: '2025-01-06T14:00:00Z',
        reviewStarted: '2025-01-07T10:00:00Z',
        verificationChecked: '2025-01-07T14:00:00Z',
        decisionMade: '2025-01-07T14:20:00Z',
        paymentProcessed: '2025-01-09T11:30:00Z'
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
    }
  ]);

  const [filter, setFilter] = useState({
    status: 'all',
    paymentMethod: 'all',
    verificationStatus: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return variants[status];
  };

  const getPaymentMethodIcon = (method: WithdrawalRequest['paymentMethod']) => {
    const icons = {
      bank_transfer: Banknote,
      paypal: Wallet,
      payhere: CreditCard,
      stripe: CreditCard,
      crypto: DollarSign,
      check: FileText
    };
    return icons[method] || DollarSign;
  };

  const getPaymentMethodName = (method: WithdrawalRequest['paymentMethod']) => {
    const names = {
      bank_transfer: 'Bank Transfer',
      paypal: 'PayPal',
      payhere: 'PayHere',
      stripe: 'Stripe',
      crypto: 'Cryptocurrency',
      check: 'Check'
    };
    return names[method] || 'Unknown';
  };

  const getVerificationIcon = (status: WithdrawalRequest['verificationStatus']) => {
    const icons = {
      verified: CheckCircle,
      pending: Clock,
      failed: XCircle
    };
    return icons[status];
  };

  const getVerificationColor = (status: WithdrawalRequest['verificationStatus']) => {
    const colors = {
      verified: 'text-green-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600'
    };
    return colors[status];
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    const icons = {
      withdrawal_approved: CheckCircle,
      withdrawal_rejected: XCircle,
      payment_processed: DollarSign,
      verification_required: AlertTriangle
    };
    return icons[type];
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    const colors = {
      withdrawal_approved: 'text-green-600',
      withdrawal_rejected: 'text-red-600',
      payment_processed: 'text-blue-600',
      verification_required: 'text-yellow-600'
    };
    return colors[type];
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
                         request.expertEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filter.status === 'all' || request.status === filter.status;
    const matchesPaymentMethod = filter.paymentMethod === 'all' || request.paymentMethod === filter.paymentMethod;
    const matchesVerification = filter.verificationStatus === 'all' || request.verificationStatus === filter.verificationStatus;

    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesVerification;
  });

  const stats = {
    total: withdrawalRequests.length,
    pending: withdrawalRequests.filter(r => r.status === 'pending').length,
    approved: withdrawalRequests.filter(r => r.status === 'approved').length,
    processing: withdrawalRequests.filter(r => r.status === 'processing').length,
    totalAmount: withdrawalRequests.reduce((sum, r) => sum + r.amount, 0),
    pendingAmount: withdrawalRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600">All withdrawal requests</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-yellow-600">Awaiting approval</span>
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
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500 text-white">
              <RefreshCw className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-purple-600">Payment in progress</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-500 text-white">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-indigo-600">All requests</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingAmount)}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500 text-white">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-orange-600">Awaiting review</span>
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
                  placeholder="Search by expert name, email, or request ID..."
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
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[140px]"
                value={filter.paymentMethod}
                onChange={(e) => setFilter({...filter, paymentMethod: e.target.value})}
              >
                <option value="all">All Payment Methods</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="payhere">PayHere</option>
                <option value="stripe">Stripe</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="check">Check</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[140px]"
                value={filter.verificationStatus}
                onChange={(e) => setFilter({...filter, verificationStatus: e.target.value})}
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Withdrawal Requests List */}
        <div className="p-0">
          <div className="space-y-0">
            {filteredRequests.map((request, index) => {
              const PaymentIcon = getPaymentMethodIcon(request.paymentMethod);
              const VerificationIcon = getVerificationIcon(request.verificationStatus);
              return (
                <div key={request.id} className={`p-5 ${index !== filteredRequests.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-all duration-200 group`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm bg-blue-100">
                        <PaymentIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900 text-base group-hover:text-gray-700 transition-colors">{request.expertName}</h4>
                              <VerificationIcon className={`w-4 h-4 ${getVerificationColor(request.verificationStatus)}`} />
                            </div>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <Badge 
                                className={`text-xs font-medium px-3 py-1 rounded-full border ${getStatusBadge(request.status)}`}
                              >
                                {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                {request.status === 'reviewing' && <Eye className="w-3 h-3 mr-1" />}
                                {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                {request.status === 'processing' && <RefreshCw className="w-3 h-3 mr-1" />}
                                {request.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-mono">#{request.id}</span>
                              <span className="text-lg font-bold text-green-600">{formatCurrency(request.amount)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Expert: <strong className="text-gray-700">{request.expertEmail}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PaymentIcon className="w-3 h-3" />
                            <span>Method: <strong className="text-gray-700">{getPaymentMethodName(request.paymentMethod)}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Requested: {formatDate(request.requestedAt)}</span>
                          </div>
                        </div>

                        {/* BrainMap Supervision Info */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs">
                            <span className="text-gray-500">Sessions:</span>
                            <div className="font-semibold text-gray-900">
                              {request.sessionLogs.completedSessions}/{request.sessionLogs.totalSessions} completed
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">Reports:</span>
                            <div className={`font-semibold ${request.pendingReports > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {request.pendingReports} pending
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">Disputes:</span>
                            <div className={`font-semibold ${request.disputeCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {request.disputeCount} total
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500">Frequency:</span>
                            <div className={`font-semibold ${
                              request.withdrawalFrequency === 'suspicious' ? 'text-red-600' : 
                              request.withdrawalFrequency === 'frequent' ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {request.withdrawalFrequency.charAt(0).toUpperCase() + request.withdrawalFrequency.slice(1)}
                            </div>
                          </div>
                        </div>

                        {/* Earnings Breakdown */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <span>Sessions: <strong className="text-gray-700">{formatCurrency(request.earnings.sessionEarnings)}</strong></span>
                          <span>Packages: <strong className="text-gray-700">{formatCurrency(request.earnings.packageEarnings)}</strong></span>
                          <span>Threshold: <strong className="text-gray-700">{formatCurrency(request.minimumThreshold)}</strong></span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Total Earnings: <strong className="text-gray-700">{formatCurrency(request.totalEarnings)}</strong></span>
                          <span>Withdrawable: <strong className="text-gray-700">{formatCurrency(request.withdrawableAmount)}</strong></span>
                          <span>Tax Info: <strong className={`${request.taxInfo?.hasW9 ? 'text-green-700' : 'text-red-700'}`}>
                            {request.taxInfo?.hasW9 ? 'W9 Complete' : 'W9 Required'}
                          </strong></span>
                        </div>
                        {request.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                            <strong>Note:</strong> {request.notes}
                          </div>
                        )}
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

                        {/* Audit Trail */}
                        {request.status !== 'pending' && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <strong className="text-blue-800 text-sm">Audit Trail</strong>
                            </div>
                            <div className="space-y-1 text-xs text-blue-700">
                              <div>• Request submitted: {formatDate(request.auditTrail.requestSubmitted)}</div>
                              {request.auditTrail.moderatorAssigned && (
                                <div>• Moderator assigned: {formatDate(request.auditTrail.moderatorAssigned)}</div>
                              )}
                              {request.auditTrail.reviewStarted && (
                                <div>• Review started: {formatDate(request.auditTrail.reviewStarted)}</div>
                              )}
                              {request.auditTrail.verificationChecked && (
                                <div>• Verification checked: {formatDate(request.auditTrail.verificationChecked)}</div>
                              )}
                              {request.auditTrail.decisionMade && (
                                <div>• Decision made: {formatDate(request.auditTrail.decisionMade)}</div>
                              )}
                              {request.auditTrail.paymentProcessed && (
                                <div>• Payment processed: {formatDate(request.auditTrail.paymentProcessed)}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 ml-6">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs px-4 py-2 font-medium transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      
                      {request.status === 'pending' && (
                        <>
                          {/* Show verification check button for suspicious or flagged cases */}
                          {(request.pendingReports > 0 || request.disputeCount > 2 || request.withdrawalFrequency === 'suspicious') && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs px-4 py-2 font-medium transition-all duration-200 text-orange-600 border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              Verify
                            </Button>
                          )}
                          
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
                        </>
                      )}
                      
                      {request.status === 'approved' && (
                        <Button 
                          size="sm" 
                          className="text-white text-xs px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 bg-purple-600 hover:bg-purple-700 border-purple-600"
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          Process via PayHere
                        </Button>
                      )}
                      
                      {request.status === 'reviewing' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs px-4 py-2 font-medium transition-all duration-200 text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                        >
                          <Activity className="w-3 h-3 mr-1" />
                          Complete Review
                        </Button>
                      )}
                      
                      <Button 
                        size="sm"
                        variant="ghost"
                        className="text-xs px-2 py-2 hover:bg-gray-100"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
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