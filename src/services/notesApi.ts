import api from '@/utils/api';
import type { InternalAxiosRequestConfig } from 'axios';

// ✅ Attach Authorization header automatically (only once)
if (typeof window !== 'undefined') {
  const w = window as any;
  if (!w.__notesApiInterceptorAttached) {
    w.__notesApiInterceptorAttached = true;
    api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        try {
          const token =
            localStorage.getItem('accessToken') ||
            sessionStorage.getItem('accessToken');

          if (token) {
            config.headers = config.headers || {};
            (config.headers as any).Authorization = `Bearer ${token}`;

            if (!w.__notesApiTokenLogged) {
              w.__notesApiTokenLogged = true;
              const truncated =
                token.length > 20
                  ? token.slice(0, 10) + '...' + token.slice(-6)
                  : token;
              console.log('Notes API attached token:', truncated);
            }
          }
        } catch (e) {
          console.warn('Token attach failed:', e);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
}

// 🧠 Type definitions
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

// 🧩 Helper — Normalize backend notes (noteId → id)
const normalizeNote = (n: any): Note => ({
  id: n.id || n.noteId,
  title: n.title,
  description: n.description,
  type: n.type || 'Personal',
  createdAt: n.createdAt,
  updatedAt: n.updatedAt,
  userId: n.user?.id || n.userId,
});

// 🚀 API Methods
export const notesApi = {
  // ✅ Get notes for specific user
  getUserNotes: async (userId: string): Promise<Note[]> => {
    if (!userId) {
      // Defensive: avoid calling backend with an empty userId which may produce a 500.
      console.warn('notesApi.getUserNotes called without userId — returning empty list');
      return [];
    }

    const url = `/api/v1/notes/user/${userId}`;
    console.log('notesApi.getUserNotes fetching', url);
    const res = await api.get(url);
    return Array.isArray(res.data) ? res.data.map(normalizeNote) : [];
  },

  // ✅ Get a single note
  getNoteById: async (noteId: string): Promise<Note> => {
    const res = await api.get(`/api/v1/notes/${noteId}`);
    return normalizeNote(res.data);
  },

  // ✅ Create a new note
  createNote: async (payload: CreateNoteRequest): Promise<Note> => {
    const res = await api.post('/api/v1/notes', payload);
    return normalizeNote(res.data);
  },

  // ✅ Update existing note
  updateNote: async (noteId: string, payload: UpdateNoteRequest): Promise<Note> => {
    const res = await api.put(`/api/v1/notes/${noteId}`, payload);
    return normalizeNote(res.data);
  },

  // ✅ Delete a note
  deleteNote: async (noteId: string): Promise<void> => {
    await api.delete(`/api/v1/notes/${noteId}`);
  },
};

export default notesApi;
