import React, { useState, useEffect } from 'react';
import { UserX, Shield, Users, Eye, Code, X, Search } from 'lucide-react';
import api from "@/utils/api";


type MemberRole = 'MEMBER' | 'OWNER';
type SupervisorRole = 'supervisor';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: MemberRole;
}

interface Supervisor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: SupervisorRole;
  department?: string;
}

interface SearchUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  type: 'member' | 'supervisor';
  projectId?: string;
  position?: string;
  status?: string;
}


const memberSearch = {
  getUsers: async (query: string, type: 'member' | 'supervisor') => {
    try {
      const response = await api.get(
        `/api/v1/users/searchcollaborator?query=${encodeURIComponent(query)}&type=${type}`
      );
      console.log("Search Users:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  addUser: async (user: SearchUser) => {
    try {
      const response = await api.post('/api/v1/users/addcollaborator', user);
      console.log("Add User:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }
};



const MembersAndTeams = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'member' | 'supervisor'>('member');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);

  // const [filteredUsers, setFilteredUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  if (!searchQuery) {
    setSearchUsers([]);
    return;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await memberSearch.getUsers(searchQuery, modalType);

      const mappedUsers: SearchUser[] = res.map((u: any) => {
        const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ");
        return {
          id: u.id,
          name: fullName || u.username || u.email,
          username: u.username || u.email.split("@")[0],
          email: u.email,
          avatar: (u.firstName?.charAt(0) || u.username?.charAt(0) || u.email.charAt(0)).toUpperCase(),
          type: modalType,  // ✅ set type according to modal
        };
      });

      setSearchUsers(mappedUsers);
    } catch (err) {
      console.error("Search failed", err);
      setSearchUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const delayDebounce = setTimeout(() => {
    fetchUsers();
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchQuery, modalType]); // ✅ added modalType


  const filteredUsers = searchUsers.filter((user: SearchUser) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const changeMemberRole = (id: string, newRole: MemberRole) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, role: newRole } : member
    ));
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
  };

  const removeSupervisor = (id: string) => {
    setSupervisors(supervisors.filter(supervisor => supervisor.id !== id));
  };

  const openModal = (type: 'member' | 'supervisor') => {
    setModalType(type);
    setIsModalOpen(true);
    setSearchQuery('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchQuery('');
    setSelectedUsers([]);
  };

  const selectUser = (user: SearchUser) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeSelectedUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const addSelectedUsersToProject = () => {
    selectedUsers.forEach(async (user) => {
      if (modalType === 'supervisor') {
        const newSupervisor: Supervisor = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: 'supervisor',
          department: 'General'
        };
        setSupervisors(prev => [...prev, newSupervisor]);
      } else {
        const newMember: Member = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: 'MEMBER'
        };
        setMembers(prev => [...prev, newMember]);

        // Send to backend with required info
        const url = window.location.pathname;
        const match = url.match(/project-member\/projects\/(.*?)\//);
        const projectId = match ? match[1] : null;
        if (projectId) {
          try {
            await memberSearch.addUser({
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
              type: user.type,
              projectId: projectId,
              position: 'MEMBER',
              status: 'PENDING',
            });
            console.log('User added to backend successfully:', user);
          } catch (error) {
            console.error('Error adding user to backend:', error);
          }
        }
      }
    });
    closeModal();
  };

  const getMemberRoleColor = (role: MemberRole) => {
    switch (role) {
      case 'OWNER':
        return 'bg-red-100 text-red-800';
      // case 'developer':
      //   return 'bg-blue-100 text-blue-800';
      case 'MEMBER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMemberRoleIcon = (role: MemberRole) => {
    switch (role) {
      case 'OWNER':
        return <Shield className="w-3 h-3" />;
      case 'MEMBER':
        return <Code className="w-3 h-3" />;
      // case 'VIEWER':
      //   return <Eye className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Members & Teams</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => openModal('supervisor')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Add Supervisor
          </button>
          <button 
            onClick={() => openModal('member')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Invite Members
          </button>
        </div>
      </div>

      {/* Supervisors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Project Supervisors
          </h3>
          <p className="text-sm text-gray-600 mt-1">Supervisors who oversee project progress and team management</p>
        </div>
        <div className="divide-y divide-gray-200">
          {supervisors.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No supervisor available</div>
          ) : (
            supervisors.map((supervisor) => (
              <div key={supervisor.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    {supervisor.avatar}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{supervisor.name}</p>
                    <p className="text-sm text-gray-600">{supervisor.email}</p>
                    {supervisor.department && (
                      <p className="text-xs text-gray-500 mt-1">Department: {supervisor.department}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Supervisor
                  </span>
                  <button
                    onClick={() => removeSupervisor(supervisor.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Project Members
          </h3>
          <p className="text-sm text-gray-600 mt-1">Team members with different access levels to this project</p>
        </div>
        <div className="divide-y divide-gray-200">
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No member available</div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {member.avatar}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={member.role}
                    onChange={(e) => changeMemberRole(member.id, e.target.value as MemberRole)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MEMBER">member</option>
                    <option value="OWNER">Owner</option>
                  </select>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMemberRoleColor(
                      member.role
                    )}`}
                  >
                    {getMemberRoleIcon(member.role)}
                    <span className="ml-1 capitalize">{member.role}</span>
                  </span>
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Search Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-3xl mx-4 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Add people to your project
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              Search by email
            </p>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find people"
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-blue-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mb-4">
                <div className="space-y-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-blue-900 border border-blue-700 rounded"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-blue-300 truncate">
                            {user.username}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeSelectedUser(user.id)}
                        className="text-blue-300 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="max-h-64 overflow-y-auto mb-4 border border-gray-700 rounded">
              {searchQuery && filteredUsers.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {filteredUsers
                    .filter(user => !selectedUsers.find(selected => selected.id === user.id))
                    .map((user) => (
                    <div
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className="flex items-center p-3 hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-medium text-sm mr-3">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.username} • Invite collaborator
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery && filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No users found
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Start typing to search users
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addSelectedUsersToProject}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedUsers.length === 0}
              >
                {selectedUsers.length > 0 ? `Add ${selectedUsers[0]?.username || 'user'}${selectedUsers.length > 1 ? ` +${selectedUsers.length - 1}` : ''}` : 'Add to project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersAndTeams;