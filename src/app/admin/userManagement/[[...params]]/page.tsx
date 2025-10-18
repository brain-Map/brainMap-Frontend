"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Swal from 'sweetalert2';
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
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  UserRound,
} from "lucide-react";
import { useParams } from "next/navigation";
import api from "@/utils/api";
import { set } from "date-fns";

interface User {
  id: string;
  username: string;
  email: string;
  mobileNumber: string;
  userRole: 'PROJECT_MEMBER' | 'MENTOR' | 'MODERATOR' | 'ADMIN'; // Enum of possible user roles
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'; // Enum of possible statuses
  createdAt: string;
  updatedAt: string | null;
  avatar: string | null;
}

// Define interface for user status response
interface UserStatus {
  totalUsers: number;
  members: number;
  domainExperts: number;
  activeUsers: number;
  currentMonthUserGrowthRate: number;
  currentMonthMemberGrowthRate: number;
  currentMonthExpertGrowthRate: number;
  currentMonthActiveUserGrowthRate: number;
}

// Define interface for API response with pagination
interface UserListResponse {
  content: User[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
}

export default function AllUsersPage() {
  const [usersStatus, setUsersStatus] = useState<UserStatus | null>(null);
  const [userList, setUserList] = useState<UserListResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);// currentPage is 1-based for the UI
  const [itemsPerPage] = useState(5); // Use 1-based currentPage for the UI; backend expects 0-based page index
  const params = useParams();

  // Extract param from URL if present
  const allParams = params?.params as string[] | undefined;
  const param = allParams?.[0];

  // Fetch users from backend with filters and pagination
  // useCallback to memoize the function and avoid unnecessary re-fetches
  const fetchFilteredUsers = useCallback(async () => {
    try {
      // map frontend filters to backend params
      const roleMapToBackend: Record<string, string> = {
        'Member': 'PROJECT_MEMBER',
        'Domain Expert': 'MENTOR',
        'Moderator': 'MODERATOR',
        'Admin': 'ADMIN'
      };

      const statusMapToBackend: Record<string, string> = {
        'Active': 'ACTIVE',
        'Inactive': 'INACTIVE',
        'Banned': 'BANNED'
      };

      const apiPage = Math.max(0, currentPage - 1);
      let url = `/api/v1/admin/dashboard/userList?page=${apiPage}&size=${itemsPerPage}`;

      if (roleFilter && roleFilter !== 'all') {
        const backendRole = roleMapToBackend[roleFilter];
        if (backendRole) url += `&userRole=${backendRole}`;
      }

      if (statusFilter && statusFilter !== 'all') {
        const backendStatus = statusMapToBackend[statusFilter];
        if (backendStatus) url += `&userStatus=${backendStatus}`;
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const userListRes = await api.get(url);
      const data = userListRes?.data;
      if (data) {
        setUserList(data);

        // synchronize UI page with backend returned page number (backend likely 0-based)
        const fetchedPage = typeof data.pageable?.pageNumber === 'number' ? data.pageable.pageNumber : apiPage;
        const uiPage = fetchedPage + 1;
        if (uiPage !== currentPage) {
          // update without causing infinite loop; this will trigger a refetch only when necessary
          setCurrentPage(uiPage);
        }
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }, [currentPage, itemsPerPage, statusFilter, roleFilter, searchTerm]);

  // useEffect to filter users based on URL params
  
  // Initial fetch of users overview and user list
  useEffect(() => {
    async function fetchUsersOverview() {
      try {
        const usersStatusRes = await api.get('/api/v1/admin/dashboard/usersStatus');
        setUsersStatus(usersStatusRes.data);
      }
      catch (error) {
        console.error("Failed to load users overview:", error);
        setUsersStatus(null);
      }
    } 
    fetchUsersOverview();
  },[]);

  // Filter users based on search and filters
  // Since server provides paginated & filtered results, use backend content directly
  const filteredUsers = useMemo(() => {
    return userList?.content || [];
  }, [userList]);

  // Pagination
  const totalPages = Math.max(1, userList?.totalPages || 1);
  const totalUsers = userList?.totalElements ?? 0;
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
  // backend already paginates; items to render are the content
  const paginatedUsers = filteredUsers;

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  useEffect(() => {
  if (!param) return;

  const roleMapping: Record<string, string> = {
    "members": "Member",
    "domain-experts": "Domain Expert",
    "moderators": "Moderator",
    "admins": "Admin"
  };

  const statusMapping: Record<string, string> = {
    "active-users": "Active",
    "inactive-users": "Inactive",
    "banned-users": "Banned",
  };

  const lower = param.toLowerCase();

  if (roleMapping[lower]) {
    setRoleFilter(roleMapping[lower]);
    setStatusFilter("all");
    setCurrentPage(1); // ← reset page to first for filtered results
    console.log("rolemaped! ", lower)
    console.log("Role Filter:", roleFilter, "Status Filter:", statusFilter);
  } else if (statusMapping[lower]) {
    setStatusFilter(statusMapping[lower]);
    setRoleFilter("all");
    setCurrentPage(1); // ← reset page to first for filtered results
  } else {
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  }
}, [param]);

useEffect(() => {
  console.log("Role Filter changed:", roleFilter, "Status Filter:", statusFilter);
}, [roleFilter, statusFilter]);


  useEffect(() => {
    // Reset to first page whenever filters change
    fetchFilteredUsers();
  }, [fetchFilteredUsers, roleFilter, statusFilter, searchTerm]);

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
                  {usersStatus?.totalUsers || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500 text-white">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${(usersStatus?.currentMonthUserGrowthRate || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {(usersStatus?.currentMonthUserGrowthRate || 0) >= 0 ? "+": ""}{usersStatus?.currentMonthUserGrowthRate || 0}%</span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Members</p>
                <p className="text-2xl font-bold text-gray-900">
                   {usersStatus?.members || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${(usersStatus?.currentMonthMemberGrowthRate || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {(usersStatus?.currentMonthMemberGrowthRate || 0) >= 0 ? "+": ""}{usersStatus?.currentMonthMemberGrowthRate || 0}%</span>
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
                   {usersStatus?.domainExperts || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${(usersStatus?.currentMonthExpertGrowthRate || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {(usersStatus?.currentMonthExpertGrowthRate || 0) >= 0 ? "+": ""}{usersStatus?.currentMonthExpertGrowthRate || 0}%</span>
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
                  {usersStatus?.activeUsers || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${(usersStatus?.currentMonthActiveUserGrowthRate || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {(usersStatus?.currentMonthActiveUserGrowthRate || 0) >= 0 ? "+": ""}{usersStatus?.currentMonthActiveUserGrowthRate || 0}%</span>
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
                    placeholder="Search by name or email..."
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
                      <SelectItem value="Admin">Admin</SelectItem>
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
                  Users ({userList?.numberOfElements || "N/A"} of {totalUsers || "N/A"})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {(filteredUsers.length <= itemsPerPage)
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
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 py-4">
                    Updated Time
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
                {paginatedUsers.map((user: User, index: number) => {
                  // Map backend roles to display roles
                  const roleMap: Record<string, string> = {
                    'PROJECT_MEMBER': 'Member',
                    'MENTOR': 'Domain Expert',
                    'MODERATOR': 'Moderator',
                    'ADMIN': 'Admin'
                  };
                  
                  // Map backend status to display status
                  const statusMap: Record<string, string> = {
                    'ACTIVE': 'Active',
                    'INACTIVE': 'Inactive',
                    'BANNED': 'Banned'
                  };
                  
                  const displayRole = roleMap[user.userRole] || user.userRole;
                  const displayStatus = statusMap[user.status] || user.status;
                  
                  // Format date
                  const formatDate = (dateString: string | null) => {
                    if (!dateString) return 'N/A';
                    return new Date(dateString).toLocaleDateString('en-US', {
                      year: 'numeric', 
                      month: 'short'
                    });
                  };
                  
                  return (
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
                              src={user.avatar || "/image/user_placeholder.jpg"}
                            />
                            <AvatarFallback className="bg-[#3D52A0] text-white text-sm font-medium">
                              {user.username
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.username}
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
                            displayRole === "Domain Expert"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
                              : displayRole === "Moderator"
                              ? "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                          }
                        >
                          {displayRole}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={
                            displayStatus === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                              : displayStatus === "Banned"
                              ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
                          }
                        >
                          {displayStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 py-4">
                        {formatDate(user.updatedAt)}
                      </TableCell>
                      <TableCell className="text-gray-500 py-4">
                        {formatDate(user.createdAt)}
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
                            {/* <DropdownMenuItem className="cursor-pointer hover:bg-gray-50"> */}
                              {/* <Edit className="mr-2 h-4 w-4 text-gray-500" /> */}
                              {/* <span className="text-gray-700">Edit User</span> */}
                            {/* </DropdownMenuItem> */}
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                              <UserCheck className="mr-2 h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">Show Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                            className="cursor-pointer hover:bg-red-50 text-red-600"
                            onClick= { () => deleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
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
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i: number) => {
                    let page: number;
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
                    setCurrentPage(Math.min(totalPages || 1, currentPage + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 1}
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

  // Define deleteUser function inside the component to access the fetchFilteredUsers from useCallback
  async function deleteUser(user: User){
    // Use SweetAlert2 for confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${user.username}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete user',
      cancelButtonText: 'Cancel'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`/api/v1/admin/deleteUser/${user.id}`);
      // Call the fetchFilteredUsers that's defined inside the component
      await fetchFilteredUsers();
      
      // Show success message
      await Swal.fire({
        title: 'Deleted!',
        text: `User "${user.username}" has been deleted.`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      
      // Show error message
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to delete user. Check console for details.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  }
}

