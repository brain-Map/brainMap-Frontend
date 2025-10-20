"use client"

import React from "react"
import Link from "next/link"
import { Package, Video, DollarSign, BookOpen, Users } from "lucide-react"

export default function QuickActions() {
  const actions = [
    { href: "/domain-expert/projects", title: "Projects", desc: "View and manage projects", icon: <Users className="h-5 w-5" /> },
    { href: "/domain-expert/profile-completion", title: "Complete Profile", desc: "Finish or edit your profile", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/domain-expert/packages", title: "Packages", desc: "Create or update packages", icon: <Package className="h-5 w-5" /> },
    { href: "/domain-expert/video-calls", title: "Video Calls", desc: "Join or schedule calls", icon: <Video className="h-5 w-5" /> },
    { href: "/domain-expert/finances", title: "Finances", desc: "View earnings and payouts", icon: <DollarSign className="h-5 w-5" /> },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((a) => (
          <Link key={a.href} href={a.href} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg hover:shadow-sm hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
              {a.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{a.title}</p>
              <p className="text-xs text-gray-500">{a.desc}</p>
            </div>
            <div className="text-primary text-sm font-medium">Go</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
