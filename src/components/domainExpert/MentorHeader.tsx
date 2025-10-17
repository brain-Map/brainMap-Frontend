'use client';

import Image from 'next/image';
import { MapPin, Star, Briefcase, Calendar, ExternalLink } from 'lucide-react';
import { MentorPublicProfile } from '@/types/mentor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MentorHeaderProps {
  mentor: MentorPublicProfile;
}

export const MentorHeader: React.FC<MentorHeaderProps> = ({ mentor }) => {
  const profileImage = mentor.profilePhotoUrl || mentor.avatar;
  // Build a safe image URL:
  // - If profileImage is an absolute URL, use it
  // - Else if NEXT_PUBLIC_API_URL is set, join them
  // - Else use a relative path (ensures '/uploads/...' works from public or server)
  // Use a leading slash for public images so Next/Image receives a valid relative path
  let imageUrl = '/image/user_placeholder.jpg';
  if (profileImage) {
    if (/^https?:\/\//i.test(profileImage)) {
      imageUrl = profileImage;
    } else if (process.env.NEXT_PUBLIC_API_URL) {
      const base = String(process.env.NEXT_PUBLIC_API_URL).replace(/\/+$/g, '');
      const path = String(profileImage).replace(/^\/+/, '');
      // Ensure we form a valid absolute URL; guard against invalid NEXT_PUBLIC_API_URL or profileImage
      try {
        const maybeUrl = new URL(`${base}/${path}`);
        imageUrl = maybeUrl.toString();
      } catch (err) {
        // fall back to placeholder
        imageUrl = '/image/user_placeholder.jpg';
      }
    } else {
      imageUrl = profileImage.startsWith('/') ? profileImage : `/${profileImage}`;
    }
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-blue-400 shadow-lg">
              <Image
                src={"https://uvekrjsbsjxvaveqtbnu.supabase.co/storage/v1/object/public/uploads/avatars/56fd13ac-095a-409b-83bb-97452c446b5c.png?t=1760625878370"}
                alt={`${mentor.firstName} ${mentor.lastName}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Header Content */}
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                {mentor.firstName} {mentor.lastName}
              </h1>
              {mentor.status === 'VERIFIED' && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  ✓ Verified
                </Badge>
              )}
            </div>

            <p className="text-blue-300 text-lg mb-4">@{mentor.username}</p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold">
                  {mentor.rating.toFixed(1)} ({mentor.reviewsCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-300" />
                <span className="text-lg font-semibold">
                  {mentor.completedBookingsCount} completed bookings
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                <span className="text-lg font-semibold">{mentor.location}</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-3 flex-wrap">
              {mentor.linkedinProfile && (
                <a
                  href={mentor.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  LinkedIn
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {mentor.portfolio && (
                <a
                  href={mentor.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition"
                >
                  Portfolio
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
