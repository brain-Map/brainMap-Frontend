"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Star,
  MoreHorizontal,
  ArrowUpDown,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import TodoNotesSidebar from "@/components/TodoNotesSidebar";
import Pagination from "@/components/Pagination";
import { projectApi, ProjectResponse } from "@/services/projectApi";
import { useAuth } from "@/contexts/AuthContext";

export default function DomainExpertProjects() {
  const router = useRouter();
  const { user } = useAuth();


  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchMentorsProjects = async () => {
    try {
      setIsLoadingProjects(true);
      setProjectsError(null);
      const data = await projectApi.getMentorsProjects(user?.id);
      setProjects(data || []);
    } catch (e: any) {
      console.error("Failed to fetch mentors projects", e);
      setProjectsError(e?.response?.data?.message || e?.message || "Failed to load projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchMentorsProjects();
  }, [user?.id]);

  const handleClick = (projectId: string) => {
    router.push(`/domain-expert/projects/${projectId}`);
  };

  // Format projects for table
  const formatProjects = (projects: ProjectResponse[]) =>
    projects.map((project) => ({
      id: project.id || (project as any).projectId || (project as any).projectID || (project as any).project_id || undefined,
      name: project.title || "Untitled Project",
      description: project.description || "",
      type: project.type || "Team-managed software",
      starred: false,
      createdAt: project.createdAt,
      dueDate: project.dueDate,
      priority: project.priority,
      userName: project.userName || "Unknown User",
      avatar:
        project.avatar ||
        "https://uvekrjsbsjxvaveqtbnu.supabase.co/storage/v1/object/public/uploads/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg",
    }));

  const allProjects = formatProjects(projects);

  const filteredProjects = allProjects; // no extra filters for now

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const currentItems = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen flex justify-between">
      <div className="w-full pl-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Domain Expert — Projects</h1>
            {isLoadingProjects && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Loading projects...
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMentorsProjects}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isLoadingProjects}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error State */}
        {projectsError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="text-sm text-red-700">
                <strong>Error loading projects:</strong> {projectsError}
                <button
                  onClick={fetchMentorsProjects}
                  className="ml-2 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg ">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {isLoadingProjects ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          Loading projects...
                        </div>
                      ) : filteredProjects.length === 0 ? (
                        <div>
                          <p className="text-lg font-medium mb-2">No projects found</p>
                          <p className="text-sm">No mentor projects available.</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium mb-2">No projects match your search</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className={`p-1 rounded transition-colors text-gray-300 hover:text-gray-400`}>
                          <Star className={`w-4 h-4`} />
                        </button>

                        <span onClick={() => handleClick(project.id)} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors w-full">
                          {project.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {project.description ? (project.description.length > 50 ? project.description.slice(0, 50) + "..." : project.description) : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.dueDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="min-h-screen ml-6 bg-accent">
        <TodoNotesSidebar />
      </div>
    </div>
  );
}
