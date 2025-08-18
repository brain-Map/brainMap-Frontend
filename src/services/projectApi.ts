import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Project related interfaces
export interface TeamMember {
  id?: number;
  email: string;
  role: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  ownerId?: string; // Assuming ownerId is a string, adjust as necessary
  teamMembers?: TeamMember[];
  isPublic?: boolean;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  type?: string;
  status?: string;
  createdAt: string;
  lead?: {
    id: string;
    name: string;
    initials: string;
  };
  userName?: string; // Assuming this is the name of the user who created the project
}


export const projectApi = {

  // Create a new project
  createProject: async (projectData: CreateProjectRequest): Promise<ProjectResponse> => {
    try {
      const response = await api.post('/project-member/projects/', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Get all projects
  getProjects: async (userId: string): Promise<ProjectResponse[]> => {
    try {
      const response = await api.get(`/project-member/projects/all/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get single project by ID
  getProject: async (id: string): Promise<ProjectResponse> => {
    try {
      const response = await api.get(`/project-member/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (id: string, projectData: Partial<CreateProjectRequest>): Promise<ProjectResponse> => {
    try {
      const response = await api.put(`/project-member/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    try {
      await api.delete(`/project-member/projects/${id}`);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};

export default api;
