'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  Star,
  MoreHorizontal,
  X,
  Calendar,
  ArrowUpDown,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import TodoNotesSidebar from '@/components/TodoNotesSidebar';
// import projects from '@/data/projects/projects';
import Pagination from '@/components/Pagination';
import { projectApi, CreateProjectRequest, ProjectResponse } from '@/services/projectApi';
import { useAuth } from '@/contexts/AuthContext';



interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { title: string; description: string; dueDate: string; priority: string}) => void;
  isLoading?: boolean;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
  isDeleting: boolean;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Project name is required');
      return;
    }
    onSubmit(formData);
    // Don't clear form here - let parent handle it after successful submission
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter project name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Describe your project..."
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority (Optional)
            </label>
            <div className="relative">
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="">Select priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  projectName, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm"
        onClick={!isDeleting ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Delete Project</h2>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete <span className="font-medium">"{projectName}"</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. All project data will be permanently removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 inline mr-2" />
                Delete Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectsTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProduct, setFilterProduct] = useState('Filter by product');
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    projectId: string;
    projectName: string;
  }>({
    isOpen: false,
    projectId: '',
    projectName: '',
  });
  const user = useAuth().user;

  // console.log('Current user:', user?.id);
  
  // Backend data states
  const [backendProjects, setBackendProjects] = useState<ProjectResponse[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [showOnlyBackendProjects, setShowOnlyBackendProjects] = useState(false);
  
  const itemsPerPage = 10;


  

  const router = useRouter();

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

  const toggleStar = (projectId: string) => {
    console.log(`Toggle star for project ${projectId}`);
  };

  const handleClick = (projectId: string) => {
    router.push(`/project-member/projects/${projectId}`);
  };

  const handleDelete = (projectId: string, projectName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      projectId,
      projectName,
    });
    setDropdownOpenId(null);
  };

  const confirmDelete = async () => {
    try {
      // Set loading state
      setDeletingProjectId(deleteConfirmation.projectId);
      
      // Call the delete API
      await projectApi.deleteProject(deleteConfirmation.projectId);
      
      // Success notification
      alert('✅ Project deleted successfully!');
      
      // Refresh the projects list
      await fetchProjects();
      
      console.log('Project deleted:', deleteConfirmation.projectId);
      
    } catch (error: any) {
      console.error('Error deleting project:', error);
      
      // Error notification
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete project';
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      // Clear loading state and close modal
      setDeletingProjectId(null);
      setDeleteConfirmation({
        isOpen: false,
        projectId: '',
        projectName: '',
      });
    }
  };

  const allProjects = showOnlyBackendProjects ? 
    backendProjects.map(project => ({
      id: project.id,
      name: project.title || 'Untitled Project',
      description: project.description || '',
      type: project.type || 'Team-managed software',
      lead: project.lead || { name: 'Unknown', initials: 'UK' },
      starred: false, // You can add this field to your backend response
      createdAt: project.createdAt,
      dueDate: project.dueDate,
      priority: project.priority,
      userName: project.userName || 'Unknown User',
    })) :
    [
      ...backendProjects.map(project => ({
        id: project.id,
        name: project.title || 'Untitled Project',
        description: project.description || '',
        type: project.type || 'Team-managed software',
        lead: project.lead || { name: 'Unknown', initials: 'UK' },
        starred: false, // You can add this field to your backend response
        createdAt: project.createdAt,
        dueDate: project.dueDate,
        priority: project.priority,
        userName: project.userName || 'Unknown User',
      })),

    ];

  const filteredProjects = allProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterProduct === 'Filter by product' || project.type === filterProduct)
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateProject = async (formData: { title: string; description: string; dueDate: string; priority: string }) => {
    setIsCreatingProject(true);
    
    try {
      const projectData: CreateProjectRequest = {
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
        priority: formData.priority || undefined,
        ownerId: user?.id || '', // Use the current user's ID
      };

      console.log('Creating project with data:', projectData);

      const response = await projectApi.createProject(projectData);
      
      alert(`✅ Project "${response.title}" created successfully!`);
      
      setIsModalOpen(false);
      
      // Refresh the projects list after creating a new project
      await fetchProjects();
      
      console.log('Created project:', response);
      
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create project';
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-between">
      <div className="w-full pl-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            {isLoadingProjects && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Loading projects...
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchProjects}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isLoadingProjects}
            >
              Refresh
            </button>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-primary hover:bg-secondary text-white hover:text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              Create project
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
                  onClick={fetchProjects}
                  className="ml-2 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
            >
              <option>Filter by product</option>
              <option>Product Discovery</option>
              <option>Team-managed software</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          
        </div>

        

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Lead</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Project Action</th>
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
                      ) : filteredProjects.length === 0 && backendProjects.length === 0 ? (
                        <div>
                          <p className="text-lg font-medium mb-2">No projects found</p>
                          <p className="text-sm">Create your first project to get started</p>
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
                      <button
                        onClick={() => toggleStar(project.id)}
                        className={`p-1 rounded transition-colors ${
                          project.starred
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                      
                        <Star
                          className={`w-4 h-4 ${project.starred ? 'fill-current' : ''}`}
                        />
                      
                      </button>
                      
                      <span
                        onClick={() => handleClick(project.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors w-full"
                      >
                        {project.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {project.description
                      ? project.description.length > 50
                        ? project.description.slice(0, 50) + "..."
                        : project.description
                      : ""}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{project.priority}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {project.lead.initials}
                      </div>
                      <span className="text-sm text-gray-900">{project.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block text-left">
                      <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setDropdownOpenId(dropdownOpenId === project.id ? null : project.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {dropdownOpenId === project.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-100">
                          <button
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left rounded-t-md transition duration-150 ease-in-out"
                            onClick={() => {
                              console.log('Edit project:', project.id);
                              alert('Edit functionality - Coming soon!');
                              setDropdownOpenId(null);
                            }}
                          >
                            Edit
                          </button>
                          <hr className="border-gray-100" />
                          <button
                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left rounded-b-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDelete(project.id, project.name)}
                            disabled={deletingProjectId === project.id}
                          >
                            {deletingProjectId === project.id ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                                Deleting...
                              </div>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>

                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}

            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Sidebar */}
      <div className="min-h-screen ml-6 bg-accent">
        <TodoNotesSidebar />
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        isLoading={isCreatingProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, projectId: '', projectName: '' })}
        onConfirm={confirmDelete}
        projectName={deleteConfirmation.projectName}
        isDeleting={deletingProjectId === deleteConfirmation.projectId}
      />
    </div>
  );
};

export default ProjectsTable;
