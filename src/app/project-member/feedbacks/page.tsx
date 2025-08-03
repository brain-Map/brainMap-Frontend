"use client";

import React, { useState, useMemo, memo } from 'react';
// Star rating component for reuse
const StarRating = memo(function StarRating({ rating, onChange, ariaLabel }: { rating: number, onChange: (r: number) => void, ariaLabel?: string }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          aria-label={ariaLabel ? `${ariaLabel} ${star}` : `Rate ${star} star${star > 1 ? 's' : ''}`}
          className="focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={star <= rating ? '#f59e42' : '#e5e7eb'}
            className="w-7 h-7 hover:scale-110 transition-transform"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.967a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        </button>
      ))}
    </div>
  );
});

type Review = {
  id: number;
  mentorName: string;
  rating: number;
  comment: string;
};

const initialReviews: Review[] = [
  // Example data; replace with API data in real app
  { id: 1, mentorName: 'Dr. Smith', rating: 5, comment: 'Excellent mentor!' },
  { id: 2, mentorName: 'Ms. Johnson', rating: 4, comment: 'Very helpful and responsive.' },
];

export default function FeedbackPage() {

  // Example hired domain experts; replace with API data in real app
  const experts = useMemo(() => [
    {
      id: 1,
      name: 'Dr. Smith',
        title: 'AI & Data Science',
        avatar: '/public/image/mentor.jpg',
        bio: '10+ years in AI, Data Science, and mentoring students.'
    },
    {
      id: 2,
      name: 'Ms. Johnson',
      title: 'Cybersecurity Specialist',
      avatar: '/public/image/mentorregister.png',
      bio: 'Cybersecurity expert with a passion for teaching.'
    },
    {
      id: 3,
      name: 'Prof. Lee',
      title: 'Cloud Computing',
      avatar: '/public/image/user.jpg',
      bio: 'Cloud solutions architect and university professor.'
    },
    {
      id: 4,
      name: 'Mr. Brown',
      title: 'Software Engineering',
      avatar: '/public/image/user_placeholder.jpg',
      bio: 'Senior software engineer and mentor.'
    },
  ], []);

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmSaveId, setConfirmSaveId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ mentorName: '', rating: 1, comment: '' });
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showReviewFor, setShowReviewFor] = useState<string | null>(null);
  const [confirmSubmitReview, setConfirmSubmitReview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate before showing confirmation
    if (!form.mentorName) {
      setMessage({ type: 'error', text: 'Please select an expert.' });
      return;
    }
    if (!form.comment.trim()) {
      setMessage({ type: 'error', text: 'Comment cannot be empty.' });
      return;
    }
    if (reviews.some(r => r.mentorName === form.mentorName)) {
      setMessage({ type: 'error', text: 'You have already reviewed this expert.' });
      return;
    }
    setConfirmSubmitReview(true);
  };

  const handleConfirmAddReview = () => {
    setReviews([
      ...reviews,
      {
        id: Date.now(),
        mentorName: form.mentorName,
        rating: Number(form.rating),
        comment: form.comment,
      },
    ]);
    setForm({ mentorName: '', rating: 5, comment: '' });
    setShowReviewFor(null);
    setMessage({ type: 'success', text: 'Review added successfully!' });
    setConfirmSubmitReview(false);
  };

  const handleEdit = (review: Review) => {
    setEditForm({ rating: review.rating, comment: review.comment });
    setEditingId(review.id);
  };

  const handleSaveEdit = (id: number) => {
    if (!editForm.comment.trim()) {
      setMessage({ type: 'error', text: 'Comment cannot be empty.' });
      return;
    }
    setReviews(reviews.map(r => r.id === id ? { ...r, rating: Number(editForm.rating), comment: editForm.comment } : r));
    setEditingId(null);
    setMessage({ type: 'success', text: 'Review updated successfully!' });
  };

  const handleDelete = (id: number) => {
    setReviews(reviews.filter(r => r.id !== id));
    setMessage({ type: 'success', text: 'Review deleted.' });
  };

  // Search/filter state for reviews
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.37 3.905a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.538 1.118l-5.37-3.905a1 1 0 00-1.175 0l-5.37 3.905c-.783.57-1.838-.197-1.538-1.118l2.036-6.29a1 1 0 00-.364-1.118L2.293 11.717c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.036-6.29z" /></svg>
            Mentor Feedback & Ratings
          </h1>
          <p className="text-gray-600 mt-1">View, add, and manage your feedbacks for hired domain experts</p>
        </div>
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-64 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
        />
      </div>
      {message && (
        <div className={`mb-4 px-4 py-2 rounded ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{message.text}</div>
      )}
      {/* Experts Card Grid */}
      <h2 className="text-2xl font-bold text-primary mb-4">Hired Domain Experts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 max-w-sm mx-auto flex flex-col">
                <div className="flex items-center gap-4 mb-4 w-full">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-primary flex items-center justify-center shadow-md border-2 border-primary">
                    <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-primary truncate">{expert.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {/* Show 4 full stars, 1 half star, and the numeric value for 4.8/5 */}
                      {[1,2,3,4].map((star) => (
                        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#f59e42" className="w-5 h-5">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.967a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                      {/* Half star for 4.8 */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5">
                        <defs>
                          <linearGradient id="half-grad-title" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="50%" stopColor="#f59e42" />
                            <stop offset="50%" stopColor="#e5e7eb" />
                          </linearGradient>
                        </defs>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.538 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.783.57-1.838-.197-1.538-1.118l1.286-3.967a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" fill="url(#half-grad-title)" />
                      </svg>
                      <span className="ml-1 text-xs text-gray-700 font-semibold">4.8/5</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-4 grid grid-cols-1 gap-y-1">
                  <div><span className="font-medium text-gray-900">Agreed Rate:</span> $100/hr</div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">Session Completeness:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-xs text-gray-700 font-semibold">60%</span>
                    </div>
                  </div>
                  <div><span className="font-medium text-gray-900">Hired Project:</span> Brain Tumor Detection</div>
                  <div><span className="font-medium text-gray-900">Hired Duration:</span> Jan 2024 - Jun 2024</div>
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    className="w-full bg-primary hover:bg-secondary hover:text-black text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                    onClick={() => {
                      setShowReviewFor(expert.name);
                    setForm({ mentorName: expert.name, rating: 1, comment: '' });
                    }}
                    disabled={reviews.some(r => r.mentorName === expert.name)}
                  >
                    {reviews.some(r => r.mentorName === expert.name) ? 'Reviewed' : 'Add Review'}
                  </button>
                  <button
                    type="button"
                    className="w-full bg-slate-100 text-primary py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-semibold border border-slate-200 cursor-not-allowed"
                    disabled
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
      </div>
      {/* Add Review Modal */}
      {showReviewFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl p-6 max-w-xl w-full mx-4 relative animate-fadeIn">
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-2xl font-bold focus:outline-none"
              onClick={() => setShowReviewFor(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <form onSubmit={handleAddReview}>
              <h2 className="text-xl font-bold mb-4 text-primary">Add Review for {form.mentorName}</h2>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Rating</label>
                <StarRating rating={Number(form.rating)} onChange={(r) => setForm((prev) => ({ ...prev, rating: r }))} />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Comment</label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  required
                  maxLength={300}
                  placeholder="Share your experience (max 300 chars)"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="w-full bg-primary hover:bg-secondary hover:text-black text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">Submit Review</button>
                <button type="button" className="w-full bg-slate-400 hover:bg-slate-500 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2" onClick={() => setShowReviewFor(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Review Verification Modal */}
      {confirmSubmitReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 relative animate-fadeIn">
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-2xl font-bold focus:outline-none"
              onClick={() => setConfirmSubmitReview(false)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4 text-primary">Submit Review</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to submit this review?</p>
            <div className="flex gap-2">
              <button
                className="w-full bg-primary hover:bg-secondary hover:text-black text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                onClick={handleConfirmAddReview}
              >Yes, Submit</button>
              <button
                className="w-full bg-slate-400 hover:bg-slate-500 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                onClick={() => setConfirmSubmitReview(false)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Reviews Table Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-bold text-primary mb-4">Your Reviews</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Expert</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Comment</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {reviews.filter(r =>
                r.mentorName.toLowerCase().includes(search.toLowerCase()) ||
                r.comment.toLowerCase().includes(search.toLowerCase())
              ).length === 0 && (
                <tr>
                  <td colSpan={4} className="text-slate-500 text-center py-4">No reviews found.</td>
                </tr>
              )}
              {reviews.filter(r =>
                r.mentorName.toLowerCase().includes(search.toLowerCase()) ||
                r.comment.toLowerCase().includes(search.toLowerCase())
              ).map((review) => (
                <React.Fragment key={review.id}>
                  <tr className={editingId === review.id ? 'bg-slate-50' : ''}>
                    <td className="px-4 py-2 font-semibold text-primary align-top">{review.mentorName}</td>
                    <td className="px-4 py-2 text-amber-500 align-top">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                    <td className="px-4 py-2 text-slate-700 align-top whitespace-pre-line max-w-xs break-words">
                      {editingId === review.id ? null : review.comment}
                    </td>
                    <td className="px-4 py-2 align-top">
                      <div className="flex gap-2">
                        <button
                          className="w-full bg-primary hover:bg-secondary hover:text-black text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                          onClick={() => handleEdit(review)}
                          disabled={editingId === review.id}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm-2 6h12a2 2 0 002-2v-7.586a1 1 0 00-.293-.707l-2-2a1 1 0 00-.707-.293H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                          onClick={() => setConfirmDeleteId(review.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Delete
                        </button>

      {/* Save Verification Modal */}
      {typeof confirmSaveId === 'number' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 relative animate-fadeIn">
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-2xl font-bold focus:outline-none"
              onClick={() => setConfirmSaveId(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4 text-primary">Save Changes</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to save changes to this review?</p>
            <div className="flex gap-2">
              <button
                className="w-full bg-primary hover:bg-secondary hover:text-black text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                onClick={() => {
                  handleSaveEdit(confirmSaveId);
                  setConfirmSaveId(null);
                }}
              >Yes, Save</button>
              <button
                className="w-full bg-slate-400 hover:bg-slate-500 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                onClick={() => setConfirmSaveId(null)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Verification Modal */}
      {typeof confirmDeleteId === 'number' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 relative animate-fadeIn">
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-2xl font-bold focus:outline-none"
              onClick={() => setConfirmDeleteId(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4 text-primary">Delete Review</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                onClick={() => {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
              >Yes, Delete</button>
              <button
                className="w-full bg-slate-400 hover:bg-slate-500 text-white py-2.5 px-4 rounded-lg transition-colors duration-200"
                onClick={() => setConfirmDeleteId(null)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
                      </div>
                    </td>
                  </tr>
                  {editingId === review.id && (
                    <tr>
                      <td colSpan={4} className="p-0">
                        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
                          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl p-6 max-w-xl w-full mx-4 relative animate-fadeIn">
                            <button
                              type="button"
                              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-2xl font-bold focus:outline-none"
                              onClick={() => setEditingId(null)}
                              aria-label="Close modal"
                            >
                              &times;
                            </button>
                            <form onSubmit={e => { e.preventDefault(); handleSaveEdit(review.id); }}>
                              <h2 className="text-xl font-bold mb-4 text-primary">Edit Review for {review.mentorName}</h2>
                              <div className="mb-3">
                                <label className="block mb-1 font-medium">Rating</label>
                                <StarRating rating={Number(editForm.rating)} onChange={(r) => setEditForm((prev) => ({ ...prev, rating: r }))} ariaLabel="Edit rating:" />
                              </div>
                              <div className="mb-3">
                                <label className="block mb-1 font-medium">Comment</label>
                                <textarea
                                  name="comment"
                                  value={editForm.comment}
                                  onChange={handleEditInputChange}
                                  className="w-full border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                                  maxLength={300}
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="w-full bg-primary hover:bg-secondary hover:text-black text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                  onClick={() => setConfirmSaveId(review.id)}
                                >Save</button>
                                <button
                                  type="button"
                                  className="w-full bg-slate-400 hover:bg-slate-500 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                  onClick={() => setEditingId(null)}
                                >Cancel</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
