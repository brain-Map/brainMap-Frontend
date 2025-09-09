import { ServiceListCard } from "@/types/serviceListCard";
import api from "@/lib/axiosClient";

export interface BackendServiceData {
  title: string;
  thumbnail: string;
  subject: string;
  description: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
  mentorId: string;
  avatar: string | null;
  mentorName: string;
  mentorRating: number;
  reviews: number;
  availabilities: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  serviceId: string;
}

export interface PaginatedResponse {
  content: BackendServiceData[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}

export interface ServicesResult {
  services: ServiceListCard[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

function mapToServiceListCard(data: BackendServiceData): ServiceListCard {
  // Ensure serviceId exists to prevent errors
  const serviceId = data.serviceId || `random-${Math.random().toString(36).substr(2, 9)}`;
  
  // Debug logging for thumbnail mapping
  console.log("📋 Mapping service data:", {
    title: data.title,
    originalThumbnail: data.thumbnail,
    originalAvatar: data.avatar
  });
  
  const mappedService = {
    id: parseInt(serviceId.slice(0, 8), 16) || Math.floor(Math.random() * 1000), // Convert part of UUID to number or use random
    title: data.title || "Untitled Service",
    subject: data.subject || "General",
    description: data.description || "No description provided",
    fee: typeof data.fee === 'number' ? data.fee : 0,
    thumbnail: data.thumbnail || "", // Fixed: use thumbnail field instead of avatar
    rating: typeof data.mentorRating === 'number' ? data.mentorRating : 0,
    reviews: typeof data.reviews === 'number' ? data.reviews : 0,
    createdAt: data.createdAt || new Date().toISOString(),
    mentor: {
      name: data.mentorName || "Unknown Expert",
      role: "Domain Expert", // Default role
      avatar: data.avatar || "", // mentor avatar is separate from service thumbnail
      date: data.createdAt || new Date().toISOString(),
    },
  };
  
  console.log("🔄 Mapped service:", {
    title: mappedService.title,
    thumbnail: mappedService.thumbnail,
    mentorAvatar: mappedService.mentor.avatar
  });
  
  return mappedService;
}

export async function getExpertServices(page: number = 0, size: number = 20, sortBy: string = 'updatedAt'): Promise<ServicesResult> {
  try {
    const params = { page, size, sortBy };
    const response = await api.get<PaginatedResponse>('/api/v1/service-listing/all', { params });
    
    
    const responseData = response.data as PaginatedResponse;
    
    if (responseData.content && Array.isArray(responseData.content)) {
      console.log(`Found ${responseData.content.length} services in response.content`);
      const services = responseData.content.map(mapToServiceListCard);
      
      return {
        services,
        totalElements: responseData.totalElements,
        totalPages: responseData.totalPages,
        currentPage: responseData.number,
        pageSize: responseData.size
      };
    }
    
    // Fallback for unexpected response format
    console.error("Unexpected API response structure:", responseData);
    return {
      services: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: size
    };
  } catch (error) {
    console.error("Failed to fetch expert services:", error);
    return {
      services: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: size
    };
  }
}
