import api from '@/utils/api';
import {
  BookingRequest,
  BookingStatusUpdate,
  BookingStats,
  BookingFilters,
  CreateBookingRequest,
  BookingResponse,
  BookingsListResponse,
} from '@/types/booking';

const BOOKING_API_BASE = '/api/v1/service-listings';

export const bookingApi = {
  /**
   * Get all bookings for the authenticated domain expert
   */
  getMyBookings: async (filters?: BookingFilters): Promise<BookingsListResponse> => {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.serviceType) params.append('serviceType', filters.serviceType);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.page !== undefined) params.append('page', filters.page.toString());
      if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

      const response = await api.get(`${BOOKING_API_BASE}/expert/my-bookings?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  /**
   * Get a single booking by ID
   */
  getBookingById: async (bookingId: string): Promise<BookingRequest> => {
    try {
      const response = await api.get(`${BOOKING_API_BASE}/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  /**
   * Create a new booking (student side)
   */
  createBooking: async (bookingData: CreateBookingRequest): Promise<BookingResponse> => {
    try {
      console.debug('Creating booking with payload:', bookingData);
      const response = await api.post(`${BOOKING_API_BASE}/service-booking`, bookingData);
      return response.data;
    } catch (error) {
      const err: any = error;
      console.error('Error creating booking:', err.message || err);
      if (err.response) {
        console.error('Booking create response status:', err.response.status);
        console.error('Booking create response data:', err.response.data);
        // If server provided a message, throw that for UI clarity
        const serverMsg = err.response.data?.message || err.response.data;
        throw new Error(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
      }
      throw error;
    }
  },

  /**
   * Update booking status (expert side)
   */
  updateBookingStatus: async (
    bookingId: string,
    statusUpdate: Omit<BookingStatusUpdate, 'bookingId'>
  ): Promise<BookingResponse> => {
    try {
      // Use template variable to build the correct endpoint path
      const response = await api.patch(
        `${BOOKING_API_BASE}/service-booking/${bookingId}/review`,
        statusUpdate
      );
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  /**
   * Approve a booking request
   */
  approveBooking: async (bookingId: string, notes?: string): Promise<BookingResponse> => {
    return bookingApi.updateBookingStatus(bookingId, {
      status: 'accepted',
      notes,
    });
  },

  /**
   * Reject a booking request
   */
  rejectBooking: async (bookingId: string, notes?: string): Promise<BookingResponse> => {
    return bookingApi.updateBookingStatus(bookingId, {
      status: 'rejected',
      notes,
    });
  },

  /**
   * Mark booking as completed
   */
  completeBooking: async (bookingId: string, notes?: string): Promise<BookingResponse> => {
    return bookingApi.updateBookingStatus(bookingId, {
      status: 'completed',
      notes,
    });
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (bookingId: string, notes?: string): Promise<BookingResponse> => {
    try {
      const response = await api.post(`${BOOKING_API_BASE}/${bookingId}/cancel`, { notes });
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  /**
   * Get booking statistics for expert
   */
  getBookingStats: async (): Promise<BookingStats> => {
    try {
      const response = await api.get(`${BOOKING_API_BASE}/expert/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  },

  /**
   * Get pending bookings count
   */
  getPendingCount: async (): Promise<number> => {
    try {
      const response = await api.get(`${BOOKING_API_BASE}/expert/pending-count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching pending count:', error);
      throw error;
    }
  },

  /**
   * Get upcoming sessions
   */
  getUpcomingSessions: async (limit: number = 10): Promise<BookingRequest[]> => {
    try {
      const response = await api.get(`${BOOKING_API_BASE}/expert/upcoming?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      throw error;
    }
  },

  /**
   * Reschedule a booking
   */
  rescheduleBooking: async (
    bookingId: string,
    newDate: string,
    newTime: string
  ): Promise<BookingResponse> => {
    try {
      const response = await api.patch(`${BOOKING_API_BASE}/${bookingId}/reschedule`, {
        requestedDate: newDate,
        requestedTime: newTime,
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      throw error;
    }
  },
};

export default bookingApi;
