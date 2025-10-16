"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
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
  Crown,
  X,
  Globe
} from "lucide-react";
import MembersAndTeams from "./MemberSupervisorAdd";
import api from "@/utils/api";
import { useParams } from "next/navigation";


const projectSettingBackend = {
  getProjectDetails: async (projectId: string) => {
    try {
      const response = await api.get(`/project-member/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching project details:", error);
      throw error;
    }
  },

  updateProjectDetails: async (projectId: string, data: Partial<ProjectData>) => {
    try {
      const response = await api.put(`/project-member/projects/${projectId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating project details:", error);
      throw error;
    }
  },
};

// ---------------- Types ----------------
type ProjectData = {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  ownerId: string;
  status?: "ACTIVE" | "DONE" | "PAUSED" | "ABANDONED";
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
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
  visibility: boolean;
};

type TempValues = {
  name?: string;
  description?: string;
  visibility?: boolean;
};

type SidebarItem = {
  id: "general" | "members" | "security" | "danger";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ProjectSettingsPage: React.FC = () => {
  const { id } = useParams();

  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (id) {
        try {
          const data = await projectSettingBackend.getProjectDetails(
            Array.isArray(id) ? id[0] : id as string
          );
          console.log("Fetched project details:", data);
          setProjectData(data);
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };

    fetchProjectDetails();
  }, [id]);

  const [activeSection, setActiveSection] = useState<SidebarItem["id"]>("general");
  const [isEditing, setIsEditing] = useState<EditingState>({ name: false, description: false, visibility: false });
  const [tempValues, setTempValues] = useState<TempValues>({});
  const [showPopup, setShowPopup] = useState(false);
  const [tempVisibility, setTempVisibility] = useState<boolean | null>(null);

  const handleVisibilityClick = (newVisibility: boolean) => {
    setTempVisibility(newVisibility);
    setShowPopup(true);
  };

  // ---------------- Handlers ----------------
  const handleEdit = (field: keyof EditingState) => {
  if (!projectData) return;
  setIsEditing({ ...isEditing, [field]: true });
  if (field === "name") {
    setTempValues({ ...tempValues, name: projectData.title });
  } else if (field === "description") {
    setTempValues({ ...tempValues, description: projectData.description });
  } else if (field === "visibility") {
    setTempValues({ ...tempValues, visibility: projectData.isPublic });
  }
  };

  const handleSave = (field: keyof EditingState) => {
    if (!projectData) return;

    setProjectData({ ...projectData, isPublic: tempVisibility ?? projectData.isPublic });
    setShowPopup(false);
    setTempVisibility(null);

    const updatedValue = tempValues[field] as string;
    const updateObj: Partial<ProjectData> = {};
    if (field === "name") {
      updateObj.title = updatedValue;
    } else if (field === "description") {
      updateObj.description = updatedValue;
    } else if (field === "visibility") {
      if (tempVisibility !== null) {
        updateObj.isPublic = tempVisibility;
      }
    }

    projectSettingBackend.updateProjectDetails(projectData.id, updateObj)
      .then((data) => {
        setProjectData({ ...projectData, ...updateObj });
        setIsEditing({ ...isEditing, [field]: false });
      })
      .catch((error) => {
        // Optionally show error to user
        console.error("Failed to update project:", error);
      });
  };

  const handleCancel = (field?: keyof EditingState) => {
    if (typeof field !== "undefined") {
      if (!projectData) return;
      setIsEditing({ ...isEditing, [field]: false });
      setTempValues({
        ...tempValues,
        [field]:
          field === "name"
            ? projectData.title
            : field === "description"
            ? projectData.description
            : field === "visibility"
            ? projectData.isPublic
            : ""
      });
    }
    setShowPopup(false);
    setTempVisibility(null);
  };


  const sidebarItems: SidebarItem[] = [
    { id: "general", label: "General", icon: Settings },
    { id: "members", label: "Members & Teams", icon: Users },
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
                  <p className="text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded">{projectData?.title}</p>
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
                  <p className="text-gray-700">{projectData?.description}</p>
                )}
              </div>

              {/* Visibility */}
               <div className="">
                {/* Main Visibility Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Visibility</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={projectData?.isPublic === false}
                        onChange={() => handleVisibilityClick(false)}
                        className="mr-3 text-blue-600"
                      />
                      <EyeOff className="w-4 h-4 mr-2 text-gray-600" />
                      <div>
                        <span className="font-medium text-gray-900">Private</span>
                        <p className="text-sm text-gray-600">Only invited members can access this project</p>
                      </div>
                    </label>
                    <label className="flex items-center cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={projectData?.isPublic === true}
                        onChange={() => handleVisibilityClick(true)}
                        className="mr-3 text-blue-600"
                      />
                      <Eye className="w-4 h-4 mr-2 text-gray-600" />
                      <div>
                        <span className="font-medium text-gray-900">Public</span>
                        <p className="text-sm text-gray-600">Anyone can view this project</p>
                      </div>
                    </label>
                  </div>
              </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Change Visibility</h2>
              <button
                onClick={() => handleCancel()}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center mb-4">
                {tempVisibility ? (
                  <Globe className="w-8 h-8 text-green-600 mr-3" />
                ) : (
                  <Lock className="w-8 h-8 text-blue-600 mr-3" />
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Make project {tempVisibility ? 'Public' : 'Private'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {tempVisibility 
                      ? 'Anyone on the internet will be able to see this project'
                      : 'Only you and invited collaborators will have access'
                    }
                  </p>
                </div>
              </div>

              {/* Warning/Info Box */}
              <div className={`p-4 rounded-lg mb-6 ${
                tempVisibility ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm ${tempVisibility ? 'text-amber-800' : 'text-blue-800'}`}>
                  {tempVisibility 
                    ? '⚠️ This will make your project visible to everyone. Make sure you\'re comfortable sharing this content publicly.'
                    : '🔒 This will restrict access to your project. Only invited members will be able to view it.'
                  }
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleCancel()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave("visibility")}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  tempVisibility 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {tempVisibility ? 'Make Public' : 'Make Private'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


              {/* Default Branch */}
              {/* Status, Due Date, Priority Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Status & Details</h3>
                {/* Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={projectData?.status || "ACTIVE"}
                    onChange={e => {
                      if (projectData) {
                        const newStatus = e.target.value as ProjectData["status"];
                        setProjectData({ ...projectData, status: newStatus });
                        projectSettingBackend.updateProjectDetails(projectData.id, { status: newStatus });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DONE">Done</option>
                    <option value="PAUSED">Paused</option>
                    <option value="ABANDONED">Abandoned</option>
                  </select>
                </div>
                {/* Due Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={projectData?.dueDate || ""}
                    onChange={e => {
                      if (projectData) {
                        setProjectData({ ...projectData, dueDate: e.target.value });
                        projectSettingBackend.updateProjectDetails(projectData.id, { dueDate: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={projectData?.priority || "MEDIUM"}
                    onChange={e => {
                      if (projectData) {
                        const newPriority = e.target.value as ProjectData["priority"];
                        setProjectData({ ...projectData, priority: newPriority });
                        projectSettingBackend.updateProjectDetails(projectData.id, { priority: newPriority });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>



            </div>
          )}

          {/* === MEMBERS SECTION === */}
          {activeSection === "members" && (
            <MembersAndTeams/>
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
