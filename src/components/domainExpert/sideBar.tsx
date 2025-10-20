"use client"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/ToastProvider'
import {
  Home,
  User,
  Package,
  BookOpen,
  ClipboardList,
  MessageSquare,
  Video,
  Star,
  CreditCard,
  FileText,
  Calendar,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface MenuItem {
  title: string
  icon: React.ComponentType<any>
  url: string
}

interface MenuSection {
  title: string
  icon: React.ComponentType<any>
  url: string
  count?: string
  color?: string
  children?: MenuSection[]
  isOpen?: boolean
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showAllProjects, setShowAllProjects] = useState(false)
  const { user } = useAuth()
  const { show: showToast } = useToast()

  const [verificationDocs, setVerificationDocs] = useState<any[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)

  const handleNavigate = (url: string) => {
    router.push(url)
  }

  // Main Menu Items
  const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: Home, url: "/domain-expert/dashboard" },
    { title: "Service Packages", icon: Package, url: "/domain-expert/packages" },
    { title: "Calendar", icon: Calendar, url: "/domain-expert/calendar" },
    { title: "Projects", icon: ClipboardList, url:"/domain-expert/projects"}
  ]

  // Student Management
  const studentManagement: MenuSection[] = [
    {
      title: "Appointment Requests",
      icon: BookOpen,
      url: "/domain-expert/requests",
    },
    {
      title: "Video Calls",
      url: "/domain-expert/video-calls",
      icon: Video,
    },
    {
      title: "Ratings & Reviews",
      icon: Star,
      url: "/domain-expert/reviews",
    },
  ]

  // Business Management
  const businessManagement: MenuSection[] = [
    {
      title: "Finances",
      icon: CreditCard,
      url: "/domain-expert/finances",
    },
  ]

  // Fetch verification documents for the logged-in domain expert
  useEffect(() => {
    const fetchDocs = async () => {
      if (!user?.id) return
      setLoadingDocs(true)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        const base = process.env.NEXT_PUBLIC_BACKEND_URL || `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
        const res = await fetch(`${base}/api/v1/domain-experts/${user.id}/verification-documents`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error('Failed to load verification documents')
        const data = await res.json()
        setVerificationDocs(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error('Error fetching verification docs', err)
      } finally {
        setLoadingDocs(false)
      }
    }

    fetchDocs()
  }, [user?.id])

  const handleResubmitFile = async (documentId: string, file?: File) => {
    if (!file) return
    if (!user?.id) {
      showToast('Missing user id', 'error')
      return
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`
      const fd = new FormData()
      fd.append('file', file)

      const resp = await fetch(`${base}/api/v1/domain-experts/${user.id}/verification-documents/${documentId}/resubmit`, {
        method: 'POST',
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '')
        showToast('Resubmit failed: ' + (txt || resp.statusText), 'error')
        return
      }

      const updated = await resp.json()
      setVerificationDocs((prev) => prev.map((d) => (String(d.id) === String(documentId) ? updated : d)))
      showToast('Document resubmitted successfully', 'success')
    } catch (err: any) {
      console.error(err)
      showToast('Resubmit failed: ' + (err?.message || 'unknown'), 'error')
    }
  }


  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex-1">
        <div className="p-4 space-y-6">
          {/* Main Menu */}
          <div>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigate(item.url)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    pathname === item.url
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Student Management */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">STUDENT MANAGEMENT</h3>
            <div className="space-y-1">
              {studentManagement.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigate(item.url)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.url
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {/* <div className={`w-2 h-2 rounded-full ${item.color}`}></div> */}
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Business Management */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">BUSINESS</h3>
            <div className="space-y-1">
              {businessManagement.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigate(item.url)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.url
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Verification Status - separate page */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">VERIFICATION</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('/domain-expert/verification-status')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === '/domain-expert/verification-status' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Verification Status</span>
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">SUPPORT</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate("/domain-expert/support")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === "/domain-expert/support"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Support & Help</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
