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
 * Until backend is ready, this service falls back to mock data in development.
 * Future moderator features can be added to this service.
 */

// Types for Expert Approval System
export interface ExpertDocument {
  id?: number;
  name: string;
  type: string;
  url?: string;
  verified: boolean;
  uploadedAt?: string;
}

export interface ExpertProject {
  id?: number;
  title: string;
  duration: string;
  role: string;
  description: string;
  technologies: string[];
  outcome: string;
}

export interface ExpertRequest {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  domain: string;
  specialization: string;
  education: string;
  experience: string;
  currentPosition: string;
  institution: string;
  submittedDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  publications?: number;
  citations?: number;
  documents: ExpertDocument[];
  bio?: string;
  researchAreas: string[];
  achievements: string[];
  projects: ExpertProject[];
  reviewedBy?: number;
  reviewedDate?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpertRequestsResponse {
  requests: ExpertRequest[];
  totalCount: number;
  pendingCount: number;
  underReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface UpdateExpertStatusRequest {
  expertRequestId: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
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
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  
  /**
   * Mock data for development when backend is not ready
   */
  private getMockExpertRequests(): ExpertRequestsResponse {
    const mockRequests: ExpertRequest[] = [
      {
        id: 1,
        userId: 1,
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        phone: "+1 (555) 123-4567",
        location: "Boston, MA",
        profileImage: "/public/image/user.jpg",
        domain: "Machine Learning",
        specialization: "Computer Vision & Neural Networks",
        education: "Ph.D. in Computer Science - MIT",
        experience: "8 years",
        currentPosition: "Senior Research Scientist at Google AI",
        institution: "Google AI Research",
        submittedDate: "2024-01-15",
        status: "pending",
        publications: 25,
        citations: 450,
        documents: [
          { name: "PhD Certificate", type: "pdf", verified: true },
          { name: "Research Portfolio", type: "pdf", verified: false },
          { name: "Reference Letter", type: "pdf", verified: true }
        ],
        bio: "Dr. Sarah Johnson is a leading researcher in computer vision and neural networks with over 8 years of experience.",
        researchAreas: ["Computer Vision", "Deep Learning", "Neural Networks", "AI Ethics"],
        achievements: [
          "Best Paper Award at CVPR 2023",
          "Google Research Excellence Award 2022",
          "IEEE Young Researcher Award 2021"
        ],
        projects: [
          {
            title: "Autonomous Vehicle Vision System",
            duration: "2022-2024",
            role: "Lead AI Researcher",
            description: "Developed computer vision algorithms for real-time object detection and tracking in autonomous vehicles.",
            technologies: ["TensorFlow", "OpenCV", "Python", "CUDA"],
            outcome: "Deployed in production vehicles"
          }
        ],
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        userId: 2,
        name: "Prof. Michael Chen",
        email: "m.chen@stanford.edu",
        phone: "+1 (555) 987-6543",
        location: "Stanford, CA",
        profileImage: "/public/image/user.jpg",
        domain: "Data Science",
        specialization: "Big Data Analytics & Statistical Modeling",
        education: "Ph.D. in Statistics - Stanford University",
        experience: "12 years",
        currentPosition: "Professor of Statistics",
        institution: "Stanford University",
        submittedDate: "2024-01-18",
        status: "under_review",
        publications: 40,
        citations: 680,
        documents: [
          { name: "Academic Credentials", type: "pdf", verified: true },
          { name: "Publication List", type: "pdf", verified: true },
          { name: "University Appointment Letter", type: "pdf", verified: false }
        ],
        bio: "Professor Chen is a renowned statistician specializing in big data analytics and statistical modeling.",
        researchAreas: ["Big Data", "Statistical Modeling", "Healthcare Analytics", "Financial Statistics"],
        achievements: [
          "Fellow of the American Statistical Association",
          "Outstanding Teaching Award 2022",
          "NSF Career Award 2019"
        ],
        projects: [
          {
            title: "Healthcare Data Analytics Platform",
            duration: "2023-2024",
            role: "Principal Investigator",
            description: "Developed predictive models for patient outcome analysis using big data techniques.",
            technologies: ["R", "Python", "Spark", "Hadoop"],
            outcome: "Adopted by Stanford Hospital"
          }
        ],
        createdAt: "2024-01-18T14:20:00Z",
        updatedAt: "2024-01-20T09:15:00Z"
      },
      {
        id: 3,
        userId: 3,
        name: "Dr. Emily Rodriguez",
        email: "e.rodriguez@biotech.com",
        phone: "+1 (555) 456-7890",
        location: "San Francisco, CA",
        profileImage: "/public/image/user.jpg",
        domain: "Biotechnology",
        specialization: "Genetic Engineering & Bioinformatics",
        education: "Ph.D. in Molecular Biology - UCSF",
        experience: "6 years",
        currentPosition: "Senior Biotech Researcher",
        institution: "Genentech Inc.",
        submittedDate: "2024-01-20",
        status: "approved",
        publications: 18,
        citations: 320,
        documents: [
          { name: "PhD Diploma", type: "pdf", verified: true },
          { name: "Industry Experience Certificate", type: "pdf", verified: true },
          { name: "Research Publications", type: "pdf", verified: true }
        ],
        bio: "Dr. Rodriguez is an expert in genetic engineering and bioinformatics, working on cutting-edge gene therapy research.",
        researchAreas: ["Genetic Engineering", "Bioinformatics", "Gene Therapy", "CRISPR Technology"],
        achievements: [
          "Breakthrough Research Award 2023",
          "Young Scientist Award in Biotechnology",
          "Patent holder for gene editing technique"
        ],
        projects: [
          {
            title: "CRISPR Gene Editing Platform",
            duration: "2023-2024",
            role: "Lead Researcher",
            description: "Developed next-generation CRISPR tools for precise gene editing in therapeutic applications.",
            technologies: ["CRISPR-Cas9", "Python", "Bioinformatics Tools"],
            outcome: "3 patents filed"
          }
        ],
        reviewedBy: 1,
        reviewedDate: "2024-01-22T16:45:00Z",
        createdAt: "2024-01-20T11:30:00Z",
        updatedAt: "2024-01-22T16:45:00Z"
      }
    ];

    return {
      requests: mockRequests,
      totalCount: mockRequests.length,
      pendingCount: mockRequests.filter(r => r.status === 'pending').length,
      underReviewCount: mockRequests.filter(r => r.status === 'under_review').length,
      approvedCount: mockRequests.filter(r => r.status === 'approved').length,
      rejectedCount: mockRequests.filter(r => r.status === 'rejected').length,
    };
  }

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
      
      // If backend is not ready (500 error), return mock data for development
      if (this.isDevelopment && (error.response?.status === 500 || error.code === 'ERR_BAD_RESPONSE')) {
        console.warn('🔧 Backend API not ready. Using mock data for development.');
        console.info('📋 Mock data includes 3 sample expert requests with different statuses.');
        return this.getMockExpertRequests();
      }
      
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
      const response = await api.put(`/api/moderator/expert-requests/${request.expertRequestId}/status`, {
        status: request.status,
        reviewNotes: request.reviewNotes
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to update expert status:', error);
      
      // If backend is not ready, simulate successful update for development
      if (this.isDevelopment && (error.response?.status === 500 || error.code === 'ERR_BAD_RESPONSE')) {
        console.warn('🔧 Backend API not ready. Simulating status update for development.');
        return this.getMockUpdatedExpert(request.expertRequestId, request.status);
      }
      
      throw new Error(
        error.response?.data?.message || 'Failed to update expert status'
      );
    }
  }

  /**
   * Mock updated expert for development
   */
  private getMockUpdatedExpert(id: number, status: string): ExpertRequest {
    const mockRequests = this.getMockExpertRequests();
    const expert = mockRequests.requests.find(r => r.id === id);
    
    if (!expert) {
      throw new Error('Expert not found');
    }
    
    return {
      ...expert,
      status: status as any,
      updatedAt: new Date().toISOString(),
      reviewedDate: new Date().toISOString(),
      reviewedBy: 1 // Mock moderator ID
    };
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