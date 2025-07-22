"use client";

import {useState, useEffect} from "react";
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
// import projects from "@/data/projects/projects"; // Assuming you have a projects data file
import { projectApi, CreateProjectRequest, ProjectResponse } from '@/services/projectApi';


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

  // Backend data states
    const [backendProjects, setBackendProjects] = useState<ProjectResponse[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [projectsError, setProjectsError] = useState<string | null>(null);
    const [showOnlyBackendProjects, setShowOnlyBackendProjects] = useState(false);

      // Fetch projects from backend
      const fetchProjects = async () => {
        try {
          setIsLoadingProjects(true);
          setProjectsError(null);
          const projects = await projectApi.getProjects();
          setBackendProjects(projects);
          console.log('Fetched projects:', projects);
        } catch (error: any) {
          console.error('Error fetching projects:', error);
          setProjectsError(error.response?.data?.message || error.message || 'Failed to fetch projects');
        } finally {
          setIsLoadingProjects(false);
        }
      };
    
      // Fetch projects on component mount
      useEffect(() => {
        fetchProjects();
      }, []);


        // Combine backend projects with static projects for display
  // You can choose to use only backend projects by removing the static projects
  const allProjects = showOnlyBackendProjects ? 
    backendProjects.map(project => ({
      id: project.id,
      name: project.title || 'Untitled Project',
      description: project.description || '',
      type: project.type || 'Team-managed software',
      lead: project.lead || { name: 'Unknown', initials: 'UK' },
      starred: false, // You can add this field to your backend response
      status: project.status || 'Active',
      createdAt: project.createdAt,
      deadline: project.dueDate,
      priority: project.priority,
    })) :
    [
      ...backendProjects.map(project => ({
        id: project.id,
        name: project.title || 'Untitled Project',
        description: project.description || '',
        type: project.type || 'Team-managed software',
        lead: project.lead || { name: 'Unknown', initials: 'UK' },
        starred: false, // You can add this field to your backend response
        status: project.status || 'Active',
        createdAt: project.createdAt,
        deadline: project.dueDate,
        priority: project.priority,
      })),

    ];


  const initialLimit = 5;
  const maxLimit = 6;

const visibleProjects = showAll
    ? allProjects.slice(0, maxLimit)
    : allProjects.slice(0, initialLimit);

  const canToggle = allProjects.length > initialLimit;


  const router = useRouter();
  // Admin Menu Items
  const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: Home, url: "/project-member/dashboard", pathname: "dashboard" },
    { title: "Projects", icon: FileText, url: "/project-member/projects", pathname: "projects" },
    { title: "Messages", icon: MessageSquare, url: "/project-member/chat" , pathname: "chat"},
    { title: "Calendar", icon: Calendar, url: "/project-member/calendar", pathname: "calendar" },
    { title: "Notes", icon: NotepadText , url: "/project-member/notes", pathname: "notes" },
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          PROJECTS
        </h3>
        {!isLoadingProjects && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {allProjects.length}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {isLoadingProjects ? (
          // Loading skeleton
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="px-3 py-3 rounded-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-12 h-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : visibleProjects.length === 0 ? (
          // Empty state
          <div className="px-3 py-6 text-center">
            <div className="text-gray-400 mb-2">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            </div>
            <p className="text-xs text-gray-500 font-medium">No projects yet</p>
            <p className="text-xs text-gray-400 mt-1">Create your first project to get started</p>
          </div>
        ) : (
          // Project list
          visibleProjects.map((item) => (
            <Link
              key={item.name}
              href={`/project-member/projects/${item.id}`}
              onClick={() => onNavigate?.(item.id)}
              className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                currentPage === item.id
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200"
              }`}
            >
              {/* Project Icon/Indicator */}
              <div className={`w-2 h-2 rounded-full transition-colors ${
                currentPage === item.id 
                  ? "bg-white" 
                  : "bg-primary/60 group-hover:bg-primary"
              }`}></div>
              
              {/* Project Name */}
              <div className="flex-1 min-w-0">
                <span className={`block font-medium truncate ${
                  currentPage === item.id ? "text-white" : "text-gray-900"
                }`}>
                  {item.name}
                </span>
                {item.description && (
                  <span className={`block text-xs truncate mt-0.5 ${
                    currentPage === item.id ? "text-white/80" : "text-gray-500"
                  }`}>
                    {item.description.length > 20 
                      ? item.description.slice(0, 20) + "..." 
                      : item.description}
                  </span>
                )}
              </div>
              
              {/* Status Badge */}
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                  currentPage === item.id 
                    ? "bg-white/20 text-white border border-white/30" 
                    : item.status === 'Active'
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : item.status === 'Completed'
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : item.status === 'On Hold'
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {item.status}
              </span>
            </Link>
          ))
        )}
      </div>      {/* Toggle Button */}
      {canToggle && allProjects.length > initialLimit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-3 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border-2 border-dashed border-gray-200 hover:border-gray-300 group"
        >
          <span>{showAll ? "Show Less" : `View ${allProjects.length - initialLimit} More`}</span>
          {showAll ? (
            <ChevronUp className="h-3 w-3 transition-transform group-hover:transform group-hover:-translate-y-0.5" />
          ) : (
            <ChevronDown className="h-3 w-3 transition-transform group-hover:transform group-hover:translate-y-0.5" />
          )}
        </button>
      )}
    </div>
          

        </div>
      </div>
    </div>
  );
}

export default StudentSideBar;
