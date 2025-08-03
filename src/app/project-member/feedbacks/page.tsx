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
  // Example mentor list; replace with API data in real app
  const mentors = useMemo(() => [
    'Dr. Smith',
    'Ms. Johnson',
    'Prof. Lee',
    'Mr. Brown',
  ], []);

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ mentorName: '', rating: 5, comment: '' });
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    if (!form.mentorName) {
      setMessage({ type: 'error', text: 'Please select a mentor.' });
      return;
    }
    if (!form.comment.trim()) {
      setMessage({ type: 'error', text: 'Comment cannot be empty.' });
      return;
    }
    if (reviews.some(r => r.mentorName === form.mentorName)) {
      setMessage({ type: 'error', text: 'You have already reviewed this mentor.' });
      return;
    }
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
    setMessage({ type: 'success', text: 'Review added successfully!' });
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <h1 className="text-3xl font-extrabold mb-4 text-indigo-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.37 3.905a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.538 1.118l-5.37-3.905a1 1 0 00-1.175 0l-5.37 3.905c-.783.57-1.838-.197-1.538-1.118l2.036-6.29a1 1 0 00-.364-1.118L2.293 11.717c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.036-6.29z" /></svg>
            Mentor Feedbacks
          </h1>
          {message && (
            <div className={`mb-4 px-4 py-2 rounded ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{message.text}</div>
          )}
          <form onSubmit={handleAddReview} className="mb-4">
            <div className="mb-3">
              <label className="block mb-1 font-medium">Mentor</label>
              <select
                name="mentorName"
                value={form.mentorName}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                required
              >
                <option value="">Select a mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor} value={mentor}>{mentor}</option>
                ))}
              </select>
            </div>
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
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition font-semibold shadow">Add Review</button>
          </form>
        </div>
        <div className="space-y-6">
          {reviews.length === 0 && <p className="text-slate-500 text-center">No reviews yet.</p>}
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-5 rounded-xl shadow flex flex-col gap-2 border border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-indigo-700 text-lg">{review.mentorName}</span>
                  <span className="ml-2 text-amber-500 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-indigo-600 hover:underline font-medium px-2 py-1 rounded hover:bg-indigo-50 transition"
                    onClick={() => handleEdit(review)}
                    disabled={editingId === review.id}
                  >Edit</button>
                  <button
                    className="text-rose-600 hover:underline font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
                    onClick={() => handleDelete(review.id)}
                  >Delete</button>
                </div>
              </div>
              {editingId === review.id ? (
                <div className="mt-2 bg-slate-50 rounded p-3 border border-slate-200">
                  <div className="mb-2">
                    <label className="block mb-1 font-medium">Rating</label>
                    <StarRating rating={Number(editForm.rating)} onChange={(r) => setEditForm((prev) => ({ ...prev, rating: r }))} ariaLabel="Edit rating:" />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 font-medium">Comment</label>
                    <textarea
                      name="comment"
                      value={editForm.comment}
                      onChange={handleEditInputChange}
                      className="w-full border border-slate-300 rounded px-2 py-1 mb-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      maxLength={300}
                    />
                  </div>
                  <button
                    className="bg-emerald-600 text-white px-4 py-1 rounded mr-2 hover:bg-emerald-700 transition font-semibold shadow"
                    onClick={() => handleSaveEdit(review.id)}
                  >Save</button>
                  <button
                    className="bg-slate-400 text-white px-4 py-1 rounded hover:bg-slate-500 transition font-semibold shadow"
                    onClick={() => setEditingId(null)}
                  >Cancel</button>
                </div>
              ) : (
                <p className="text-slate-700 whitespace-pre-line mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
