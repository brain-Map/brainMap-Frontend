import api from '@/utils/api';

export interface AdminProjectResponse {
  content: ProjectData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface ProjectData {
  id: string;
  description: string;
  ownerId: string;
  userName: string;
  title: string;
  dueDate: string;
  createdAt: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  isPublic: boolean;
  status: 'ACTIVE' | 'DONE' | 'PAUSED' | 'ABANDONED' | 'PROHIBITED';
  avatar: string;
}

export const adminApi = {
  getAllProjects: async (page: number = 0, size: number = 20) => {
    const response = await api.get<AdminProjectResponse>(`/api/v1/admin/projects?page=${page}&size=${size}`);
    return response.data;
  },

  updateProjectStatus: async (projectId: string, status: string) => {
    const response = await api.put(`/api/v1/admin/projects/${projectId}/status/${status}`);
    return response.data;
  },

  deleteProject: async (projectId: string) => {
    const response = await api.delete(`/project-member/projects/${projectId}`);
    return response.data;
  }
};