import api from '@/utils/api';
import type { InternalAxiosRequestConfig } from 'axios';

// Attach a request interceptor that adds Authorization header from accessToken
// Use a window-scoped flag to avoid registering the interceptor multiple times
if (typeof window !== 'undefined') {
  const w = window as any;
  if (!w.__notesApiInterceptorAttached) {
    w.__notesApiInterceptorAttached = true;
    api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      try {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
          // ensure headers object exists and set Authorization
          config.headers = config.headers || {};
          (config.headers as any).Authorization = `Bearer ${token}`;

          // Log the token once for confirmation (truncated)
          if (!w.__notesApiTokenLogged) {
            w.__notesApiTokenLogged = true;
            const truncated = token.length > 20 ? token.slice(0, 10) + '...' + token.slice(-6) : token;
            console.log('Notes API attached token:', truncated);
          }
        }
      } catch (e) {
        // reading localStorage may throw in some edge cases; silently ignore
      }
      return config;
    }, (error) => Promise.reject(error));
  }
}

export interface Note {
  id: string;
  title: string;
  description: string;
  type: 'Project' | 'Personal';
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface CreateNoteRequest {
  title: string;
  description: string;
  type: 'Project' | 'Personal' | string;
}

export interface UpdateNoteRequest {
  title?: string;
  description?: string;
  type?: 'Project' | 'Personal' | string;
}

export const notesApi = {
  getUserNotes: async (): Promise<Note[]> => {
    const res = await api.get('/api/v1/notes/user');
    return res.data;
  },

  getNoteById: async (noteId: string): Promise<Note> => {
    const res = await api.get(`/api/v1/notes/${noteId}`);
    return res.data;
  },

  createNote: async (payload: CreateNoteRequest): Promise<Note> => {
    const res = await api.post('/api/v1/notes', payload);
    return res.data;
  },

  updateNote: async (noteId: string, payload: UpdateNoteRequest): Promise<Note> => {
    const res = await api.put(`/api/v1/notes/${noteId}`, payload);
    return res.data;
  },

  deleteNote: async (noteId: string): Promise<void> => {
    await api.delete(`/api/v1/notes/${noteId}`);
  },
};

export default notesApi;

