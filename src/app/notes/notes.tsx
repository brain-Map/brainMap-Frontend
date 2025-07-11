'use client';

import React, { useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';

const initialNotes = [
  {
    id: 1,
    title: 'The beginning of screenless design: UI jobs to be taken over by Solution Architect',
    description: 'A look at how UI roles are evolving with new technology.',
    color: 'bg-yellow-300',
  },
  {
    id: 2,
    title: '13 Things You Should Give Up If You Want To Be a Successful UX Designer',
    description: 'Habits and mindsets to leave behind for UX success.',
    color: 'bg-orange-300',
  },
  {
    id: 3,
    title: 'The Psychology Principles Every UI/UX Designer Needs to Know',
    description: 'Key psychology concepts for better design decisions.',
    color: 'bg-lime-200',
  },
  {
    id: 4,
    title: '10 UI & UX Lessons from Designing My Own',
    description: 'Personal lessons learned from hands-on design.',
    color: 'bg-purple-300',
  },
  {
    id: 5,
    title: '52 Research Terms you need to know as a UX Designer',
    description: 'Essential research vocabulary for UX professionals.',
    color: 'bg-lime-200',
  },
  {
    id: 6,
    title: 'Text fields & Forms design — UI component series',
    description: 'Best practices for designing forms and text fields.',
    color: 'bg-cyan-300',
  },
];

const colorOptions = [
  'bg-yellow-300',
  'bg-orange-300',
  'bg-lime-200',
  'bg-purple-300',
  'bg-cyan-300',
  'bg-pink-300',
  'bg-green-300',
  'bg-blue-300',
  'bg-red-200',
  'bg-amber-200',
  'bg-emerald-200',
  'bg-fuchsia-200',
  'bg-indigo-200',
  'bg-teal-200',
];

const Notes: React.FC = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
  const [currentNote, setCurrentNote] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', color: colorOptions[0] });

  // Open modal for add or edit
  const openModal = (type: 'add' | 'edit', note?: any) => {
    setModalType(type);
    setShowModal(true);
    if (type === 'edit' && note) {
      setCurrentNote(note);
      setForm({ title: note.title, description: note.description, color: note.color });
    } else {
      setCurrentNote(null);
      setForm({ title: '', description: '', color: colorOptions[0] });
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setCurrentNote(null);
    setForm({ title: '', description: '', color: colorOptions[0] });
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or edit note
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'add') {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    } else if (modalType === 'edit' && currentNote) {
      setNotes(
        notes.map((n) => (n.id === currentNote.id ? { ...n, ...form } : n))
      );
    }
    closeModal();
  };

  // Delete note
  const handleDelete = (id: number) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex flex-col">
        <div className="relative flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          {/* Heading and Add Button */}
          <div className="flex items-center mb-10 mt-2">
            <h1 className="text-5xl font-extrabold text-black mr-4">Notes</h1>
            <button
              className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-accent transition-all text-2xl"
              onClick={() => openModal('add')}
              aria-label="Add Note"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`rounded-2xl p-7 pb-4 shadow-md relative flex flex-col min-h-[180px] ${note.color}`}
              >
                <div className="flex-1">
                  <div className="text-lg font-bold text-black mb-2">{note.title}</div>
                  <div className="text-base text-black/80 mb-6 whitespace-pre-line break-words">{note.description}</div>
                </div>
                <div className="flex items-center justify-end mt-auto gap-2">
                  <button
                    className="bg-black text-white rounded-full p-2 hover:bg-accent transition-all"
                    onClick={() => openModal('edit', note)}
                    aria-label="Edit Note"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-700 transition-all"
                    onClick={() => handleDelete(note.id)}
                    aria-label="Delete Note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Add/Edit Note */}
        {showModal && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                onClick={closeModal}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-black">{modalType === 'add' ? 'Add Note' : 'Edit Note'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Note Title"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-black"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-black resize-none"
                />
                <div className="flex gap-2 items-center">
                  <label className="text-black font-semibold">Color:</label>
                  <select
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 px-2 py-1 text-black"
                  >
                    {colorOptions.map((color) => (
                      <option key={color} value={color} className={color}>
                        {color.replace('bg-', '').replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent to-info text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                >
                  {modalType === 'add' ? 'Add Note' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notes; 