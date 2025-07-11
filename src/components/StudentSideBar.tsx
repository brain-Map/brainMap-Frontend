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
  NotepadText,
  ListChecks, 
} from "lucide-react";
import { useRouter } from "next/navigation";

interface MenuItem {
  title: string;
  icon: React.ComponentType<any>;
  url: string;
}

interface UserManagementItem {
  title: string;
  icon: React.ComponentType<any>;
  url: string;
  count: string;
  color: string;
  children?: UserManagementItem[];
  isOpen?: boolean;
}

interface ModerationItem {
  title: string;
  icon: React.ComponentType<any>;
  url: string;
  count: string;
  color: string;
}

interface AdminSideBarProps {
  currentPage: string;
  onNavigate?: (url: string) => void;
}

function StudentSideBar({ currentPage, onNavigate }: AdminSideBarProps) {
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = React.useState(false);
  const router = useRouter();
  // Admin Menu Items
  const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: Home, url: "dashboard" },
    { title: "Projects", icon: FileText, url: "projects" },
    { title: "Messages", icon: MessageSquare, url: "chat" },
    { title: "Calendar", icon: Calendar, url: "calendar" },
    { title: "Notes", icon: NotepadText , url: "notes" },
    { title: "To-do", icon: ListChecks  , url: "todo" },
    { title: "Settings", icon: Settings, url: "settings" },

  ];




  // Moderation Items
  const moderationItems: ModerationItem[] = [
    {
      title: "Reported Posts",
      icon: Flag,
      url: "reported-posts",
      count: "8",
      color: "bg-orange-500",
    },
    {
      title: "Pending Reviews",
      icon: Bell,
      url: "pending-reviews",
      count: "15",
      color: "bg-yellow-500",
    },
    {
      title: "Security Alerts",
      icon: Shield,
      url: "security-alerts",
      count: "2",
      color: "bg-red-500",
    },
  ];

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
                  onClick={() => {
                    router.push(item.url);
                    onNavigate?.(item.url);
                  }}

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


          {/* Moderation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              PROJECTS
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
                  <span className={`text-xs text-gray-500 ${
                    currentPage === item.url ? "text-white" : "text-gray-500"
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

export default StudentSideBar;
