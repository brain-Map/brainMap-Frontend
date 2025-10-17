export interface ExpertiseArea {
  expertise: string;
  experience: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface Pricing {
  pricingId: string;
  pricingType: string;
  price: number;
}

export interface WhatYouGetItem {
  title: string;
  description: string;
}

export interface Service {
  serviceId: string;
  title: string;
  category: string;
  description: string;
  availabilityModes: string[];
  createdAt: string;
  updatedAt: string;
  mentorId: string;
  thumbnailUrl?: string;
  mentorFirstName: string;
  mentorLastName: string;
  mentorBio: string;
  mentorAvatar?: string;
  pricings: Pricing[];
  expertiseAreas: string[];
  whatYouGet: WhatYouGetItem[];
}

export interface MentorPublicProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
  profilePhotoUrl?: string;
  status: string;
  domain?: string | null;
  bio: string;
  workExperience: string;
  linkedinProfile?: string;
  portfolio?: string;
  location: string;
  createdAt: string;
  expertiseAreas: ExpertiseArea[];
  educations: Education[];
  services: Service[];
  socialLinks: any[];
  rating: number;
  reviewsCount: number;
  completedBookingsCount: number;
}
