import api from '@/utils/api';

/**
 * Moderator API Service
 * 
 * This service handles all moderator-related API operations including:
 * - Expert approval and management
 * - User management and moderation
 * - Content moderation
 * - System administration tasks
 * 
 * BACKEND REQUIREMENTS:
 * The following Spring Boot endpoints need to be implemented:
 * - GET /api/moderator/expert-requests - Get expert requests with pagination
 * - GET /api/moderator/expert-requests/{id} - Get specific expert request
 * - PUT /api/moderator/expert-requests/{id}/status - Update expert status
 * - POST /api/moderator/expert-requests/bulk-approve - Bulk approve experts
 * - GET /api/moderator/expert-requests/stats - Get approval statistics
 * 
 * Future moderator features can be added to this service.
 */

// Types for Expert Approval System
export interface ExpertDocument {
  documentId: string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  size: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
}

export interface ExpertRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  domain: string | null;
  experience: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  documents: ExpertDocument[];
}

export interface ExpertRequestsResponse {
  requests: ExpertRequest[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UpdateExpertStatusRequest {
  expertRequestId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
}

export interface ExpertApprovalStats {
  totalRequests: number;
  pendingRequests: number;
  underReviewRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  averageReviewTime: number; // in hours
  monthlyApprovals: number;
}

class ModeratorApiService {

  /**
   * Get all expert approval requests with filtering and pagination
   */
  async getExpertRequests(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string,
    domain?: string
  ): Promise<ExpertRequestsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(search && { search }),
        ...(domain && { domain })
      });

      const response = await api.get(`/api/moderator/expert-requests?${params}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch expert requests:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch expert requests'
      );
    }
  }

  /**
   * Get a specific expert request by ID
   */
  async getExpertRequestById(id: number): Promise<ExpertRequest> {
    try {
      const response = await api.get(`/api/moderator/expert-requests/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch expert request:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch expert request'
      );
    }
  }

  /**
   * Update expert request status (approve, reject, under review)
   */
  async updateExpertStatus(request: UpdateExpertStatusRequest): Promise<ExpertRequest> {
    try {
      console.log('🔄 Updating expert status:', {
        expertRequestId: request.expertRequestId,
        status: request.status,
        reviewNotes: request.reviewNotes
      });
      
      const response = await api.put(`/api/moderator/expert-requests/${request.expertRequestId}/status`, {
        status: request.status,
        reviewNotes: request.reviewNotes
      });
      
      console.log('✅ Expert status updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to update expert status:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        endpoint: `/api/moderator/expert-requests/${request.expertRequestId}/status`
      });
      
      // Throw a more descriptive error
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || `Backend error (${error.response?.status || 'Unknown'}): ${error.message}`;
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Bulk approve multiple expert requests
   */
  async bulkApproveExperts(expertRequestIds: number[]): Promise<void> {
    try {
      await api.post('/api/moderator/expert-requests/bulk-approve', {
        expertRequestIds
      });
    } catch (error: any) {
      console.error('Failed to bulk approve experts:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to bulk approve experts'
      );
    }
  }

  /**
   * Bulk reject multiple expert requests
   */
  async bulkRejectExperts(expertRequestIds: number[], reason?: string): Promise<void> {
    try {
      await api.post('/api/moderator/expert-requests/bulk-reject', {
        expertRequestIds,
        reason
      });
    } catch (error: any) {
      console.error('Failed to bulk reject experts:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to bulk reject experts'
      );
    }
  }

  /**
   * Verify/unverify expert documents
   */
  async updateDocumentVerification(
    expertRequestId: number, 
    documentId: number, 
    verified: boolean
  ): Promise<void> {
    try {
      await api.put(`/api/moderator/expert-requests/${expertRequestId}/documents/${documentId}`, {
        verified
      });
    } catch (error: any) {
      console.error('Failed to update document verification:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to update document verification'
      );
    }
  }

  /**
   * Get expert approval statistics for dashboard
   */
  async getExpertApprovalStats(): Promise<ExpertApprovalStats> {
    try {
      const response = await api.get('/api/moderator/expert-requests/stats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch expert approval stats:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch expert approval stats'
      );
    }
  }

  /**
   * Download expert document
   */
  async downloadDocument(expertRequestId: number, documentId: number): Promise<Blob> {
    try {
      const response = await api.get(
        `/api/moderator/expert-requests/${expertRequestId}/documents/${documentId}/download`, 
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to download document:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to download document'
      );
    }
  }

  /**
   * Get list of available domains for filtering
   */
  async getDomains(): Promise<string[]> {
    try {
      const response = await api.get('/api/moderator/expert-requests/domains');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch domains:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to fetch domains'
      );
    }
  }

  /**
   * Send notification to expert about status change
   */
  async sendStatusNotification(expertRequestId: number, message?: string): Promise<void> {
    try {
      await api.post(`/api/moderator/expert-requests/${expertRequestId}/notify`, {
        message
      });
    } catch (error: any) {
      console.error('Failed to send notification:', error);
      throw new Error(
        error.response?.data?.message || 'Failed to send notification'
      );
    }
  }
}

export const expertApprovalApiService = new ModeratorApiService();

// For backward compatibility, keep the old export name
export const moderatorApiService = new ModeratorApiService();