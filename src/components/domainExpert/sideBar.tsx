"use client"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
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
      count: "3",
    },
    {
      title: "Chat Messages",
      url: "/chat",
      icon: MessageSquare,
      count: "5",
    },
    {
      title: "Video Calls",
      url: "/domain-expert/video-calls",
      icon: Video,
      count: "2",
    },
    {
      title: "Ratings & Reviews",
      icon: Star,
      url: "/domain-expert/reviews",
      count: "12",
    },
  ]

  // Business Management
  const businessManagement: MenuSection[] = [
    {
      title: "Finances",
      icon: CreditCard,
      url: "/domain-expert/finances",
      count: "Rs. 3,240",
    },
  ]


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
                  <span className="text-xs text-gray-500">{item.count}</span>
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
                  <span className="text-xs text-gray-500">{item.count}</span>
                </button>
              ))}
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
