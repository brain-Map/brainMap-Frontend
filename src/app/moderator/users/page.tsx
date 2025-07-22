"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  UserCheck, 
  Clock,
  Search,
  Eye,
  Ban,
  TrendingUp,
  Activity
} from 'lucide-react';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  bannedUsers: number;
  newUsersThisMonth: number;
  growthRate: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'domain-expert' | 'project-member' | 'moderator';
  status: 'active' | 'pending' | 'banned' | 'inactive';
  joinDate: string;
  lastActive: string;
  projects: number;
  verified: boolean;
}

export default function ModeratorUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const router = useRouter();

  // Mock data - replace with actual API calls
  const userStats: UserStats = {
    totalUsers: 1247,
    activeUsers: 892,
    pendingUsers: 45,
    bannedUsers: 23,
    newUsersThisMonth: 156,
    growthRate: 12.5
  };

  const users: User[] = [
    // Example moderators
    {
      id: '19',
      name: 'Alice Moderator',
      email: 'alice.moderator@brainmap.com',
      role: 'moderator',
      status: 'active',
      joinDate: '2023-05-10',
      lastActive: '2024-07-11',
      projects: 0,
      verified: true
    },
    {
      id: '20',
      name: 'Bob Supervisor',
      email: 'bob.supervisor@brainmap.com',
      role: 'moderator',
      status: 'active',
      joinDate: '2024-01-20',
      lastActive: '2024-07-10',
      projects: 0,
      verified: true
    },
    {
      id: '21',
      name: 'Carol Admin',
      email: 'carol.admin@brainmap.com',
      role: 'moderator',
      status: 'inactive',
      joinDate: '2023-09-15',
      lastActive: '2024-06-30',
      projects: 0,
      verified: true
    },
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: 'project-member',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-07-10',
      projects: 3,
      verified: true
    },
    {
      id: '2',
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@university.edu',
      role: 'domain-expert',
      status: 'active',
      joinDate: '2023-11-20',
      lastActive: '2024-07-11',
      projects: 12,
      verified: true
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
      role: 'project-member',
      status: 'active',
      joinDate: '2024-07-08',
      lastActive: '2024-07-08',
      projects: 0,
      verified: false
    },
    {
      id: '4',
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      role: 'project-member',
      status: 'inactive',
      joinDate: '2024-03-12',
      lastActive: '2024-06-15',
      projects: 1,
      verified: true
    },
    {
      id: '5',
      name: 'Prof. David Brown',
      email: 'david.brown@university.edu',
      role: 'domain-expert',
      status: 'active',
      joinDate: '2023-09-05',
      lastActive: '2024-07-11',
      projects: 8,
      verified: true
    },
    {
      id: '6',
      name: 'Dr. Lisa Martinez',
      email: 'lisa.martinez@university.edu',
      role: 'domain-expert',
      status: 'pending',
      joinDate: '2024-07-09',
      lastActive: '2024-07-09',
      projects: 0,
      verified: false
    },
    {
      id: '7',
      name: 'Alex Thompson',
      email: 'alex.thompson@gmail.com',
      role: 'project-member',
      status: 'active',
      joinDate: '2024-02-22',
      lastActive: '2024-07-11',
      projects: 5,
      verified: true
    },
    {
      id: '8',
      name: 'Dr. Maria Rodriguez',
      email: 'maria.rodriguez@tech.edu',
      role: 'domain-expert',
      status: 'active',
      joinDate: '2023-08-14',
      lastActive: '2024-07-10',
      projects: 15,
      verified: true
    },
    {
      id: '9',
      name: 'James Wilson',
      email: 'james.wilson@outlook.com',
      role: 'project-member',
      status: 'inactive',
      joinDate: '2023-12-10',
      lastActive: '2024-05-20',
      projects: 2,
      verified: false
    },
    {
      id: '10',
      name: 'Prof. Jennifer Kim',
      email: 'jennifer.kim@university.edu',
      role: 'domain-expert',
      status: 'active',
      joinDate: '2023-06-18',
      lastActive: '2024-07-09',
      projects: 20,
      verified: true
    },
    {
      id: '11',
      name: 'Robert Davis',
      email: 'robert.davis@email.com',
      role: 'project-member',
      status: 'banned',
      joinDate: '2024-04-05',
      lastActive: '2024-06-12',
      projects: 1,
      verified: false
    },
    {
      id: '12',
      name: 'Dr. Ahmed Hassan',
      email: 'ahmed.hassan@research.org',
      role: 'domain-expert',
      status: 'pending',
      joinDate: '2024-07-11',
      lastActive: '2024-07-11',
      projects: 0,
      verified: false
    },
    {
      id: '13',
      name: 'Sophie Anderson',
      email: 'sophie.anderson@gmail.com',
      role: 'project-member',
      status: 'active',
      joinDate: '2024-06-01',
      lastActive: '2024-07-11',
      projects: 1,
      verified: true
    },
    {
      id: '14',
      name: 'Dr. Michael Chang',
      email: 'michael.chang@institute.edu',
      role: 'domain-expert',
      status: 'active',
      joinDate: '2023-10-30',
      lastActive: '2024-07-08',
      projects: 9,
      verified: true
    },
    {
      id: '15',
      name: 'Linda Garcia',
      email: 'linda.garcia@yahoo.com',
      role: 'project-member',
      status: 'active',
      joinDate: '2024-05-18',
      lastActive: '2024-07-10',
      projects: 2,
      verified: true
    },
    {
      id: '16',
      name: 'Prof. Richard Lee',
      email: 'richard.lee@college.edu',
      role: 'domain-expert',
      status: 'banned',
      joinDate: '2023-07-22',
      lastActive: '2024-04-15',
      projects: 3,
      verified: false
    },
    {
      id: '17',
      name: 'Jessica Miller',
      email: 'jessica.miller@hotmail.com',
      role: 'project-member',
      status: 'active',
      joinDate: '2024-07-01',
      lastActive: '2024-07-11',
      projects: 0,
      verified: false
    },
    {
      id: '18',
      name: 'Dr. Thomas White',
      email: 'thomas.white@research.edu',
      role: 'domain-expert',
      status: 'pending',
      joinDate: '2024-07-10',
      lastActive: '2024-07-10',
      projects: 0,
      verified: false
    }
  ];

  // Calculate domain expert approval statistics
  const domainExperts = users.filter(user => user.role === 'domain-expert');
  const approvedExperts = domainExperts.filter(expert => expert.status === 'active').length;
  const pendingExperts = domainExperts.filter(expert => expert.status === 'pending').length;
  const rejectedExperts = domainExperts.filter(expert => expert.status === 'banned').length;
  const totalExperts = domainExperts.length;

  const getStatusBadge = (status: User['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      banned: 'destructive',
      inactive: 'outline'
    } as const;

    const statusText = status === 'banned' ? 'suspended' : status;

    return (
      <Badge variant={variants[status]} className={`capitalize ${status === 'banned' ? 'bg-red-100 text-red-800 border-red-200' : ''}`}>
        {statusText}
      </Badge>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const colors = {
      'domain-expert': 'bg-purple-100 text-purple-800',
      'project-member': 'bg-green-100 text-green-800',
      'moderator': 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge variant="outline" className={`${colors[role]} border-0`}>
        {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  // Shuffle users array
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const shuffledUsers = shuffleArray(users);
  const filteredUsers = shuffledUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-7xl m-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage system users</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500 text-white">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+{userStats.growthRate}%</span>
              <span className="text-sm text-gray-600"> from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500 text-white">
                <UserCheck className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">{((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1)}%</span>
              <span className="text-sm text-gray-600"> of total users</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.pendingUsers}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500 text-white">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-yellow-600">Requires review</span>
              <span className="text-sm text-gray-600"> pending</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.newUsersThisMonth}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500 text-white">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-red-600">{userStats.bannedUsers} banned</span>
              <span className="text-sm text-gray-600"> users</span>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                User Distribution by Role
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Domain Experts</span>
                    <span className="text-sm font-semibold text-purple-600">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full w-[40%] transition-all duration-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Project Members</span>
                    <span className="text-sm font-semibold text-green-600">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-[60%] transition-all duration-500"></div>
                  </div>
                </div>

              {/* Moderators count row (no bar, just count) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Moderators</span>
                  <span className="text-sm font-semibold text-blue-600">{users.filter(u => u.role === 'moderator').length}</span>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                User Distribution by Status
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Active Users</span>
                    <span className="text-sm font-semibold text-green-600">{((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(userStats.activeUsers / userStats.totalUsers) * 100}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Pending Users</span>
                    <span className="text-sm font-semibold text-yellow-600">{((userStats.pendingUsers / userStats.totalUsers) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(userStats.pendingUsers / userStats.totalUsers) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Inactive Users</span>
                    <span className="text-sm font-semibold text-gray-600">{(((userStats.totalUsers - userStats.activeUsers - userStats.pendingUsers - userStats.bannedUsers) / userStats.totalUsers) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-600 h-2 rounded-full transition-all duration-500" style={{ width: `${((userStats.totalUsers - userStats.activeUsers - userStats.pendingUsers - userStats.bannedUsers) / userStats.totalUsers) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Banned Users</span>
                    <span className="text-sm font-semibold text-red-600">{((userStats.bannedUsers / userStats.totalUsers) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(userStats.bannedUsers / userStats.totalUsers) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                Domain Expert Approvals
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">Total Domain Experts</span>
                    <span className="text-lg font-bold text-blue-700">{totalExperts}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Approved Experts</span>
                    <span className="text-sm font-semibold text-green-600">
                      {totalExperts > 0 ? ((approvedExperts / totalExperts) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${totalExperts > 0 ? (approvedExperts / totalExperts) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{approvedExperts} of {totalExperts} experts</div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Pending Approval</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      {totalExperts > 0 ? ((pendingExperts / totalExperts) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${totalExperts > 0 ? (pendingExperts / totalExperts) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{pendingExperts} awaiting review</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Rejected/Banned</span>
                    <span className="text-sm font-semibold text-red-600">
                      {totalExperts > 0 ? ((rejectedExperts / totalExperts) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${totalExperts > 0 ? (rejectedExperts / totalExperts) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{rejectedExperts} rejected applications</div>
                </div>

                {pendingExperts > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">
                        {pendingExperts} expert{pendingExperts !== 1 ? 's' : ''} require{pendingExperts === 1 ? 's' : ''} your approval
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Directory */}
        <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                User Directory
              </h3>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="domain-expert">Domain Expert</option>
                <option value="project-member">Project Member</option>
                <option value="moderator">Moderator</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">User</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Join Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Last Active</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-sm font-semibold text-blue-700">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center">
                              {user.name}
                              {user.role === 'domain-expert' && user.status === 'active' && (
                                <UserCheck className="h-4 w-4 ml-2 text-green-600" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {user.role !== 'moderator' ? (
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                              onClick={() => router.push(`/moderator/users/${user.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {user.status === 'banned' ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                                disabled
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Suspended
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            )}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Try adjusting your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};