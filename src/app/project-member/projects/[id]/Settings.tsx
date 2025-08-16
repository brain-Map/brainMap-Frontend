"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Settings,
  Users,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Edit3,
  Shield,
  UserX,
  Crown,
} from "lucide-react";

// ---------------- Types ----------------
type ProjectData = {
  name: string;
  description: string;
  visibility: "private" | "public";
  defaultBranch: string;
};

type MemberRole = "viewer" | "developer" | "supervisor" | "admin";

type Member = {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  avatar: string;
};

type EditingState = {
  name: boolean;
  description: boolean;
};

type TempValues = {
  name?: string;
  description?: string;
};

type SidebarItem = {
  id: "general" | "members" | "security" | "danger";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

// ---------------- Component ----------------
const ProjectSettingsPage: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "BrainMap-Backend",
    description:
      "A comprehensive backend system for brain mapping visualization and data processing.",
    visibility: "private",
    defaultBranch: "main",
  });

  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin", avatar: "JD" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "developer", avatar: "JS" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "viewer", avatar: "MJ" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "supervisor", avatar: "SW" },
  ]);

  const [activeSection, setActiveSection] = useState<SidebarItem["id"]>("general");
  const [isEditing, setIsEditing] = useState<EditingState>({ name: false, description: false });
  const [tempValues, setTempValues] = useState<TempValues>({});

  // ---------------- Handlers ----------------
  const handleEdit = (field: keyof EditingState) => {
    setIsEditing({ ...isEditing, [field]: true });
    setTempValues({ ...tempValues, [field]: projectData[field] });
  };

  const handleSave = (field: keyof EditingState) => {
    setProjectData({ ...projectData, [field]: tempValues[field] as string });
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleCancel = (field: keyof EditingState) => {
    setIsEditing({ ...isEditing, [field]: false });
    setTempValues({ ...tempValues, [field]: projectData[field] });
  };

  const removeMember = (memberId: number) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const changeMemberRole = (memberId: number, newRole: MemberRole) => {
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
  };

  const getRoleColor = (role: MemberRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "supervisor":
        return "bg-purple-100 text-purple-800";
      case "developer":
        return "bg-blue-100 text-blue-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3 h-3" />;
      case "supervisor":
        return <Crown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const sidebarItems: SidebarItem[] = [
    { id: "general", label: "General", icon: Settings },
    { id: "members", label: "Members & Teams", icon: Users },
    { id: "security", label: "Security & Access", icon: Lock },
    { id: "danger", label: "Danger Zone", icon: Trash2 },
  ];

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex ">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Project Settings</h2>
          </div>
          <nav className="mt-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* === GENERAL SETTINGS === */}
          {activeSection === "general" && (
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">General Settings</h1>

              {/* Project Name */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Project Name</h3>
                  {!isEditing.name && (
                    <button
                      onClick={() => handleEdit("name")}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  )}
                </div>
                {isEditing.name ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={tempValues.name || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setTempValues({ ...tempValues, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave("name")}
                        className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => handleCancel("name")}
                        className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded">{projectData.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  {!isEditing.description && (
                    <button
                      onClick={() => handleEdit("description")}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  )}
                </div>
                {isEditing.description ? (
                  <div className="space-y-3">
                    <textarea
                      value={tempValues.description || ""}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setTempValues({ ...tempValues, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave("description")}
                        className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => handleCancel("description")}
                        className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{projectData.description}</p>
                )}
              </div>

              {/* Visibility */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Visibility</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={projectData.visibility === "private"}
                      onChange={(e) =>
                        setProjectData({ ...projectData, visibility: e.target.value as ProjectData["visibility"] })
                      }
                      className="mr-3"
                    />
                    <EyeOff className="w-4 h-4 mr-2" />
                    <div>
                      <span className="font-medium">Private</span>
                      <p className="text-sm text-gray-600">Only invited members can access this project</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={projectData.visibility === "public"}
                      onChange={(e) =>
                        setProjectData({ ...projectData, visibility: e.target.value as ProjectData["visibility"] })
                      }
                      className="mr-3"
                    />
                    <Eye className="w-4 h-4 mr-2" />
                    <div>
                      <span className="font-medium">Public</span>
                      <p className="text-sm text-gray-600">Anyone can view this project</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Default Branch */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Default Branch</h3>
                <input
                  type="text"
                  value={projectData.defaultBranch}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setProjectData({ ...projectData, defaultBranch: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 mt-2">
                  The default branch is considered the "base" branch in your repository.
                </p>
              </div>
            </div>
          )}

          {/* === MEMBERS SECTION === */}
          {activeSection === "members" && (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Members & Teams</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Invite Members
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Project Members</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage who has access to this project</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {members.map((member) => (
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
                          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            changeMemberRole(member.id, e.target.value as MemberRole)
                          }
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="developer">Developer</option>
                          <option value="supervisor">Supervisor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            member.role
                          )}`}
                        >
                          {getRoleIcon(member.role)}
                          <span className="ml-1">{member.role}</span>
                        </span>
                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === SECURITY SECTION === */}
          {activeSection === "security" && (
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Security & Access</h1>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Access Control</h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <div>
                      <span className="font-medium">Require two-factor authentication</span>
                      <p className="text-sm text-gray-600">All members must enable 2FA to access this project</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <div>
                      <span className="font-medium">Restrict repository creation</span>
                      <p className="text-sm text-gray-600">Only supervisors and admins can create new repositories</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <div>
                      <span className="font-medium">Require supervisor approval for merges</span>
                      <p className="text-sm text-gray-600">All pull requests must be approved by a supervisor</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* === DANGER ZONE === */}
          {activeSection === "danger" && (
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Danger Zone</h1>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Trash2 className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-red-900 mb-2">Delete Project</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete a project, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                      Delete Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;
