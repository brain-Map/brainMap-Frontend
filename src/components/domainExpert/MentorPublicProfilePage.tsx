'use client';

import React, { useState } from 'react';
import { MentorPublicProfile } from '@/types/mentor';
import { MentorHeader } from './MentorHeader';
import { MentorAbout } from './MentorAbout';
import { MentorServices } from './MentorServices';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface MentorPublicProfilePageProps {
  mentor: MentorPublicProfile;
}

export const MentorPublicProfilePage: React.FC<MentorPublicProfilePageProps> = ({ mentor }) => {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    // Navigate to booking page or show booking modal
    router.push(`services/${serviceId}/book`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <MentorHeader mentor={mentor} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <MentorAbout mentor={mentor} />
            <MentorServices services={mentor.services} onBookService={handleBookService} />
          </div>

          {/* Right Sidebar - Quick Info */}
          <div className="lg:col-span-1 space-y-4 h-fit lg:sticky lg:top-4">
            {/* <div className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-200">
              <h3 className="text-xl font-bold">Get Started</h3>
              <p className="text-gray-600 text-sm">
                Connect with {mentor.firstName} and start your mentorship journey today.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Contact Mentor
              </Button>
            </div> */}

            {/* Quick Stats Card */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-200">
              <h3 className="text-lg font-bold">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">Member Since</p>
                  <p className="text-gray-800">
                    {new Date(mentor.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">Services</p>
                  <p className="text-gray-800">{mentor.services?.length || 0} active</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold">Success Rate</p>
                  <p className="text-gray-800">
                    {mentor.reviewsCount > 0 ? `${((mentor.rating / 5) * 100).toFixed(0)}%` : 'New mentor'}
                  </p>
                </div>
              </div>
            </div>

            {/* Expertise Summary */}
            {mentor.expertiseAreas && mentor.expertiseAreas.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-200">
                <h3 className="text-lg font-bold">Expertise</h3>
                <div className="space-y-2 text-sm">
                  {mentor.expertiseAreas.map((area, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="capitalize">{area.expertise.replace(/-/g, ' ')}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {area.experience}y
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
