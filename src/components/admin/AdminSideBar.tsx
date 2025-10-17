"use client";

import React from "react";
import {
  Home,
  Users,
  FileText,
  MessageSquare,
  Settings,
  CheckCircle,
  Lock,
  TrendingUp,
  Shield,
  Bell,
  Calendar,
  Flag,
  UserPlus,
  UserX,
  UserCheck,
  GraduationCap,
  Award,
  Wallet,
} from "lucide-react";
import { Router } from "next/router";

interface MenuItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url: string;
}

interface UserManagementItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url: string;
  count: string;
  color: string;
  children?: UserManagementItem[];
  isOpen?: boolean;
}

interface ModerationItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url: string;
  count: string;
  color: string;
}

interface AdminSideBarProps {
  currentPage: string;
  onNavigate?: (url: string) => void;
}

function AdminSideBar({ currentPage, onNavigate }: AdminSideBarProps) {
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = React.useState(false);

  // Check if current page is a user management child to keep dropdown open
  React.useEffect(() => {
    if (
      currentPage === "/admin/userManagement" ||
      currentPage === "/admin/members" ||
      currentPage === "/admin/experts" ||
      currentPage === "/admin/moderators"
    ) {
      setIsUsersDropdownOpen(true);
    }
  }, [currentPage]);
  // Admin Menu Items
  const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: Home, url: "/admin" },
    // { title: "Content", icon: FileText, url: "/admin/content" },
    { title: "Messages", icon: MessageSquare, url: "/admin/messages" },
    { title: "Calendar", icon: Calendar, url: "/admin/calendar" },
    // { title: "Settings", icon: Settings, url: "/admin/settings" },
    {title: "Transactions", icon: Wallet, url: "/admin/transactions"},
  ];

  // User Management Items
  const userManagement: UserManagementItem[] = [
    {
      title: "Users",
      url: "/admin/userManagement",
      icon: Users,
      count: "1847",
      color: "bg-blue-500",
      isOpen: isUsersDropdownOpen,
      children: [
        {
          title: "All Users",
          url: "/admin/userManagement",
          icon: Users,
          count: "1847",
          color: "bg-blue-500",
        },
        {
          title: "Members",
          url: "/admin/userManagement/members",
          icon: GraduationCap,
          count: "1534",
          color: "bg-green-500",
        },
        {
          title: "Domain Experts",
          url: "/admin/userManagement/domain-experts",
          icon: Award,
          count: "156",
          color: "bg-orange-500",
        },
        {
          title: "Moderators",
          url: "/admin/userManagement/moderators",
          icon: Shield,
          count: "12",
          color: "bg-purple-500",
        },
      ],
    },
    {
      title: "Active Users",
      icon: UserCheck,
      url: "/admin/userManagement/active-users",
      count: "1,284",
      color: "bg-blue-500",
    },
    {
      title: "Banned Users",
      icon: UserX,
      url: "/admin/userManagement/banned-users",
      count: "3",
      color: "bg-red-500",
    },
    {
      title: "Add Moderators",
      icon: UserPlus,
      url: "/admin/userManagement/addModerator",
      count: "12",
      color: "bg-green-500",
    },
  ];

  // Moderation Items
  const moderationItems: ModerationItem[] = [
    {
      title: "Reports",
      icon: Flag,
      url: "/admin/moderation/reports",
      count: "8",
      color: "bg-orange-500",
    },
    {
      title: "Pending Reports",
      icon: Bell,
      url: "/admin/moderation/report/pending",  
      count: "15",
      color: "bg-yellow-500",
    },
    // {
    //   title: "Security Alerts",
    //   icon: Shield,
    //   url: "/admin/moderation/security-alerts",
    //   count: "2",
    //   color: "bg-red-500",
    // },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="flex-1">
        {/* Header/Logo Section */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">AdminPanel</h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Main Menu */}
          <div>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => onNavigate?.(item.url)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === item.url
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

          {/* User Management */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              USER MANAGEMENT
            </h3>
            <div className="space-y-1">
              {userManagement.map((item) => (
                <React.Fragment key={item.title}>
                  <button
                    onClick={() => {
                      if (item.children && item.title === "Users") {
                        // Toggle dropdown
                        setIsUsersDropdownOpen(!isUsersDropdownOpen);
                        // Navigate to main Users page
                        onNavigate?.(item.url);
                      } else {
                        onNavigate?.(item.url);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentPage === item.url ||
                      (item.children &&
                        item.children.some(
                          (child) => currentPage === child.url
                        ))
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <span
                      className={`text-xs ${
                        currentPage === item.url ||
                        (item.children &&
                          item.children.some(
                            (child) => currentPage === child.url
                          ))
                          ? "text-blue-200"
                          : "text-gray-500"
                      }`}
                    >
                      {item.count}
                    </span>
                    {item.children && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform ${
                          item.isOpen ? "transform rotate-180" : ""
                        } ${
                          currentPage === item.url ||
                          (item.children &&
                            item.children.some(
                              (child) => currentPage === child.url
                            ))
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {item.children && item.isOpen && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <button
                          key={child.title}
                          onClick={() => onNavigate?.(child.url)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === child.url
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${child.color}`}
                          ></div>
                          <child.icon className="h-4 w-4" />
                          <span className="flex-1 text-left">
                            {child.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {child.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Moderation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              MODERATION
            </h3>
            <div className="space-y-1">
              {moderationItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => onNavigate?.(item.url)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === item.url
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  <span className="text-xs text-gray-500">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* System */}
          {/* <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              SYSTEM
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => onNavigate?.("/admin/compliance")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === "/admin/compliance"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Compliance Monitor</span>
              </button>
              <button
                onClick={() => onNavigate?.("/admin/security")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === "/admin/security"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>Security Center</span>
              </button>
              <button
                onClick={() => onNavigate?.("/admin/analytics")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === "/admin/analytics"
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Usage Analytics</span>
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AdminSideBar;
