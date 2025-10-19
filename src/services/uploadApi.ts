import api from '@/utils/api';
 import { get } from 'http';

export const uploadApi = {
  uploadFiles: async (projectId: string, formData: FormData) => {
    try {
      const response = await api.post(
        `/project-member/projects/upload/project-files/${projectId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error uploading files:', error?.response?.data || error.message || error);
      throw error;
    }
  },

  getUploadedFiles: async (projectId: string) => {
    try {
      const response = await api.get(
        `/project-member/projects/get-files/${projectId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching uploaded files:', error?.response?.data || error.message || error);
      throw error;
    }
  },
  
};
