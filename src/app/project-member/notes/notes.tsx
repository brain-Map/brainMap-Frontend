'use client';

import React, { useState } from 'react';
import { Plus, Search, User, Upload, Book, StickyNote, Star, Archive, Tag,Share2, Pencil } from 'lucide-react';

const initialNotes = [
	{
		id: 1,
		title: 'Finish the task on the board',
    description: 'Remember to finish task on the board. After finishing give for evaluation Matt.',
    project: 'Project',
		date: '22.01.2023',
		pinned: false,
    tags: ['Personal', 'Project'],
	},
	{
		id: 2,
		title: 'Buy a new tea cup',
		description: 'Remember to buy a new tea cup.',
    project: 'Personal',
		date: '21.01.2023',
		pinned: false,
    tags: ['Personal'],
	},
	{
		id: 3,
		title: 'Hang out with Marry',
    description: 'Hang out with Marry, friday at 7 pm in Blue Wolf Café',
    project: 'Personal',
		date: '20.01.2023',
		pinned: false,
    tags: ['Personal'],
	},
	{
		id: 4,
		title: 'Business meeting',
		description: 'Business meeting at 1 pm!',
		project: 'Work',
		date: '19.01.2023',
		pinned: false,
    tags: ['Project'],
	},
	{
		id: 5,
		title: 'Bake a birthday cake',
		description: 'Remember to bake a chocolate birthday cake for Nany.',
    project: 'Personal',
		date: '17.01.2023',
		pinned: false,
    tags: ['Personal'],
	},
	{
		id: 6,
		title: 'Sign up for a Spanish course',
		description: 'Start to learn Spanish.',
    project: 'Personal',
		date: '17.01.2023',
		pinned: false,
    tags: ['Personal'],
  },
];

// const sidebarLinks = [
//   { icon: StickyNote, label: 'Sticky Notes' },
//   { icon: Book, label: 'Notes' },
//   { icon: Star, label: 'Starred' },
//   { icon: Archive, label: 'Archive' },
//   { icon: Tag, label: 'Label' },
// ];

const Notes = () => {
	const [notes, setNotes] = useState(initialNotes);
  const [selectedNote, setSelectedNote] = useState<typeof initialNotes[0] | null>(initialNotes[0]);
	const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'project' | 'personal' | 'starred' | 'archived'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [createType, setCreateType] = useState<'Project' | 'Personal'>('Project');
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createProject, setCreateProject] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [starredNotes, setStarredNotes] = useState<number[]>([]);
  const [archivedNotes, setArchivedNotes] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editProject, setEditProject] = useState('');
  const [editType, setEditType] = useState<'Project' | 'Personal'>('Project');
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  // Projects state: stores all created projects (name and optional description)
  const [projects, setProjects] = useState<{ name: string; description?: string }[]>([]);

  // Toggle star for a note
  const toggleStar = (id: number) => {
    setStarredNotes((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  // Archive a note
  const archiveNote = (id: number) => {
    setArchivedNotes((prev) => [...prev, id]);
    setShowArchiveConfirm(false);
    setSelectedNote(null);
  };

  // Start inline editing
  const startEdit = (note: typeof initialNotes[0]) => {
    setEditTitle(note.title);
    setEditDescription(note.description);
    setEditProject(note.project || '');
    setEditType(note.tags.includes('Project') ? 'Project' : 'Personal');
    setIsEditing(true);
  };

  // Save inline edit
  const handleEditSave = (e: React.FormEvent) => {
		e.preventDefault();
    if (!selectedNote) return;
    const updatedNote = {
      ...selectedNote,
      title: editTitle,
      description: editDescription,
      project: editType === 'Project' ? editProject : '',
      tags: [editType],
    };
    setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };
  // Cancel inline edit
  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // Get all project names: from projects state (preferred), fallback to notes for legacy
  const noteProjectNames = Array.from(new Set(notes.filter(n => n.tags && n.tags.includes('Project') && n.project).map(n => n.project)));
  const allProjectNames = Array.from(new Set([
    ...projects.map(p => p.name),
    ...noteProjectNames
  ]));

  // Filter notes by search, filter type, starred, archived
  const filteredNotes = notes.filter(note => {
    if (archivedNotes.includes(note.id) && filter !== 'archived') return false;
    if (!archivedNotes.includes(note.id) && filter === 'archived') return false;
    if (filter === 'starred' && !starredNotes.includes(note.id)) return false;
    if (filter === 'project') {
      if (selectedProject) {
        return note.tags && note.tags.includes('Project') && note.project === selectedProject;
      }
      return false;
    } else if (filter === 'personal') {
      return note.tags && note.tags.includes('Personal');
    }
    if (filter === 'starred') return starredNotes.includes(note.id);
    if (filter === 'archived') return archivedNotes.includes(note.id);
    return true;
  }).filter(note => {
			const matchesSearch =
				note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase());
			return matchesSearch;
  });

  // Handler for Project Notes button
  const handleProjectNotesClick = () => {
    setFilter('project');
    setSelectedProject(null);
		setSelectedNote(null);
	};

  // Handler for selecting a project
  const handleSelectProject = (project: string) => {
    setSelectedProject(project);
    // Optionally select the first note in the project
    const firstNote = notes.find(n => n.tags && n.tags.includes('Project') && n.project === project);
    setSelectedNote(firstNote || null);
  };

  // Handler for All Notes (reset filter)
  const handleAllNotesClick = () => {
    setFilter('all');
    setSelectedProject(null);
    setSelectedNote(notes[0]);
  };

  // Handler for + Create New Project (creates a new project, not a note)
  const handleCreateNewProject = () => {
    setIsCreatingProject(true);
    setNewProjectName('');
    setNewProjectDescription('');
  };
  // Handler for submitting new project (just creates the project, not a note)
  const handleSubmitNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    setProjects(prev => [...prev, { name: newProjectName, description: newProjectDescription }]);
    setIsCreatingProject(false);
    setSelectedProject(null);
    setIsCreating(false);
    setFilter('project');
  };
  // Cancel create project
  const handleCancelNewProject = () => {
    setIsCreatingProject(false);
  };
  // Handler for + Create New Note (for a project)
  const handleCreateNewNote = () => {
    setIsCreating(true);
    setCreateType('Project');
    setCreateTitle('');
    setCreateDescription('');
    setCreateProject(selectedProject || '');
  };
  // Handler for + Create New Personal Note
  const handleCreateNewPersonal = () => {
    setIsCreating(true);
    setCreateType('Personal');
    setCreateTitle('');
    setCreateDescription('');
    setCreateProject('');
  };
  // Handler for + Create New (generic)
  const handleCreateNew = () => {
    setIsCreating(true);
    setCreateType('Personal');
    setCreateTitle('');
    setCreateDescription('');
    setCreateProject('');
  };
  // Handler for submitting new note (all types)
  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newNote = {
      id: Date.now(),
      title: createTitle,
      description: createDescription,
      project: createType === 'Project' ? (createProject || createTitle) : '',
      date: new Date().toLocaleDateString('en-GB'),
      pinned: false,
      tags: [createType],
    };
    setNotes([newNote, ...notes]);
    setIsCreating(false);
    setSelectedNote(newNote);
    if (createType === 'Project') {
      setFilter('project');
      setSelectedProject(newNote.project);
    } else if (createType === 'Personal') {
      setFilter('personal');
      setSelectedProject(null);
    }
  };
  // Cancel create
  const handleCreateCancel = () => {
    setIsCreating(false);
  };

  // Handler for back to project list
  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedNote(null);
	};

	return (
    <div className="flex h-screen bg-gray-50">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 w-1/2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
                placeholder="Search for anything..."
							value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400"
						/>
					</div>
          </div>
          <div className="flex items-center gap-4">
            {/* Project Notes: show Create New Project or Create New Note depending on view */}
            {filter === 'project' && !selectedProject ? (
              <button
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary hover:text-black transition"
                onClick={handleCreateNewProject}
              >
                <Plus className="w-4 h-4" /> Create New Project
              </button>
            ) : filter === 'project' && selectedProject ? (
					<button
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary hover:text-black transition"
                onClick={handleCreateNewNote}
              >
                <Plus className="w-4 h-4" /> Create New Note
              </button>
            ) : filter === 'personal' ? (
              <button
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary hover:text-black transition"
                onClick={handleCreateNewPersonal}
              >
                <Plus className="w-4 h-4" /> Create New
              </button>
            ) : (
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary hover:text-black transition" onClick={handleCreateNew}>
                <Plus className="w-4 h-4" /> Create New
              </button>
            )}
            <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200">
              <Share2 className="w-4 h-4" /> Share
					</button>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <User className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-700">Esther Howard</span>
            </div>
				</div>
        </header>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Notes List */}
          <section className="w-96 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-lg font-bold text-gray-800">
                {filter === 'project' && !selectedProject ? 'Projects' : 'Notes'}
              </h2>
              {/* Project Notes: show Create New Project or Create New Note depending on view */}
              {filter === 'project' && !selectedProject ? (
                <button className="text-xs text-blue-600 font-semibold hover:underline" onClick={handleCreateNewProject}>+ Create New Project</button>
              ) : filter === 'project' && selectedProject ? (
                <button className="text-xs text-blue-600 font-semibold hover:underline" onClick={handleCreateNewNote}>+ Create New Note</button>
              ) : filter === 'personal' ? (
                <button className="text-xs text-blue-600 font-semibold hover:underline" onClick={handleCreateNewPersonal}>+ Create New</button>
              ) : (
                <button className="text-xs text-blue-600 font-semibold hover:underline" onClick={handleCreateNew}>+ Create New</button>
              )}
            </div>
            <div className="flex gap-2 px-6 pb-2">
								<button
                className={`text-xs px-3 py-1 rounded-full font-semibold ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={handleAllNotesClick}
              >
                All
								</button>
								<button
                className={`text-xs px-3 py-1 rounded-full font-semibold ${filter === 'project' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={handleProjectNotesClick}
								>
                Project
								</button>
								<button
                className={`text-xs px-3 py-1 rounded-full font-semibold ${filter === 'personal' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => {
                  setFilter('personal');
                  setSelectedProject(null);
                  const firstPersonal = notes.find(n => n.tags && n.tags.includes('Personal'));
                  if (firstPersonal) setSelectedNote(firstPersonal);
                }}
              >
                Personal
								</button>
							</div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {/* Project Notes: show project list or notes in project */}
              {filter === 'project' && !selectedProject ? (
                <div className="flex flex-col gap-2 mt-4">
                  {allProjectNames.length === 0 && (
                    <div className="text-gray-400 text-center">No projects found.</div>
                  )}
                  {allProjectNames.map(project => (
                    <button
                      key={project}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition border-l-4 border-transparent text-left w-full"
                      onClick={() => handleSelectProject(project)}
                    >
                      <Book className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-gray-800">{project}</span>
                    </button>
                  ))}
								</div>
              ) : filter === 'project' && selectedProject ? (
                <>
                  <button
                    className="text-xs text-blue-600 hover:underline mb-2 ml-1"
                    onClick={handleBackToProjects}
                  >
                    ← Back to Projects
                  </button>
                  {filteredNotes.length === 0 && (
                    <div className="text-gray-400 text-center">No notes in this project.</div>
                  )}
                  {filteredNotes.map(note => (
                    <div
                      key={note.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition  ${selectedNote && selectedNote.id === note.id ? ' bg-blue-50' : 'border-transparent'}`}
                      onClick={() => setSelectedNote(note)}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xl">
                        {note.title.charAt(0)}
								</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{note.title}</div>
                        <div className="text-xs text-gray-500 truncate">{note.description}</div>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {note.tags && note.tags.map(tag => (
                            <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tag === 'Project' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{tag}</span>
                          ))}
									</div>
							</div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-400">{note.date}</span>
							</div>
						</div>
					))}
                </>
              ) : (
                filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition  ${selectedNote && selectedNote.id === note.id ? ' bg-blue-50' : 'border-transparent'}`}
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                      setSelectedNote(note);
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xl">
                      {note.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{note.title}</div>
                      <div className="text-xs text-gray-500 truncate">{note.description}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {note.tags && note.tags.map(tag => (
                          <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tag === 'Project' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-400">{note.date}</span>
                    </div>
                  </div>
                ))
              )}
				</div>
          </section>

          {/* Note Detail/Editor */}
          <section className="flex-1 flex flex-col p-8 overflow-y-auto">
            {isCreating ? (
              <form onSubmit={handleSubmitCreate} className="max-w-2xl mx-auto w-full h-full flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  {/* Type indicator as badge/toggle */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition ${createType === 'Project' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                      onClick={() => setCreateType('Project')}
                    >
                      Project
                    </button>
							<button
                      type="button"
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition ${createType === 'Personal' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                      onClick={() => setCreateType('Personal')}
                    >
                      Personal
							</button>
                  </div>
									<input
										type="text"
										placeholder="Note Title"
                    value={createTitle}
                    onChange={e => setCreateTitle(e.target.value)}
										required
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-2xl font-bold"
                    style={{ minWidth: 0 }}
									/>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  {createType === 'Project' && (
									<input
										type="text"
                      placeholder="Project Name"
                      value={createProject}
                      onChange={e => setCreateProject(e.target.value)}
                      required
                      className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200"
                      style={{ minWidth: '120px' }}
                    />
                  )}
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{new Date().toLocaleDateString('en-GB')}</span>
									</div>
                <textarea
                  placeholder="Note Description"
                  value={createDescription}
                  onChange={e => setCreateDescription(e.target.value)}
                  required
                  rows={14}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base resize-none min-h-[300px]"
                />
                <div className="flex gap-2 mt-2 justify-end">
										<button
											type="button"
                    onClick={handleCreateCancel}
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
                <form onSubmit={handleEditSave} className="max-w-2xl mx-auto w-full h-full flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    {/* Type indicator as badge/toggle */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition ${editType === 'Project' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                        onClick={() => setEditType('Project')}
                      >
                        Project
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition ${editType === 'Personal' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                        onClick={() => setEditType('Personal')}
                      >
                        Personal
                      </button>
								</div>
                    <input
                      type="text"
                      placeholder="Note Title"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
										required
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-2xl font-bold"
                      style={{ minWidth: 0 }}
									/>
								</div>
                  <div className="flex gap-2 flex-wrap items-center">
                    {editType === 'Project' && (
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={editProject}
                        onChange={e => setEditProject(e.target.value)}
                        required
                        className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200"
                        style={{ minWidth: '120px' }}
                      />
                    )}
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{selectedNote.date}</span>
											</div>
                  <textarea
                    placeholder="Note Description"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    required
                    rows={14}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base resize-none min-h-[300px]"
                  />
                  <div className="flex gap-2 mt-2 justify-end">
										<button
                      type="button"
                      onClick={handleEditCancel}
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
                    {/* Note type indicator */}
                    {selectedNote.tags.includes('Project') ? (
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">Project</span>
                    ) : selectedNote.tags.includes('Personal') ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">Personal</span>
                    ) : null}
                    <h1 className="text-2xl font-bold text-gray-900 flex-1 break-words">
                      {selectedNote.title}
                    </h1>
                    {/* Edit, Star, and Delete buttons */}
                    <button className="text-gray-400 hover:text-blue-600" title="Edit" onClick={() => startEdit(selectedNote)}><Pencil className="w-5 h-5" /></button>
                    <button
                      className={starredNotes.includes(selectedNote.id) ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-600'}
                      title={starredNotes.includes(selectedNote.id) ? 'Unstar' : 'Star'}
                      onClick={() => toggleStar(selectedNote.id)}
                    >
                      <Star className="w-5 h-5" fill={starredNotes.includes(selectedNote.id) ? 'currentColor' : 'none'} />
										</button>
										<button
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                      onClick={() => setShowArchiveConfirm(true)}
                    >
                      <Archive className="w-5 h-5" />
										</button>
									</div>
                  <div className="flex gap-2 flex-wrap items-center">
                    {selectedNote.tags.includes('Project') && selectedNote.project && (
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">{selectedNote.project}</span>
                    )}
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">{selectedNote.date}</span>
								</div>
                  <div className="text-gray-700 text-base whitespace-pre-line break-words bg-gray-50 rounded-lg p-6 min-h-[200px]">
										{selectedNote.description}
									</div>
								</div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Select a note to view details</div>
            )}
          </section>
						</div>
					</div>
      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowArchiveConfirm(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[300px] max-w-[90vw] flex flex-col items-center" onClick={e => e.stopPropagation()}>
      <div className="text-lg font-semibold mb-6 text-gray-800 text-center">
              Move this note to archive?
      </div>
      <div className="flex gap-4">
        <button
                onClick={() => archiveNote(selectedNote.id)}
          className="px-4 py-2 rounded-lg bg-red-200 text-red-800 font-semibold hover:bg-red-300"
        >
          Yes
        </button>
        <button
                onClick={() => setShowArchiveConfirm(false)}
          className="px-4 py-2 rounded-lg bg-blue-200 text-blue-800 font-semibold hover:bg-blue-300"
        >
                No
        </button>
      </div>
    </div>
  </div>
)}
			{/* Create Project Modal */}
      {isCreatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleSubmitNewProject} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-20"
              onClick={handleCancelNewProject}
              aria-label="Close"
              style={{ lineHeight: 1, padding: 0 }}
            >
              ✕
            </button>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold border bg-yellow-100 text-yellow-800 border-yellow-300">Project</span>
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-2xl font-bold"
                style={{ minWidth: 0 }}
              />
            </div>
            <textarea
              placeholder="Project Description (optional)"
              value={newProjectDescription}
              onChange={e => setNewProjectDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base resize-none min-h-[100px]"
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                type="button"
                onClick={handleCancelNewProject}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
			</div>
	);
};

export default Notes;