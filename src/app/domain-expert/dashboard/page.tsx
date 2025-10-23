"use client"

import type React from "react"
import { DollarSign, Package, BookOpen, Star, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import api from '@/utils/api'
import { useAuth } from '@/contexts/AuthContext'; 
import ProfileSetupPopup from "@/components/domainExpert/profileSetup";
import QuickActions from '@/components/domainExpert/QuickActions';


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


export default function DashboardPage() {
  const [domainExpert, setDomainExpert] = useState<boolean | null>(null); // null means loading
  const { user } = useAuth();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [wallet, setWallet] = useState<{
    walletId?: string
    holdAmount?: number
    releasedAmount?: number
    systemCharged?: number
    withdrawnAmount?: number
  } | null>(null)
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<null | { verified: boolean; pendingItems?: string[] }>(
    null
  )
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  const [recentTx, setRecentTx] = useState<{
    transactionId: string
    amount: number
    senderName?: string
    receiverName?: string
    status?: string
    paymentType?: string
    createdAt?: string
  }[]>([])
  const [recentTxLoading, setRecentTxLoading] = useState(false)
  const [recentTxError, setRecentTxError] = useState<string | null>(null)
  const [pendingRequestsCount, setPendingRequestsCount] = useState<number | null>(null)
  const [pendingRequestsLoading, setPendingRequestsLoading] = useState(false)
  const [pendingRequestsError, setPendingRequestsError] = useState<string | null>(null)
  console.log("User: ", user);
  

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!user?.id) return;
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
  }, [user?.id]);
  console.log(localStorage.getItem("accessToken"));
  
  useEffect(() => {
    console.log("statussssssssssssss: ", domainExpert);

    if (domainExpert === false) {
      setShowProfilePopup(true);
    }
  }, [domainExpert]);
  
  // fetch wallet data (reuse Finances endpoint)
  useEffect(() => {
    if (!user?.id) return
    setWalletLoading(true)
    setWalletError(null)
    api
      .get(`/api/v1/wallet/${user.id}`)
      .then((res) => setWallet(res.data))
      .catch((err) => {
        console.error(err)
        setWalletError(err?.response?.data?.message || 'Failed to load wallet')
      })
      .finally(() => setWalletLoading(false))
  }, [user?.id])

  // fetch verification status (use profile-status or verification-documents)
  useEffect(() => {
    if (!user?.id) return
    setVerificationLoading(true)
    setVerificationError(null)
    api
      .get(`/api/v1/domain-experts/${user.id}/profile-status`)
      .then((res) => {
        // endpoint returns truthy when profile complete / verified; normalize
        setVerificationStatus({ verified: Boolean(res.data) })
      })
      .catch((err) => {
        console.error(err)
        setVerificationError(err?.response?.data?.message || 'Failed to load verification status')
        setVerificationStatus({ verified: false })
      })
      .finally(() => setVerificationLoading(false))
  }, [user?.id])

  // fetch recent transactions (show preview)
  useEffect(() => {
    if (!user?.id) return
    setRecentTxLoading(true)
    setRecentTxError(null)
    api
      .get(`/api/transactions/user/${user.id}`, { params: { page: 0, size: 3 } })
      .then((res) => {
        const items = res.data?.content || []
        setRecentTx(items)
      })
      .catch((err) => {
        console.error(err)
        setRecentTxError(err?.response?.data?.message || 'Failed to load recent transactions')
      })
      .finally(() => setRecentTxLoading(false))
  }, [user?.id])

  // fetch booking requests to compute pending requests count
  useEffect(() => {
    if (!user?.id) return
    setPendingRequestsLoading(true)
    setPendingRequestsError(null)
    // reuse the bookings endpoint used in Requests page
    api
      .get(`/api/v1/service-listings/mentor/${user.id}/bookings`)
      .then((res) => {
        const items = res.data || []
        // count pending statuses (normalize possible status fields)
        const mapped = Array.isArray(items) ? items : []
        const pending = mapped.filter((it: any) => (it.status || it.bookingStatus || '').toString().toUpperCase() === 'PENDING').length
        setPendingRequestsCount(pending)
      })
      .catch((err) => {
        console.error(err)
        setPendingRequestsError(err?.response?.data?.message || 'Failed to load requests')
        setPendingRequestsCount(0)
      })
      .finally(() => setPendingRequestsLoading(false))
  }, [user?.id])
  
  
  const dashboardCards: DashboardCard[] = [
    {
      title: "Total Earnings",
      value: walletLoading ? "Loading..." : (wallet ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format((wallet.releasedAmount || 0) + (wallet.holdAmount || 0)) : "Rs.0.00"),
      change: "+15%",
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-green-500",
    },
    // {
    //   title: "Active Packages",
    //   value: "8",
    //   change: "+3",
    //   icon: <Package className="h-6 w-6" />,
    //   color: "bg-primary",
    // },
    {
      title: "Pending Requests",
      value: pendingRequestsLoading ? 'Loading...' : (pendingRequestsCount != null ? String(pendingRequestsCount) : '0'),
      change: pendingRequestsError ? '!' : '+2',
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-orange-500",
    },
    // {
    //   title: "Average Rating",
    //   value: "4.8/5.0",
    //   change: "+0.2",
    //   icon: <Star className="h-6 w-6" />,
    //   color: "bg-yellow-500",
    // },
  ]

  // recentActivities will be fetched from the backend in future; keep empty by default
  const recentActivities: RecentActivity[] = []


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
        {/* <div className="w-full mb-8">
          {renderRevenueChart()}
        </div> */}

        {/* Verification & Wallet Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Verification Status</h2>
            {verificationLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : verificationError ? (
              <p className="text-sm text-red-600">{verificationError}</p>
            ) : verificationStatus?.verified ? (
              <p className="text-sm text-green-600">Verified — your profile is complete.</p>
            ) : (
              <div>
                <p className="text-sm text-gray-700">Not verified yet.</p>
                <div className="mt-3">
                  <button
                    className="inline-flex items-center rounded bg-primary px-3 py-1 text-white text-sm"
                    onClick={() => (window.location.href = '/domain-expert/verification-status')}
                  >
                    Upload documents
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600">Holding Amount</h3>
              <div className="mt-2 text-2xl font-bold text-gray-900">
                {walletLoading ? 'Loading...' : wallet ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(wallet.holdAmount || 0) : 'Rs.0.00'}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600">Released Amount</h3>
              <div className="mt-2 text-2xl font-bold text-gray-900">
                {walletLoading ? 'Loading...' : wallet ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(wallet.releasedAmount || 0) : 'Rs.0.00'}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600">Total Balance</h3>
              <div className="mt-2 text-2xl font-bold text-gray-900">
                {walletLoading ? 'Loading...' : wallet ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format((wallet.holdAmount || 0) + (wallet.releasedAmount || 0)) : 'Rs.0.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          {recentTxLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : recentTxError ? (
            <p className="text-sm text-red-600">{recentTxError}</p>
          ) : recentTx.length === 0 ? (
            <p className="text-sm text-gray-500">No recent transactions</p>
          ) : (
            <div className="space-y-3">
              {recentTx.map((t) => (
                <div key={t.transactionId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{t.paymentType || 'Transaction'}</p>
                    <p className="text-xs text-gray-500">{t.senderName || t.receiverName || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(t.amount || 0)}</p>
                    <p className="text-xs text-gray-500">{t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}</p>
                  </div>
                </div>
              ))}
              <div className="mt-3">
                <button className="text-sm text-primary underline" onClick={() => (window.location.href = '/domain-expert/finances')}>View all transactions</button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
