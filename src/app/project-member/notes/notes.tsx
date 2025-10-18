'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Share2, Star, Archive, Pencil, Trash2 } from 'lucide-react';
import { notesApi } from '@/services/notesApi';
import DeleteModal from '@/components/modals/DeleteModal';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';

interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string;
    email: string;
    avatar: string | null;
    mobileNumber: string | null;
    dateOfBirth: string | null;
    bio: string | null;
    gender: string | null;
}

// Shape returned by the API
interface ApiNote {
  noteId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  // API may include other fields like `type`
  [key: string]: any;
}

// Normalized note shape used by the UI (uses `id` not `noteId`)
interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  type?: string;
}


const notesApi2 = {
  getHiredExpertsData: async (userId: string): Promise<ApiNote[]> => {
    try {
      const response = await api.get(`/api/v1/notes/user/${userId}`);
      // assume response.data is an array of ApiNote
      console.log('User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
};



const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'project' | 'personal' | 'starred' | 'archived'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [starredNotes, setStarredNotes] = useState<string[]>([]);
  const [archivedNotes, setArchivedNotes] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const deleteModal = useDeleteModal({
    title: 'Delete Note',
    confirmText: 'Delete',
  });

  // ✅ Fetch all notes for logged-in user
const fetchNotes = async (userId: string) => {
  try {
    setLoading(true);
    // Use the provided notesApi2.getHiredExpertsData which returns ApiNote[]
    const apiNotes = await notesApi2.getHiredExpertsData(userId);

    // normalize ApiNote -> Note (id instead of noteId)
    const normalized: Note[] = apiNotes.map((n) => ({
      id: n.noteId,
      title: n.title,
      description: n.description,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      user: n.user,
      type: n.type ?? undefined,
    }));

    setNotes(normalized);
    if (normalized.length > 0) setSelectedNote(normalized[0]);
  } catch (err) {
    console.error('Error fetching notes:', err);
  } finally {
    setLoading(false);
  }
};


  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    if (!user || !user.id) {
      // No user - nothing to fetch
      setLoading(false);
      return;
    }

    fetchNotes(user.id);
  }, [user, authLoading]);

  // ✅ Create new note
  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim() || !createDescription.trim()) return;

    try {
        const createdApi = await notesApi.createNote({
          title: createTitle.trim(),
          description: createDescription.trim(),
          type: 'Personal',
        });

        // normalize created note (some APIs return different field names)
        const created: Note = {
          id: (createdApi as any).id ?? (createdApi as any).noteId ?? createdApi.id,
          title: createdApi.title,
          description: createdApi.description,
          createdAt: createdApi.createdAt ?? new Date().toISOString(),
          updatedAt: createdApi.updatedAt ?? new Date().toISOString(),
    user: (createdApi as any).user,
          type: (createdApi as any).type ?? undefined,
        };

        setNotes((prev) => [created, ...prev]);
        setSelectedNote(created);
      setIsCreating(false);
      setCreateTitle('');
      setCreateDescription('');
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  // ✅ Edit note
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    try {
        const updatedApi = await notesApi.updateNote(selectedNote.id, {
          title: editTitle,
          description: editDescription,
        });

        const updated: Note = {
          id: (updatedApi as any).id ?? (updatedApi as any).noteId ?? updatedApi.id,
          title: updatedApi.title,
          description: updatedApi.description,
          createdAt: updatedApi.createdAt ?? selectedNote.createdAt,
          updatedAt: updatedApi.updatedAt ?? new Date().toISOString(),
    user: (updatedApi as any).user ?? selectedNote.user,
          type: (updatedApi as any).type ?? selectedNote.type,
        };

        setNotes((prev) => prev.map((n) => (n.id === selectedNote.id ? updated : n)));
        setSelectedNote(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  // ✅ Delete note
  const handleDelete = (noteId: string, title: string) => {
    deleteModal.openModal(
      async (id: string) => {
        try {
          await notesApi.deleteNote(id);
          setNotes((prev) => prev.filter((n) => n.id !== id));
          setSelectedNote(null);
        } catch (err) {
          console.error('Error deleting note:', err);
        }
      },
      [noteId],
      title
    );
  };

  // ⭐ Star Note
  const toggleStar = (id: string) => {
    setStarredNotes((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  // 📦 Archive Note
  const archiveNote = (id: string) => {
    setArchivedNotes((prev) => [...prev, id]);
    setSelectedNote(null);
  };

  // 📝 Edit Note Inline
  const startEdit = (note: Note) => {
    setEditTitle(note.title);
    setEditDescription(note.description);
    setIsEditing(true);
  };

  // 🔍 Filter Logic
  const filteredNotes = notes
    .filter((note) => {
      if (archivedNotes.includes(note.id) && filter !== 'archived') return false;
      if (!archivedNotes.includes(note.id) && filter === 'archived') return false;
      if (filter === 'starred' && !starredNotes.includes(note.id)) return false;
      if (filter === 'project') return note.type === 'Project';
      if (filter === 'personal') return note.type === 'Personal';
      return true;
    })
    .filter((note) => {
      const q = search.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.description.toLowerCase().includes(q)
      );
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 w-1/2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => {
                setIsCreating(true);
                setIsEditing(false);
              }}
            >
              <Plus className="w-4 h-4" /> Create New
            </button>
            <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">User</span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANEL */}
          <section className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-lg font-bold text-gray-800">Notes</h2>
            </div>
            <div className="flex gap-2 px-6 pb-2">
              {['all', 'project', 'personal', 'starred', 'archived'].map((f) => (
                <button
                  key={f}
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    filter === f ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setFilter(f as 'all' | 'project' | 'personal' | 'starred' | 'archived')}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition ${
                    selectedNote && selectedNote.id === note.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xl">
                    {note.title?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{note.title}</div>
                    <div className="text-xs text-gray-500 truncate">{note.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="flex-1 flex flex-col p-8 overflow-y-auto">
            {isCreating ? (
              <form
                onSubmit={handleSubmitCreate}
                className="max-w-2xl mx-auto w-full h-full flex flex-col gap-6"
              >
                <input
                  type="text"
                  placeholder="Note Title"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  required
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-black text-2xl font-bold"
                />
                <textarea
                  placeholder="Note Description"
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  required
                  rows={14}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black text-base resize-none min-h-[300px]"
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold"
                  >
                    Create
                  </button>
                </div>
              </form>
            ) : selectedNote ? (
              isEditing ? (
                <form
                  onSubmit={handleEditSave}
                  className="max-w-2xl mx-auto w-full h-full flex flex-col gap-6"
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-black text-2xl font-bold"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={14}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black text-base resize-none min-h-[300px]"
                  />
                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="max-w-2xl mx-auto w-full h-full flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 flex-1">
                      {selectedNote.title}
                    </h1>
                    <button
                      className="text-gray-400 hover:text-blue-600"
                      onClick={() => startEdit(selectedNote)}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      className={
                        starredNotes.includes(selectedNote.id)
                          ? 'text-yellow-500'
                          : 'text-gray-400 hover:text-yellow-600'
                      }
                      onClick={() => toggleStar(selectedNote.id)}
                    >
                      <Star
                        className="w-5 h-5"
                        fill={
                          starredNotes.includes(selectedNote.id)
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => handleDelete(selectedNote.id, selectedNote.title)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => archiveNote(selectedNote.id)}
                    >
                      <Archive className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-gray-700 text-base whitespace-pre-line bg-gray-50 rounded-lg p-6 min-h-[200px]">
                    {selectedNote.description}
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a note to view details
              </div>
            )}
          </section>
        </div>
      </div>

      <DeleteModal {...deleteModal.modalProps} />
    </div>
  );
};

export default Notes;
