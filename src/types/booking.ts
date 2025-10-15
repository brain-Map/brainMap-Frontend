// Domain Expert Appointment Request Type
export interface DomainExpertRequest {
  id: string
  serviceId: string
  serviceTitle: string
  serviceType: string
  userId: string
  username: string
  userFirstName: string
  userLastName: string
  userEmail: string
  userAvatar?: string
  duration: number
  projectDetails: string
  requestedDate: string
  requestedStartTime: string
  requestedEndTime: string
  totalPrice: number
  status: "pending" | "accepted" | "rejected" | "completed" | "canceled" | "updated"
  acceptedDate?: string
  acceptedTime?: string
  acceptedPrice?: number
  rejectionReason?: string
  createdAt: string
  updatedAt?: string
}
// Booking and Appointment Request Types

export interface BookingRequest {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  studentPhone?: string
  studentAvatar?: string
  serviceId: string
  serviceTitle: string
  serviceType: "video-session" | "chat" | "mixed"
  duration: number
  totalPrice: number
  projectDetails: string
  requestedDate: string
  requestedTime: string
  status: "pending" | "accepted" | "rejected" | "completed" | "canceled" | "updated"
  createdAt: string
  updatedAt?: string
  notes?: string
}

export interface BookingStatusUpdate {
  bookingId: string
  status: "accepted" | "rejected" | "completed" | "canceled" | "updated"
  notes?: string
}

export interface BookingStats {
  total: number
  pending: number
  approved: number
  completed: number
  rejected: number
  cancelled: number
  totalRevenue: number
  upcomingSessions: number
}

export interface BookingFilters {
  status?: string
  serviceType?: "video-session" | "chat" | "mixed"
  dateFrom?: string
  dateTo?: string
  studentId?: string
  serviceId?: string
  sortBy?: "newest" | "oldest" | "date" | "price"
  page?: number
  limit?: number
}

export interface CreateBookingRequest {
  serviceId: string
  duration: number
  projectDetails: string
  requestedDate: string
  requestedStartTime: string
  requestedEndTime: string
  domainExpertId: string
  totalPrice?: number
}

export interface BookingResponse {
  booking: BookingRequest
  message: string
}

export interface BookingsListResponse {
  bookings: BookingRequest[]
  total: number
  page: number
  limit: number
  totalPages: number
}


///////

export enum ServiceBookingStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  CONFIRMED = "Confirmed",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  UPDATED = "Updated",
}

export enum SessionType {
  ONE_ON_ONE = "One-on-One",
  GROUP = "Group",
  WORKSHOP = "Workshop",
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  userId: string;
  username: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userAvatar?: string;
  duration: number;
  projectDetails: string;
  requestedDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  totalPrice: number;
  status: ServiceBookingStatus;
  sessionType: SessionType;
  acceptedDate?: string;
  acceptedTime?: string;
  acceptedPrice?: number;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}
