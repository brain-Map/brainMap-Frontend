import { ServiceListCard } from "@/types/serviceListCard";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/domain-experts/service-listings`;

export interface BackendServiceData {
  title: string;
  subject: string;
  description: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
  mentorId: string;
  avatar: string;
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

function mapToServiceListCard(data: BackendServiceData): ServiceListCard {
  // Ensure serviceId exists to prevent errors
  const serviceId = data.serviceId || `random-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: parseInt(serviceId.slice(0, 8), 16) || Math.floor(Math.random() * 1000), // Convert part of UUID to number or use random
    title: data.title || "Untitled Service",
    subject: data.subject || "General",
    description: data.description || "No description provided",
    fee: typeof data.fee === 'number' ? data.fee : 0,
    thumbnail: data.avatar || "",
    rating: typeof data.mentorRating === 'number' ? data.mentorRating : 0,
    reviews: typeof data.reviews === 'number' ? data.reviews : 0,
    createdAt: data.createdAt || new Date().toISOString(),
    mentor: {
      name: data.mentorName || "Unknown Expert",
      role: "Domain Expert", // Default role
      avatar: data.avatar || "",
      date: data.createdAt || new Date().toISOString(),
    },
  };
}

export interface ServicesResult {
  services: ServiceListCard[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export async function getExpertServices(page: number = 0, size: number = 20, sortBy: string = 'title'): Promise<ServicesResult> {
  try {
    const url = new URL(BACKEND_URL);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('size', size.toString());
    url.searchParams.append('sortBy', sortBy);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Error fetching services: ${response.statusText}`);
    }
    
    const responseData = await response.json() as PaginatedResponse;
    
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
