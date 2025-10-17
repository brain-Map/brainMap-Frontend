import api from '@/utils/api';

export interface CreateMeetingRequest {
  title: string;
}

export interface Meeting {
  id: string;
  roomName: string;
  title: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  participants: number;
  maxParticipants?: number;
  startTime?: string;
  endTime?: string;
}

class MeetingApiService {
  /**
   * Create a new meeting
   * POST /api/v1/meetings/create
   * 
   * @param title - Meeting title
   * @returns Created meeting object
   */
  async createMeeting(title: string): Promise<Meeting> {
    try {
      const response = await api.post<Meeting>('/api/v1/meetings/create', {
        title
      });
      
      console.log('✅ Meeting created successfully:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Failed to create meeting:', error);
      
      // Enhanced error handling
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data;
        
        if (status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (status === 403) {
          throw new Error('You do not have permission to create meetings.');
        } else if (status === 400) {
          throw new Error(`Invalid meeting data: ${message}`);
        } else if (status === 404) {
          throw new Error('Backend API endpoint not found. Please ensure the backend server is running.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Server error (${status}): ${message || 'Unknown error'}`);
        }
      }
      
      // Network error or other issues
      if (error.message) {
        throw error;
      }
      
      throw new Error('Failed to create meeting. Please try again.');
    }
  }

  /**
   * Get all meetings for the current user
   * GET /api/v1/meetings/user
   * 
   * @returns List of user's meetings
   */
  async getUserMeetings(): Promise<Meeting[]> {
    try {
      const response = await api.get<Meeting[]>('/api/v1/meetings/user');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch user meetings:', error);
      throw new Error('Failed to load meetings. Please try again.');
    }
  }

  /**
   * Get meeting by ID
   * GET /api/v1/meetings/{id}
   * 
   * @param meetingId - Meeting ID
   * @returns Meeting details
   */
  async getMeetingById(meetingId: string): Promise<Meeting> {
    try {
      const response = await api.get<Meeting>(`/api/v1/meetings/${meetingId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch meeting:', error);
      throw new Error('Failed to load meeting details. Please try again.');
    }
  }

  /**
   * Join a meeting
   * POST /api/v1/meetings/{id}/join
   * 
   * @param meetingId - Meeting ID to join
   * @returns Updated meeting object
   */
  async joinMeeting(meetingId: string): Promise<Meeting> {
    try {
      const response = await api.post<Meeting>(`/api/v1/meetings/${meetingId}/join`);
      console.log('✅ Joined meeting successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to join meeting:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Meeting not found.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to join this meeting.');
      }
      
      throw new Error('Failed to join meeting. Please try again.');
    }
  }

  /**
   * End a meeting
   * POST /api/v1/meetings/{id}/end
   * 
   * @param meetingId - Meeting ID to end
   */
  async endMeeting(meetingId: string): Promise<void> {
    try {
      await api.post(`/api/v1/meetings/${meetingId}/end`);
      console.log('✅ Meeting ended successfully');
    } catch (error: any) {
      console.error('❌ Failed to end meeting:', error);
      throw new Error('Failed to end meeting. Please try again.');
    }
  }

  /**
   * Delete a meeting
   * DELETE /api/v1/meetings/{id}
   * 
   * @param meetingId - Meeting ID to delete
   */
  async deleteMeeting(meetingId: string): Promise<void> {
    try {
      await api.delete(`/api/v1/meetings/${meetingId}`);
      console.log('✅ Meeting deleted successfully');
    } catch (error: any) {
      console.error('❌ Failed to delete meeting:', error);
      throw new Error('Failed to delete meeting. Please try again.');
    }
  }

  /**
   * Update meeting details
   * PUT /api/v1/meetings/{id}
   * 
   * @param meetingId - Meeting ID to update
   * @param updates - Meeting updates
   * @returns Updated meeting object
   */
  async updateMeeting(meetingId: string, updates: Partial<CreateMeetingRequest>): Promise<Meeting> {
    try {
      const response = await api.put<Meeting>(`/api/v1/meetings/${meetingId}`, updates);
      console.log('✅ Meeting updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to update meeting:', error);
      throw new Error('Failed to update meeting. Please try again.');
    }
  }

  /**
   * Get active meetings
   * GET /api/v1/meetings/active
   * 
   * @returns List of active meetings
   */
  async getActiveMeetings(): Promise<Meeting[]> {
    try {
      const response = await api.get<Meeting[]>('/api/v1/meetings/active');
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch active meetings:', error);
      throw new Error('Failed to load active meetings. Please try again.');
    }
  }
}

// Export singleton instance
export const meetingApiService = new MeetingApiService();
export default meetingApiService;
