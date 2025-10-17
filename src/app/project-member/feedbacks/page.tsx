'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from "@/contexts/AuthContext";

type ServiceStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CONFIRMED';

interface Expert {
  id: string;
  name: string;
  specialty: string;
  sessionDate: string;
  hasReview: boolean;
}

interface Review {
  expertId: string;
  expertName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Service {
  id: number;
  serviceId: string;
  serviceSubject: string;
  serviceTitl: string;
  expertFirstName: string;
  expertLastName: string;
  expertEmail: string;
  status: ServiceStatus;
}

const hireingFunctions = {
  getHiredExpertsData: async (userId: string): Promise<Service[]> => {
    try {
      const response = await api.get(`/project-member/projects/hired-expert/${userId}`);
      console.log('User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
};

export default function ExpertReviewInterface() {
  const user = useAuth().user;
  const [activeTab, setActiveTab] = useState<'experts' | 'reviews'>('experts');
  const [services, setServices] = useState<Service[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [reviews, setReviews] = useState<Review[]>([
    {
      expertId: '2',
      expertName: 'Dr. Michael Chen',
      rating: 5,
      comment: 'Excellent consultation! Very thorough and professional.',
      date: '2024-10-14',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchHiredExperts = async () => {
      if (!user) return;

      try {
        const fetchedServices = await hireingFunctions.getHiredExpertsData(user.id);
        setServices(fetchedServices);

        // Filter only ACCEPTED experts
        const acceptedExperts = fetchedServices
          .filter((service) => service.status === 'ACCEPTED')
          .map((service) => ({
            id: service.serviceId,
            name: `${service.expertFirstName} ${service.expertLastName}`,
            specialty: service.serviceTitl || 'Not specified',
            sessionDate: new Date().toISOString(), // Placeholder if API doesn’t have sessionDate
            hasReview: false,
          }));

        setExperts(acceptedExperts);
      } catch (error) {
        console.error('Error fetching hired experts:', error);
      }
    };

    fetchHiredExperts();
  }, [user]);

  const openReviewModal = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsModalOpen(true);
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpert(null);
    setRating(0);
    setHoverRating(0);
    setComment('');
  };

  const submitReview = () => {
    if (!selectedExpert || rating === 0) return;

    const newReview: Review = {
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([...reviews, newReview]);
    setExperts(
      experts.map((expert) =>
        expert.id === selectedExpert.id
          ? { ...expert, hasReview: true }
          : expert
      )
    );

    closeModal();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Expert Review Dashboard
        </h1>

        {/* Tabs */}
        <div className="rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('experts')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'experts'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Experts ({experts.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Reviews ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Experts Tab */}
            {activeTab === 'experts' && (
              <div className="space-y-4">
                {experts.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No accepted experts found.
                  </p>
                ) : (
                  experts.map((expert) => (
                    <div
                      key={expert.id}
                      className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {expert.name}
                          </h3>
                          {expert.hasReview && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              Reviewed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {expert.specialty}
                        </p>
                        <p className="text-sm text-gray-500">
                          Session:{' '}
                          {new Date(expert.sessionDate).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => openReviewModal(expert)}
                        disabled={expert.hasReview}
                        className={`py-2 px-6 rounded-md font-medium transition-colors whitespace-nowrap ${
                          expert.hasReview
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {expert.hasReview ? 'Review Submitted' : 'Write Review'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No reviews yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start by writing a review for an expert.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('experts')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Go to Experts
                      </button>
                    </div>
                  </div>
                ) : (
                  reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {review.expertName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && selectedExpert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Write Review</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedExpert.name}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedExpert.specialty}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={rating === 0}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  rating === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
