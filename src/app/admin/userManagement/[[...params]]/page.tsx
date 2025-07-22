"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserPlus,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  UserRound,
} from "lucide-react";
import { useParams } from "next/navigation";

// Extended user data for demonstration
const allUsers = [
  {
    id: 1,
    name: "Sachith Dhanshka",
    email: "john.smith@university.edu",
    role: "Member",
    status: "Active",
    activities: 5,
    lastActive: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Sep 2024",
    subject: "Computer Science",
    university: "MIT",
    year: "3rd Year",
  },
  {
    id: 2,
    name: "Dr. Isuru Naveen",
    email: "sarah.wilson@expert.com",
    role: "Domain Expert",
    status: "Active",
    activities: 12,
    lastActive: "1 day ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Jan 2024",
    subject: "Mathematics",
    university: "Harvard University",
    experience: "15+ years",
  },
  {
    id: 3,
    name: "Dinuka Sahan",
    email: "mike.j@Member.edu",
    role: "Member",
    status: "Inactive",
    activities: 3,
    lastActive: "1 week ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Aug 2024",
    subject: "Physics",
    university: "Stanford",
    year: "2nd Year",
  },
  {
    id: 4,
    name: "Prof. Nadun Madusanka",
    email: "emily.davis@expert.com",
    role: "Domain Expert",
    status: "Active",
    activities: 8,
    lastActive: "30 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Mar 2024",
    subject: "Chemistry",
    university: "CalTech",
    experience: "20+ years",
  },
  {
    id: 5,
    name: "Kavinda Dimuthu",
    email: "alex.chen@university.edu",
    role: "Member",
    status: "Active",
    activities: 6,
    lastActive: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Oct 2024",
    subject: "Engineering",
    university: "UC Berkeley",
    year: "4th Year",
  },
  {
    id: 6,
    name: "Eraji Thenuwara",
    email: "lisa.r@Member.edu",
    role: "Member",
    status: "Active",
    activities: 4,
    lastActive: "1 hour ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Sep 2024",
    subject: "Biology",
    university: "Yale University",
    year: "1st Year",
  },
  {
    id: 7,
    name: "Dr. Kasun Dananjaya",
    email: "james.wilson@expert.com",
    role: "Domain Expert",
    status: "Active",
    activities: 15,
    lastActive: "3 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Feb 2024",
    subject: "Computer Science",
    university: "Princeton",
    experience: "12+ years",
  },
  {
    id: 8,
    name: "Virat Kholi",
    email: "maria.g@Member.edu",
    role: "Member",
    status: "Inactive",
    activities: 2,
    lastActive: "2 weeks ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Jul 2024",
    subject: "Literature",
    university: "Columbia",
    year: "2nd Year",
  },
  {
    id: 9,
    name: "Admin User",
    email: "admin@brainmap.com",
    role: "Moderator",
    status: "Active",
    activities: 0,
    lastActive: "5 minutes ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Jan 2024",
    subject: "Administration",
    university: "BrainMap Platform",
    role_type: "System Admin",
  },
  {
    id: 10,
    name: "David Beckham",
    email: "david.b@Member.edu",
    role: "Member",
    status: "Active",
    activities: 7,
    lastActive: "6 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Aug 2024",
    subject: "Mathematics",
    university: "Oxford",
    year: "3rd Year",
  },
  {
    id: 11,
    name: "Dr. Lionel Messi",
    email: "rachel.green@expert.com",
    role: "Domain Expert",
    status: "Active",
    activities: 11,
    lastActive: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Apr 2024",
    subject: "Psychology",
    university: "Cambridge",
    experience: "18+ years",
  },
  {
    id: 12,
    name: "Tom Anderson",
    email: "tom.a@Member.edu",
    role: "Member",
    status: "Active",
    activities: 9,
    lastActive: "1 hour ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Sep 2024",
    subject: "Engineering",
    university: "MIT",
    year: "4th Year",
  },
  {
    id: 13,
    name: "Jessica Smith",
    email: "jessica.s@banned.edu",
    role: "Member",
    status: "Banned",
    activities: 0,
    lastActive: "1 month ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "Jun 2024",
    subject: "Computer Science",
    university: "Local College",
    year: "2nd Year",
  },
  {
    id: 14,
    name: "Robert Johnson",
    email: "robert.j@banned.com",
    role: "Domain Expert",
    status: "Banned",
    activities: 0,
    lastActive: "3 weeks ago",
    avatar: "/placeholder.svg?height=32&width=32",
    joinDate: "May 2024",
    subject: "Physics",
    university: "Banned Institution",
    experience: "5+ years",
  },
];

export default function AllUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const params = useParams();

  // Get unique departments for filter
  const subjects = useMemo(() => {
    const subjs = [...new Set(allUsers.map((user) => user.subject))];
    return subjs.sort();
  }, []);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesSubject =
        subjectFilter === "all" || user.subject === subjectFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesSubject;
    });
  }, [searchTerm, roleFilter, statusFilter, subjectFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  //TO FILTER USER FROM PARAMS
  const allParams = params?.params as string[] | undefined;
  const param = allParams?.[0];

  // useEffect to filter users based on URL params
  useEffect(() => {
    if (param) {
      // Map URL params to actual role names
      const roleMapping: Record<string, string> = {
        members: "Member",
        member: "Member",
        "domain-experts": "Domain Expert",
        "domain-expert": "Domain Expert",
        moderators: "Moderator",
        moderator: "Moderator",
      };

      // Map URL params to actual status names
      const statusMapping: Record<string, string> = {
        "active-users": "Active",
        "inactive-users": "Inactive",
        "banned-users": "Banned",
        "all-users": "all"
      };

      // Check if the param is for status filtering
      if (statusMapping[param.toLowerCase()]) {
        const mappedStatus = statusMapping[param.toLowerCase()];
        setStatusFilter(mappedStatus);
        setRoleFilter("all"); // Reset role filter when filtering by status
        setCurrentPage(1);
      }
      // Check if the param is for role filtering
      else if (roleMapping[param.toLowerCase()]) {
        const mappedRole = roleMapping[param.toLowerCase()];
        setRoleFilter(mappedRole);
        setStatusFilter("all"); // Reset status filter when filtering by role
        setCurrentPage(1);
      }
      // If param doesn't match any mapping, reset filters
      else {
        setRoleFilter("all");
        setStatusFilter("all");
        setCurrentPage(1);
      }
    } else {
      // If no param, show all users
      setRoleFilter("all");
      setStatusFilter("all");
      setCurrentPage(1);
    }
  }, [param]);

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSubjectFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-3">
        {/* Header */}
        <div className="flex justify-between">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserRound className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 grid gap-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-gray-600">
                  Manage and oversee all users in the system.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className=""
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allUsers.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500 text-white">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+12%</span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allUsers.filter((u) => u.role === "Member").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+8%</span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Domain Experts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {allUsers.filter((u) => u.role === "Domain Expert").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+15%</span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {allUsers.filter((u) => u.status === "Active").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+5%</span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:w-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Domain Expert">Domain Expert</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Select
                    value={subjectFilter}
                    onValueChange={setSubjectFilter}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-[#3D52A0] focus:ring-[#3D52A0]">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subj) => (
                        <SelectItem key={subj} value={subj}>
                          {subj}
                        </SelectItem>
                      ))}
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

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Users ({filteredUsers.length} of {allUsers.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredUsers.length === allUsers.length
                    ? "Showing all users"
                    : `Filtered results: ${filteredUsers.length} users found`}
                </p>
              </div>
              {filteredUsers.length > 0 && totalPages > 1 && (
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-900 py-4">
                    User
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">
                    Role
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">
                    Subject
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">
                    Activities
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">
                    Last Active
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">
                    Join Date
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-900 py-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={`border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-gray-200">
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="bg-[#3D52A0] text-white text-sm font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className={
                          user.role === "Domain Expert"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
                            : user.role === "Moderator"
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600 font-medium">
                        {user.subject}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                            : user.status === "Banned"
                            ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-medium text-gray-900">
                        {user.activities}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 py-4">
                      {user.lastActive}
                    </TableCell>
                    <TableCell className="text-gray-500 py-4">
                      {user.joinDate}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white">
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                            <Edit className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">Edit User</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                            <UserCheck className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">Change Role</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-red-50 text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 mb-4">
                No users match your current search criteria.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} results
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
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

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
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
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
      </div>
    </div>
  );
}
