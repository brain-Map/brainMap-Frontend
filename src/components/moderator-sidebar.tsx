"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  UserCheck,
  Settings,
  LogOut,
  BarChart3,
  Clock,
  DollarSign,
  Shield
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ComponentType<any>;
  url: string;
}

interface ModerationItem {
  title: string;
  icon: React.ComponentType<any>;
  url: string;
  count: string;
  color: string;
}

interface ModeratorSidebarProps {
  currentPage?: string;
  onNavigate?: (url: string) => void;
}

export default function ModeratorSidebar({ currentPage, onNavigate }: ModeratorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Main Menu Items
  const menuItems: MenuItem[] = [
    { title: "Overview", icon: LayoutDashboard, url: "/moderator/dashboard" },
    { title: "Users", icon: Users, url: "/moderator/users" },
    { title: "Analytics", icon: BarChart3, url: "/moderator/analytics" },
    { title: "Settings", icon: Settings, url: "/moderator/settings" },
  ];

  // Moderation Items
  const moderationItems: ModerationItem[] = [
    {
      title: "Reports",
      icon: AlertTriangle,
      url: "/moderator/reports",
      count: "23",
      color: "bg-red-500",
    },
    {
      title: "Expert Approval",
      icon: UserCheck,
      url: "/moderator/expert-approval",
      count: "8",
      color: "bg-yellow-500",
    },
    {
      title: "Withdrawals",
      icon: DollarSign,
      url: "/moderator/withdrawals",
      count: "15",
      color: "bg-green-500",
    },
    {
      title: "Activity Log",
      icon: Clock,
      url: "/moderator/activity",
      count: "42",
      color: "bg-blue-500",
    },
  ];

  const handleNavigate = (url: string) => {
    router.push(url);
    onNavigate?.(url);
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="flex-1">
        <div className="p-4 space-y-6">
          {/* Main Menu */}
          <div>
            <div className="space-y-1">
              {menuItems.map((item) => (
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
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Moderation Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              MODERATION
            </h3>
            <div className="space-y-1">
              {moderationItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleNavigate(item.url)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === item.url
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  <span className={`text-xs ${
                    pathname === item.url ? "text-white" : "text-gray-500"
                  }`}>{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}