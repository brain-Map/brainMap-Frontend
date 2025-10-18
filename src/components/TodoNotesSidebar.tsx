'use client';

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, FileText, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // ✅ gives you the logged-in user's ID
import { notesApi } from '@/services/notesApi'; // ✅ fetches notes from backend

// ✅ Type definitions for frontend
interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: Array<{
    text: string;
    color: string;
  }>;
}

const TodoNotesSidebar: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch notes once user is available
  useEffect(() => {
    if (authLoading) return; // Wait until AuthContext finishes loading
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        setLoading(true);

        // ✅ Fetch user notes using backend API
        const apiNotes = await notesApi.getUserNotes(user.id);

        // ✅ Sort by updatedAt (newest first) with fallback to createdAt, then take top 3
        const sorted = (apiNotes || []).slice().sort((a: any, b: any) => {
          const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return bTime - aTime; // newest first
        });

        const topThree = sorted.slice(0, 3);

        // ✅ Map to frontend display shape
        const mapped: Note[] = topThree.map((n: any) => ({
          id: n.id || n.noteId,
          title: n.title,
          content: n.description ?? '',
          date: (n.updatedAt || n.createdAt) ? new Date(n.updatedAt || n.createdAt).toLocaleDateString() : '',
          tags: [], // extend if API provides tag data
        }));

        setNotes(mapped);
      } catch (err) {
        console.error('Error fetching sidebar notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user, authLoading]);

  // ✅ Navigate to full notes page
  const handleNavigateNotes = () => {
    router.push('/project-member/notes');
  };

  if (loading) {
    return (
      <div className="w-100 bg-white border-l border-gray-200 min-h-screen flex items-center justify-center text-gray-500">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="w-100 bg-white border-l border-gray-200 min-h-screen">
      {/* Notes Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <h2 className="font-semibold text-gray-800">Notes</h2>
          </div>
          <button
            onClick={handleNavigateNotes}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            View all
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm">No notes found.</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-sm leading-tight pr-2">
                    {note.title}
                  </h3>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-3">
                  {note.content || 'No description'}
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{note.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoNotesSidebar;
