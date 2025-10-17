'use client';

import React, { useEffect, useState } from 'react';
import { MentorPublicProfilePage } from '@/components/domainExpert';
import { MentorPublicProfile } from '@/types/mentor';
import { useParams } from 'next/navigation';


export default function MentorProfilePage() {
  const params = useParams();
  const mentorId = params?.mentorId as string;
  const [mentor, setMentor] = useState<MentorPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        setLoading(true);
        // Replace this with your actual API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/domain-experts/${mentorId}/public-profile`);
        const data = await response.json();
        setMentor(data);
        setError(null);
      } catch (err) {
        setError('Failed to load mentor profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorProfile();
    }
  }, [mentorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center font-sans">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" aria-hidden></div>
          <p className="text-base text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center font-sans">
          <p className="text-lg text-destructive mb-4">{error}</p>
          <a href="/search-experts" className="text-base text-primary hover:underline">
            Back to search
          </a>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-base text-muted-foreground">Mentor not found</p>
      </div>
    );
  }

  return <MentorPublicProfilePage mentor={mentor} />;
}
