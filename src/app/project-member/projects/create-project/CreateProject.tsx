'use client';
import React, { useState } from 'react';
import { Plus, X, Calendar, Users, Lock, Globe } from 'lucide-react';
import { projectApi, CreateProjectRequest, TeamMember } from '../../../../services/projectApi';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProjectData {
  name: string;
  description: string;
  deadline: string;
  isPublic: boolean;
  priority: string;
}

const CreateProjectPage = () => {
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    deadline: '',
    isPublic: true,
    priority: 'MEDIUM'
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState<{ email: string; role: string }>({ email: '', role: 'Member' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  const roles = ['Owner', 'Admin', 'Member', 'Viewer'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addTeamMember = () => {
    if (newMember.email.trim() && !teamMembers.find(member => member.email === newMember.email)) {
      setTeamMembers(prev => [...prev, { ...newMember, id: Date.now() }]);
      setNewMember({ email: '', role: 'Member' });
    }
  };

  const removeMember = (id: number | undefined) => {
    if (id) {
      setTeamMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  const updateMemberRole = (id: number | undefined, newRole: string) => {
    if (id) {
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === id ? { ...member, role: newRole } : member
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validation
    if (!projectData.name.trim()) {
      setSubmitError('Project name is required');
      setIsSubmitting(false);
      return;
    }

    if (!user?.id) {
      setSubmitError('User authentication required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the JSON data for backend submission
      const projectPayload: CreateProjectRequest = {
        title: projectData.name.trim(),
        description: projectData.description.trim() || undefined,
        dueDate: projectData.deadline || undefined,
        priority: projectData.priority || undefined,
        ownerId: user.id,
        teamMembers: teamMembers,
        isPublic: projectData.isPublic
      };

      console.log('Submitting project data as JSON:');
      console.log('Raw JSON String:', JSON.stringify(projectPayload, null, 2));
      console.log('Payload Object:', projectPayload);

      // Submit to backend
      const response = await projectApi.createProject(projectPayload);
      
      console.log('Project created successfully:', response);
      
      // Show success message
      alert(`✅ Project "${response.title}" created successfully!`);
      
      // Reset form
      setProjectData({
        name: '',
        description: '',
        deadline: '',
        isPublic: true,
        priority: 'MEDIUM'
      });
      setTeamMembers([]);
      
      // Redirect to projects page
      router.push('/project-member/projects');
      
    } catch (error: any) {
      console.error('Error creating project:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create project';
      setSubmitError(errorMessage);
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewJsonData = () => {
    const projectPayload: CreateProjectRequest = {
      title: projectData.name.trim(),
      description: projectData.description.trim() || undefined,
      dueDate: projectData.deadline || undefined,
      priority: projectData.priority || undefined,
      ownerId: user?.id || '',
      teamMembers: teamMembers,
      isPublic: projectData.isPublic
    };

    console.log('Preview JSON Data:');
    console.log(JSON.stringify(projectPayload, null, 2));
    alert(`JSON Preview:\n\n${JSON.stringify(projectPayload, null, 2)}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" rounded-lg overflow-hidden">
          {/* Header */}
          <div className=" px-6 py-8">
            <h1 className="text-3xl font-bold text-black">Create New Project</h1>
            <p className="text-gray-800 mt-2">Set up your project with team members and configurations</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Error Display */}
            {submitError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Overlay */}
            {isSubmitting && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-700">Creating project...</span>
                  </div>
                </div>
              </div>
            )}
            {/* Project Details Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  Project Details
                </h2>
              </div>

              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={projectData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project name"
                />
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={projectData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your project..."
                />
                <p className="text-sm text-gray-500 mt-1">{projectData.description.length}/500 characters</p>
              </div>

              {/* Deadline */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={projectData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Visibility and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Project Visibility</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 bg-white rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="isPublic"
                        checked={projectData.isPublic}
                        onChange={() => setProjectData(prev => ({ ...prev, isPublic: true }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">Public</span>
                        <span className="text-sm font-small text-gray-600">(Anyone on the internet can view this project.)</span>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 bg-white rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="isPublic"
                        checked={!projectData.isPublic}
                        onChange={() => setProjectData(prev => ({ ...prev, isPublic: false }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">Private</span>
                        <span className="text-sm font-small text-gray-600">(Only invited members can view this project.)</span>

                      </div>
                    </label>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-3">Priority Level</label>
                  <select
                    id="priority"
                    name="priority"
                    value={projectData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(projectData.priority)}`}>
                      {projectData.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">2</span>
                  </div>
                  Team Members
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-small text-gray-600">(Optional)</span>
                </h2>
              </div>

              {/* Add Member */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add Team Member</h3>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Members List */}
              {teamMembers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Team Members ({teamMembers.length})</h3>
                  <div className="space-y-2">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {member.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{member.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role}
                            onChange={(e) => updateMemberRole(member.id, e.target.value)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {roles.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeMember(member.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              {/* Development Preview Button */}
              <button
                type="button"
                onClick={previewJsonData}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                Preview JSON
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !projectData.name.trim()}
                  className="px-6 py-2 bg-gradient-to-r bg-primary text-white rounded-md hover:bg-secondary hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;