export interface ServiceAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ServiceListing {
  serviceId: string;
  title: string;
  subject: string;
  description: string;
  fee: number | null;
  createdAt: string;
  updatedAt: string;
  mentorId: string;
  mentorFirstName: string;
  mentorLastName: string;
  mentorBio?: string;
  mentorAvatar: string;
  availabilities: ServiceAvailability[];
  thumbnailUrl: string;
  duration: number | null;
  serviceType: "video-session" | "chat" | "mixed";
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
