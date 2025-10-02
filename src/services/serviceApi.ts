import api from '@/utils/api';
import { ServiceListingsResponse, ServiceListing } from '@/types/service';

export const serviceApi = {
  /**
   * Get all service listings with pagination and sorting
   */
  getAllServiceListings: async (
    page: number = 0,
    size: number = 20,
    sortBy: string = 'createdAt'
  ): Promise<ServiceListingsResponse> => {
    const response = await api.get('/api/v1/domain-experts/service-listings', {
      params: {
        page,
        size,
        sortBy,
      },
    });
    return response.data;
  },

  /**
   * Get a single service listing by ID
   */
  getServiceById: async (serviceId: string): Promise<ServiceListing> => {
    const response = await api.get(`/api/v1/domain-experts/service-listings/${serviceId}`);
    return response.data;
  },
};
