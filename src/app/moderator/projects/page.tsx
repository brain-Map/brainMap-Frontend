"use client";

import { useEffect, useMemo, useState } from 'react';
import { adminApi, ProjectData } from '@/services/adminApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Filter, Loader2, MoreHorizontal, Search, FolderGit2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  // Delete dialog control
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<ProjectData | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Status change dialog control
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusProject, setStatusProject] = useState<ProjectData | null>(null);
  const [nextStatus, setNextStatus] = useState<ProjectData["status"] | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // ACTIVE | DONE | PAUSED | ABANDONED | PROHIBITED
  const [priorityFilter, setPriorityFilter] = useState("all"); // HIGH | MEDIUM | LOW
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // public | private
  const [datePeriod, setDatePeriod] = useState("all"); // today | 7d | 30d | 90d

  // Pagination (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllProjects(0, 200); // fetch larger page to filter client-side
      setProjects(response.content || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      show('Failed to fetch projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleStatusChange = async (projectId: string, newStatus: ProjectData["status"]) => {
    try {
      setUpdatingStatus(true);
      await adminApi.updateProjectStatus(projectId, newStatus);
      show('Project status updated successfully', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error updating project status:', error);
      show('Failed to update project status', 'error');
    } finally {
      setUpdatingStatus(false);
      setStatusOpen(false);
      setStatusProject(null);
      setNextStatus(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      setDeleting(true);
      await adminApi.deleteProject(projectId);
      show('Project deleted successfully', 'success');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      show('Failed to delete project', 'error');
    }
    finally {
      setDeleting(false);
      setDeleteOpen(false);
      setDeletingProject(null);
    }
  };

  const filtered = useMemo(() => {
    let list = [...projects];
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.userName.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter(p => p.status.toUpperCase() === statusFilter.toUpperCase());
    }
    if (priorityFilter !== "all") {
      list = list.filter(p => p.priority.toUpperCase() === priorityFilter.toUpperCase());
    }
    if (visibilityFilter !== "all") {
      const pub = visibilityFilter === 'public';
      list = list.filter(p => p.isPublic === pub);
    }
    if (datePeriod !== "all") {
      const now = new Date();
      if (datePeriod === 'today') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        list = list.filter(p => new Date(p.createdAt) >= start);
      } else {
        const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
        const days = daysMap[datePeriod];
        if (days) {
          const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
          list = list.filter(p => new Date(p.createdAt) >= since);
        }
      }
    }
    return list;
  }, [projects, searchTerm, statusFilter, priorityFilter, visibilityFilter, datePeriod]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter, visibilityFilter, datePeriod]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setVisibilityFilter("all");
    setDatePeriod("all");
    setCurrentPage(1);
  };

  const statusBadgeClass = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'ACTIVE') return 'bg-green-100 text-green-700';
    if (s === 'DONE') return 'bg-blue-100 text-blue-700';
    if (s === 'PAUSED') return 'bg-yellow-100 text-yellow-700';
    if (s === 'ABANDONED') return 'bg-red-100 text-red-700';
    if (s === 'PROHIBITED') return 'bg-gray-200 text-gray-700';
    return 'bg-gray-100 text-gray-700';
  };

  const priorityBadgeClass = (priority: string) => {
    const p = priority?.toUpperCase();
    if (p === 'HIGH') return 'bg-red-100 text-red-700';
    if (p === 'MEDIUM') return 'bg-amber-100 text-amber-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-3">
        {/* Header */}
        <div className="flex justify-between">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FolderGit2 className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 grid gap-1">
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-600">Browse, filter and manage all projects.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Projects</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, owner, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 lg:w-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                      <SelectItem value="PAUSED">Paused</SelectItem>
                      <SelectItem value="ABANDONED">Abandoned</SelectItem>
                      <SelectItem value="PROHIBITED">Prohibited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <Select value={datePeriod} onValueChange={setDatePeriod}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Periods" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 lg:mb-0"
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Projects ({paginated.length} of {filtered.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filtered.length <= itemsPerPage
                    ? "Showing all projects"
                    : `Filtered results: ${filtered.length} projects found`}
                </p>
              </div>
              {filtered.length > 0 && totalPages > 1 && (
                <div className="text-sm text-gray-500">Page {currentPage} of {totalPages}</div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-900 py-4">Project</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Owner</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Visibility</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Priority</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Due</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">Created</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                      <p className="text-gray-500 mb-4">No projects match your current search criteria.</p>
                      <Button variant="outline" onClick={clearFilters} className="border-gray-300 text-gray-700 hover:bg-gray-50">Clear Filters</Button>
                    </TableCell>
                  </TableRow>
                )}

                {loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-gray-600">Loading projects...</TableCell>
                  </TableRow>
                )}

                {!loading && paginated.map((project) => {
                  const created = new Date(project.createdAt);
                  const due = new Date(project.dueDate);
                  const createdStr = created.toLocaleDateString();
                  const dueStr = isNaN(due.getTime()) ? '-' : due.toLocaleDateString();
                  return (
                    <TableRow key={project.id} className="hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-600 line-clamp-2 max-w-xl">{project.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={project.avatar} />
                            <AvatarFallback>{project.userName?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                          <div className="grid">
                            <span className="font-medium text-gray-900">{project.userName}</span>
                            <span className="text-xs text-gray-500">{project.ownerId?.slice(0,8) || 'N/A'}...</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={project.isPublic ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}>
                          {project.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={priorityBadgeClass(project.priority)}>{project.priority}</Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={statusBadgeClass(project.status)}>{project.status}</Badge>
                      </TableCell>
                      <TableCell className="py-4 text-gray-700">{dueStr}</TableCell>
                      <TableCell className="py-4 text-gray-700">{createdStr}</TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => { setStatusProject(project); setNextStatus('ACTIVE'); setStatusOpen(true); }}
                              disabled={project.status === 'ACTIVE'}
                            >
                              Mark as Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => { setStatusProject(project); setNextStatus('DONE'); setStatusOpen(true); }}
                              disabled={project.status === 'DONE'}
                            >
                              Mark as Done
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => { setStatusProject(project); setNextStatus('PAUSED'); setStatusOpen(true); }}
                              disabled={project.status === 'PAUSED'}
                            >
                              Mark as Paused
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => { setStatusProject(project); setNextStatus('ABANDONED'); setStatusOpen(true); }}
                              disabled={project.status === 'ABANDONED'}
                            >
                              Mark as Abandoned
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => { setStatusProject(project); setNextStatus('PROHIBITED'); setStatusOpen(true); }}
                              disabled={project.status === 'PROHIBITED'}
                            >
                              Mark as Prohibited
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={(e) => {
                                // Open controlled delete dialog
                                setDeletingProject(project);
                                setDeleteOpen(true);
                              }}
                            >
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filtered.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) page = i + 1;
                    else if (currentPage <= 3) page = i + 1;
                    else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                    else page = currentPage - 2 + i;

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? "bg-[#3D52A0] text-white hover:bg-[#2A3B7D] border-[#3D52A0]"
                            : "border-gray-300 text-gray-700 hover:bg-white"
                        }
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controlled Delete Confirmation Dialog */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project?</AlertDialogTitle>
              <AlertDialogDescription>
                {deletingProject ? (
                  <>
                    You are about to delete "{deletingProject.title}". This action cannot be undone
                    and will permanently remove the project and all associated data.
                  </>
                ) : (
                  <>This action cannot be undone.</>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deleting || !deletingProject}
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deletingProject && handleDelete(deletingProject.id)}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Controlled Status Change Confirmation Dialog */}
        <AlertDialog open={statusOpen} onOpenChange={setStatusOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change project status?</AlertDialogTitle>
              <AlertDialogDescription>
                {statusProject && nextStatus ? (
                  <>
                    You are about to change the status of "{statusProject.title}" from
                    <span className="mx-1 font-medium">{statusProject.status}</span>
                    to
                    <span className="mx-1 font-medium">{nextStatus}</span>.
                  </>
                ) : (
                  <>Confirm changing the project status.</>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={updatingStatus}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={updatingStatus || !statusProject || !nextStatus}
                onClick={() => statusProject && nextStatus && handleStatusChange(statusProject.id, nextStatus)}
              >
                {updatingStatus ? 'Updating…' : 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
