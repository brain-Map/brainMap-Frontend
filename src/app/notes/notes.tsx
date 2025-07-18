'use client';

import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
import { Pencil, Plus, Trash2, X, Pin, Search } from 'lucide-react';

const initialNotes = [
	{
		id: 1,
		title: 'Finish the task on the board',
		description:
			'Remember to finish task on the board. After finishing give for evaluation Matt.',
		project: '',
		date: '22.01.2023',
		pinned: false,
	},
	{
		id: 2,
		title: 'Buy a new tea cup',
		description: 'Remember to buy a new tea cup.',
		project: '',
		date: '21.01.2023',
		pinned: false,
	},
	{
		id: 3,
		title: 'Hang out with Marry',
		description:
			'Hang out with Marry, friday at 7 pm in Blue Wolf Café',
		project: '',
		date: '20.01.2023',
		pinned: false,
	},
	{
		id: 4,
		title: 'Business meeting',
		description: 'Business meeting at 1 pm!',
		project: 'Work',
		date: '19.01.2023',
		pinned: false,
	},
	{
		id: 5,
		title: 'Bake a birthday cake',
		description: 'Remember to bake a chocolate birthday cake for Nany.',
		project: '',
		date: '17.01.2023',
		pinned: false,
	},
	{
		id: 6,
		title: 'Sign up for a Spanish course',
		description: 'Start to learn Spanish.',
		project: '',
		date: '17.01.2023',
		pinned: false,
	},
];

const Notes: React.FC = () => {
	const [notes, setNotes] = useState(initialNotes);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);
	const [currentNote, setCurrentNote] = useState<any>(null);
	const [form, setForm] = useState({
		title: '',
		description: '',
		project: '',
		date: '',
		pinned: false,
	});
	const [search, setSearch] = useState('');
	const [showNoteModal, setShowNoteModal] = useState(false);
	const [selectedNote, setSelectedNote] = useState<any>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

	// Open modal for add or edit
	const openModal = (type: 'add' | 'edit', note?: any) => {
		setModalType(type);
		setShowModal(true);
		if (type === 'edit' && note) {
			setCurrentNote(note);
			setForm({
				title: note.title,
				description: note.description,
				project: note.project || '',
				date: note.date,
				pinned: note.pinned || false,
			});
		} else {
			setCurrentNote(null);
			setForm({ title: '', description: '', project: '', date: '', pinned: false });
		}
	};

	// Close modal
	const closeModal = () => {
		setShowModal(false);
		setModalType(null);
		setCurrentNote(null);
		setForm({ title: '', description: '', project: '', date: '', pinned: false });
	};

	// Handle form changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		if (type === 'checkbox') {
			setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
		} else {
			setForm((prev) => ({ ...prev, [name]: value }));
		}
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
					date: new Date().toLocaleDateString('en-GB'),
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

	// Pin/unpin note
	const togglePin = (id: number) => {
		setNotes(notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));
	};

	// Filter and sort notes
	const filteredNotes = notes
		.filter((note) => {
			const matchesSearch =
				note.title.toLowerCase().includes(search.toLowerCase()) ||
				note.description.toLowerCase().includes(search.toLowerCase()) ||
				(note.project && note.project.toLowerCase().includes(search.toLowerCase()));
			return matchesSearch;
		})
		.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)); // pinned notes first

	// Function to open the large note modal
	const handleNoteClick = (note: any) => {
		setSelectedNote(note);
		setShowNoteModal(true);
	};

	//close the large note modal
	const closeNoteModal = () => {
		setShowNoteModal(false);
		setSelectedNote(null);
	};

	// Open delete confirmation
	const confirmDelete = (id: number) => {
		setDeleteTargetId(id);
		setShowDeleteConfirm(true);
	};

	// Handle confirmed delete
	const handleConfirmDelete = () => {
		if (deleteTargetId !== null) {
			handleDelete(deleteTargetId);
			// If the deleted note is currently being viewed, close the modal
			if (selectedNote && selectedNote.id === deleteTargetId) {
				closeNoteModal();
			}
		}
		setShowDeleteConfirm(false);
		setDeleteTargetId(null);
	};

	// Handle cancel delete
	const handleCancelDelete = () => {
		setShowDeleteConfirm(false);
		setDeleteTargetId(null);
	};

	return (
		<>
			<NavBar />
			{/* Spacer between NavBar and search bar */}
			<div className="h-14 w-full" />
			<div className="min-h-screen flex flex-col items-center justify-start p-6 w-full h-full">
				{/* Top bar: Search and Add (sticky & fixed) */}
				<div
					className="fixed left-0 right-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 py-4 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 max-w-7xl mx-auto px-6"
					style={{ top: '96px', margin: '0 auto' }} // 96px = 6rem, adjust as needed
				>
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<input
							type="text"
							placeholder="Search notes"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
						/>
					</div>
					<button
						className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 self-end md:self-auto"
						onClick={() => openModal('add')}
					>
						<Plus className="w-5 h-5" /> Add
					</button>
				</div>

				{/* Spacer to prevent content from being hidden under the fixed bar */}
				<div className="h-[136px] w-full" />

				{/* Notes grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl">
					{filteredNotes.map((note) => (
						<div
							key={note.id}
							className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 relative border border-gray-100 cursor-pointer"
							onClick={() => handleNoteClick(note)}
						>
							{/* Actions */}
							<div className="absolute right-5 top-5 flex gap-2 z-10"
								onClick={e => e.stopPropagation()}>
								<button
									onClick={() => togglePin(note.id)}
									className={`font-bold ${
										note.pinned
											? 'text-yellow-500'
											: 'text-gray-400'
									} hover:text-yellow-600`}
									title={note.pinned ? 'Unpin' : 'Pin'}
								>
									<Pin
										className="w-5 h-5"
										fill={note.pinned ? 'currentColor' : 'none'}
									/>
								</button>
								<button
									onClick={() => openModal('edit', note)}
									className="font-bold text-black hover:text-blue-700"
								>
									<Pencil className="w-5 h-5" />
								</button>
								<button
									onClick={() => confirmDelete(note.id)}
									className="font-bold text-red-600 hover:text-red-800"
								>
									<Trash2 className="w-5 h-5" />
								</button>
							</div>
							{/* Title & Description */}
							<div className="mt-8 mb-2">
								<div className="font-semibold text-gray-800 text-lg mb-1 break-words">
									{note.title}
								</div>
								<div className="text-gray-600 text-sm break-words whitespace-pre-line">
									{note.description}
								</div>
								{note.project && (
									<div className="text-xs text-blue-500 mt-1 break-words">
										Project: {note.project}
									</div>
								)}
							</div>
							{/* Date */}
							<div className="text-right text-xs text-gray-400 mt-auto">
								{note.date}
							</div>
						</div>
					))}
				</div>

				{/* Modal for Add/Edit Note */}
				{showModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="bg-white rounded-2xl shadow-2xl p-6 w-[98vw] h-[94vh] max-w-[1200px] max-h-[94vh] relative flex flex-col overflow-hidden">
							<button
								className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-20"
								onClick={closeModal}
								aria-label="Close"
								style={{ lineHeight: 1, padding: 0 }}
							>
								<X className="w-4 h-4" />
							</button>
							<form onSubmit={handleSubmit} className="flex flex-1 gap-8 h-full">
								{/* Left: Title, Project, Date, Actions */}
								<div className="flex flex-col min-w-[320px] max-w-[400px] w-full">
									<h2 className="text-3xl font-bold mb-4 text-black break-words">
										{modalType === 'add' ? 'Add Note' : 'Edit Note'}
									</h2>
									<input
										type="text"
										name="title"
										value={form.title}
										onChange={handleChange}
										placeholder="Note Title"
										required
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-xl mb-4 break-words"
										style={{ wordBreak: 'break-word' }}
									/>
									<input
										type="text"
										name="project"
										value={form.project}
										onChange={handleChange}
										placeholder="Project Name (optional)"
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black mb-4 break-words"
										style={{ wordBreak: 'break-word' }}
									/>
									<div className="text-sm text-gray-500 mb-4">
										{form.date || new Date().toLocaleDateString('en-GB')}
									</div>
									<div className="flex gap-2 mb-4">
										<input
											type="checkbox"
											name="pinned"
											checked={form.pinned}
											onChange={handleChange}
											className="accent-yellow-500"
										/>
										<span className="text-gray-600 text-sm">Pin this note</span>
									</div>
									<div className="flex gap-2 mt-auto">
										<button
											type="button"
											onClick={closeModal}
											className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold"
										>
											{modalType === 'add' ? 'Add' : 'Save'}
										</button>
									</div>
								</div>
								{/* Right: Description */}
								<div className="flex-1 flex flex-col">
									<textarea
										name="description"
										value={form.description}
										onChange={handleChange}
										placeholder="Description"
										required
										rows={18}
										className="w-full h-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black text-base resize-none min-h-[200px] flex-1 break-words pr-12"
										style={{ wordBreak: 'break-word', marginRight: '5.5rem' }} // <-- Added marginRight for extra gap
									/>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Large Note Modal */}
				{showNoteModal && selectedNote && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
						<div className="bg-white rounded-2xl shadow-2xl p-6 w-[98vw] h-[94vh] max-w-[1200px] max-h-[94vh] relative flex flex-col overflow-hidden">
							{/* Content Row */}
							<div className="flex flex-1 gap-8 h-full">
								{/* Left: Title, Project, Date, Actions */}
								<div className="flex flex-col min-w-[320px] max-w-[400px] w-full">
									<div className="flex flex-col gap-4">
										<h2 className="text-3xl font-bold text-black break-words">
											{selectedNote.title}
										</h2>
										{selectedNote.project && (
											<div className="text-base text-blue-500 break-words">
												Project: {selectedNote.project}
											</div>
										)}
										<div className="text-sm text-gray-500">
											{selectedNote.date}
										</div>
									</div>
									<div className="flex gap-2 mt-8">
										<button
											onClick={() => {
												closeNoteModal();
												openModal('edit', selectedNote);
											}}
											className="font-bold text-black hover:text-blue-700"
											title="Edit"
										>
											<Pencil className="w-6 h-6" />
										</button>
										<button
											onClick={() => confirmDelete(selectedNote.id)}
											className="font-bold text-red-600 hover:text-red-800"
											title="Delete"
										>
											<Trash2 className="w-6 h-6" />
										</button>
										<button
											onClick={() => {
												togglePin(selectedNote.id);
												setSelectedNote({
													...selectedNote,
													pinned: !selectedNote.pinned,
												});
											}}
											className={`font-bold ${
												selectedNote.pinned ? 'text-yellow-500' : 'text-gray-400'
											} hover:text-yellow-600`}
											title={selectedNote.pinned ? 'Unpin' : 'Pin'}
										>
											<Pin
												className="w-6 h-6"
												fill={selectedNote.pinned ? 'currentColor' : 'none'}
											/>
										</button>
									</div>
								</div>
								{/* Right: Description */}
								<div className="flex-1 flex flex-col">
									<div className="text-gray-600 text-xl whitespace-pre-line break-words overflow-y-auto flex-1 p-2 bg-gray-50 rounded-lg pr-12">
										{selectedNote.description}
									</div>
								</div>
							</div>
							{/* Close button */}
							<button
								className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-20"
								onClick={closeNoteModal}
								aria-label="Close"
								style={{ lineHeight: 1, padding: 0 }}
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}

				{/* Delete Confirmation Popup */}
				{showDeleteConfirm && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    onClick={handleCancelDelete}
  >
    <div
      className="bg-white rounded-xl shadow-lg p-6 min-w-[300px] max-w-[90vw] flex flex-col items-center"
      onClick={e => e.stopPropagation()}
    >
      <div className="text-lg font-semibold mb-6 text-gray-800 text-center">
        Do you really want to delete this note?
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleConfirmDelete}
          className="px-4 py-2 rounded-lg bg-red-200 text-red-800 font-semibold hover:bg-red-300"
        >
          Yes
        </button>
        <button
          onClick={handleCancelDelete}
          className="px-4 py-2 rounded-lg bg-blue-200 text-blue-800 font-semibold hover:bg-blue-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
			</div>
		</>
	);
};

export default Notes;