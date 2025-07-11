"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Calendar,
  NotepadText,
  ListChecks,
  ChevronUp, 
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import projects from "@/data/projects/projects"; // Assuming you have a projects data file

interface MenuItem {
  title: string;
  icon: React.ComponentType<any>;
  url: string;
  pathname: string;
}



interface AdminSideBarProps {
  currentPage: string;
  onNavigate?: (url: string) => void;
}

function StudentSideBar({ currentPage, onNavigate }: AdminSideBarProps) {
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);
  const initialLimit = 5;
  const maxLimit = 10;

const visibleProjects = showAll
    ? projects.slice(0, maxLimit)
    : projects.slice(0, initialLimit);

  const canToggle = projects.length > initialLimit;


  const router = useRouter();
  // Admin Menu Items
  const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: Home, url: "/project-member/dashboard", pathname: "dashboard" },
    { title: "Projects", icon: FileText, url: "/project-member/projects", pathname: "projects" },
    { title: "Messages", icon: MessageSquare, url: "/project-member/chat" , pathname: "chat"},
    { title: "Calendar", icon: Calendar, url: "/project-member/calendar", pathname: "calendar" },
    { title: "Notes", icon: NotepadText , url: "/project-member/notes", pathname: "notes" },
    { title: "To-do", icon: ListChecks  , url: "/project-member/todo", pathname: "todo" },
    { title: "Settings", icon: Settings, url: "/project-member/settings", pathname: "settings" },

  ];



  return (
    <div className="sticky top-0 left-0 h-screen w-64 bg-white  border-r border-gray-200 flex flex-col z-50">
      <div className="flex-1">
        <div className="p-4 space-y-6">
          {/* Main Menu */}

          <div>
            <div className="space-y-1">
              {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentPage === item.pathname
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
            </div>
          </div>


          {/* Projects */}
          <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        PROJECTS
      </h3>
      <div className="space-y-1">
        {visibleProjects.map((item) => (
          <Link
            key={item.name}
            href={`/project-member/projects/${item.id}`}
            onClick={() => onNavigate?.(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPage === item.id
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${item.key}`}></div>
            <span className="flex-1 text-left">{item.name}</span>
            <span
              className={`text-xs ${
                currentPage === item.id ? "text-white" : "text-gray-500"
              }`}
            >
              {item.id}
            </span>
          </Link>
        ))}
      </div>

      {/* Toggle Button */}
      {canToggle && projects.length > initialLimit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 border-dashed"
        >
          {showAll ? "Show Less" : "View More"}
          {showAll ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          
        </button>
      )}
    </div>
          

        </div>
      </div>
    </div>
  );
}

export default StudentSideBar;
