export interface ServiceAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Pricing {
  pricingId?: string;
  pricingType: string; // e.g. "hourly", "monthly", "project-based"
  price: number;
}

export interface WhatYouGetItem {
  title: string;
  description: string;
}

export interface ServiceListing {
  serviceId: string;
  title: string;
  category?: string;
  description: string;
  availabilityModes: string[]; // e.g. ["HOURLY","MONTHLY","PROJECT_BASED"]
  // availabilities: ServiceAvailability[];
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  mentorId: string;
  mentorFirstName: string;
  mentorLastName: string;
  mentorBio?: string;
  mentorAvatar?: string;
  pricings?: Pricing[];
  whatYouGet?: WhatYouGetItem[];
  expertiseAreas?: string[];
}

export interface PageableSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ServiceListingsResponse {
  content: ServiceListing[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: PageableSort;
  numberOfElements: number;
  empty: boolean;
}
