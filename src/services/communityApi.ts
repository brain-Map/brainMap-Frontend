import axios from 'axios';

// console.log("Port: ", process.env.E_PORT_BACKEND);

// Get the API base URL with fallback
const getApiBaseUrl = () => {
  let baseUrl;
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or fallback to common development port
    baseUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT || '8080'}`;
  } else {
    // Server-side: use environment variable or fallback
    baseUrl = process.env.API_URL || `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT || '8080'}`;
  }
  
  console.log('API Base URL:', baseUrl);
  return baseUrl;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased to 30 seconds for slower responses
});

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Auth token added to request:', `Bearer ${token.substring(0, 20)}...`);
      } else {
        console.warn('⚠️ No auth token found in localStorage or sessionStorage');
      }
    }
    
    // Log the full request for debugging
    if (config.url?.includes('/likes/toggle')) {
      console.log('🔍 Full request config:', {
        url: config.url,
        method: config.method,
        headers: {
          'Content-Type': config.headers['Content-Type'],
          'Authorization': config.headers.Authorization ? `${String(config.headers.Authorization).substring(0, 20)}...` : 'Not set'
        },
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to server. Please check if the backend server is running.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found. Please check the server configuration.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    // Retry logic for timeout and network errors
    if (
      (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') &&
      config &&
      !config._retryCount
    ) {
      config._retryCount = 0;
    }

    if (
      config &&
      config._retryCount < MAX_RETRIES &&
      (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR')
    ) {
      config._retryCount++;
      console.log(`Retrying request... Attempt ${config._retryCount}/${MAX_RETRIES}`);
      await sleep(RETRY_DELAY * config._retryCount); // Progressive delay
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

export interface CreatePostRequest {
  type: "discussion" | "project" | "help";
  title: string;
  content: string;
  // category: string;
  tags: string[]; // Changed from [] to string[]
}

export interface LikeRequest {
  targetId: string;
  targetType: 'post' | 'comment';
  postId?: string; // Optional context for comments
}

export interface LikeResponse {
  liked: boolean;
  likesCount: number;
}

export interface PostResponse {
  communityPostId: string;
  title: string;
  content: string;
  tags: Array<{
    id: string;
    name: string;
    postCount?: number;
  }>;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    role?: "Student" | "Domain Expert";
    verified?: boolean;
  };
  type: "DISCUSSION" | "PROJECT" | "HELP";
  likes?: number;
  replies?: number;
  views?: number;
  isLiked?: boolean;
}

export interface CommentRequest {
  content: string;
  parentCommentId?: string; // For nested replies
}

export interface CommentResponse {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt?: string;
  likes?: number;
  isLiked?: boolean;
  replies?: CommentResponse[];
  parentCommentId?: string;
}

export interface PostFilters {
  type?: "discussion" | "project" | "help";
  category?: string;
  tags?: string[];
  author?: string;
  sortBy?: "latest" | "popular" | "mostReplies" | "mostLiked";
  page?: number;
  limit?: number;
}

export const communityApi = {
  // Test backend connection
  testConnection: async (): Promise<boolean> => {
    try {
      // Use posts endpoint since health endpoint returns 500
      const response = await api.get('/api/v1/posts', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  },

  // Test like endpoint with validation
  testLikeEndpoint: async (targetId: string, targetType: 'post' | 'comment', postId?: string): Promise<any> => {
    try {
      console.log('🧪 Testing like endpoint...');
      console.log('🧪 Target ID format check:', targetId);
      console.log('🧪 Target ID length:', targetId.length);
      console.log('🧪 Target type:', targetType);
      console.log('🧪 Post ID (if comment):', postId);
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(targetId)) {
        throw new Error(`Invalid UUID format for targetId: ${targetId}`);
      }
      
      if (postId && !uuidRegex.test(postId)) {
        throw new Error(`Invalid UUID format for postId: ${postId}`);
      }
      
      const payload: any = {
        targetId: targetId.toLowerCase(), // Ensure lowercase
        targetType: targetType
      };
      
      if (targetType === 'comment' && postId) {
        payload.postId = postId.toLowerCase();
      }
      
      console.log('🧪 Final payload:', JSON.stringify(payload, null, 2));
      
      const response = await api.post('/api/v1/likes/toggle', payload);
      return response.data;
    } catch (error) {
      console.error('🧪 Test failed:', error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData: CreatePostRequest): Promise<PostResponse> => {
    try {
      const response = await api.post('/api/v1/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Get all posts with optional filters
  getPosts: async (filters?: PostFilters): Promise<PostResponse[]> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => params.append(key, item));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }
      
      const response = await api.get(`/api/v1/posts${params.toString() ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get single post by ID
  getPost: async (id: string): Promise<PostResponse> => {
    try {
      console.log(`Fetching post with ID: ${id}`);
      const response = await api.get(`/api/v1/posts/${id}`);
      console.log(`Post fetch successful for ID: ${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching post:', error);
      
      // If timeout, try alternative endpoint or provide helpful error
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. The server might be overloaded. Please try again in a moment.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Post not found. It may have been deleted or moved.');
      }
      
      throw error;
    }
  },

  // Update post
  updatePost: async (id: string, postData: Partial<CreatePostRequest>): Promise<PostResponse> => {
    try {
      const response = await api.put(`/api/v1/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/posts/${id}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Unified Like/Unlike for posts, comments, and replies (matches backend)
  toggleLike: async (targetId: string, targetType: 'post' | 'comment', postId?: string): Promise<LikeResponse> => {
    try {
      // Validate UUID format before sending
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(targetId)) {
        throw new Error(`Invalid UUID format for targetId: ${targetId}`);
      }
      
      if (postId && !uuidRegex.test(postId)) {
        throw new Error(`Invalid UUID format for postId: ${postId}`);
      }
      
      const payload: any = {
        targetId: targetId.toLowerCase(), // Ensure consistent case
        targetType: targetType
      };
      
      // If it's a comment/reply, include the postId for context
      if (targetType === 'comment' && postId) {
        payload.postId = postId.toLowerCase();
      }
      
      console.log('🔍 Sending like request with payload:', JSON.stringify(payload, null, 2));
      console.log('🔍 Request URL:', '/api/v1/likes/toggle');
      console.log('🔍 Request method: POST');
      
      try {
        // Try unified endpoint first
        const response = await api.post('/api/v1/likes/toggle', payload);
        console.log('✅ Like response received:', response.data);
        return response.data;
      } catch (unifiedError: any) {
        // If unified endpoint fails with 401/400, fall back to old endpoints for testing
        if (unifiedError.response?.status === 401 || unifiedError.response?.status === 400) {
          console.warn('🔄 Unified endpoint failed, falling back to legacy endpoints...');
          
          if (targetType === 'post') {
            const fallbackResponse = await api.post(`/api/v1/posts/${targetId}/like`);
            return fallbackResponse.data;
          } else if (targetType === 'comment' && postId) {
            const fallbackResponse = await api.post(`/api/v1/posts/${postId}/comments/${targetId}/like`);
            return fallbackResponse.data;
          }
        }
        throw unifiedError;
      }
      
    } catch (error: any) {
      console.error('❌ Error toggling like:', error);
      
      // Log more details about the error
      if (error.response) {
        console.error('❌ Error response status:', error.response.status);
        console.error('❌ Error response data:', error.response.data);
        console.error('❌ Error response headers:', error.response.headers);
        
        // Check for specific validation errors
        if (error.response.status === 400) {
          const errorData = error.response.data;
          let errorMessage = 'Bad request - please check the data format';
          
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          } else if (errorData?.errors) {
            // Handle validation errors array
            const validationErrors = Array.isArray(errorData.errors) 
              ? errorData.errors.map((e: any) => e.defaultMessage || e.message || e).join(', ')
              : JSON.stringify(errorData.errors);
            errorMessage = `Validation errors: ${validationErrors}`;
          }
          
          throw new Error(`Validation error: ${errorMessage}`);
        }
        
        if (error.response.status === 401) {
          throw new Error('Authentication failed - please login again');
        }
      }
      
      throw error;
    }
  },

  // Get post like status
  getPostLikeStatus: async (postId: string): Promise<LikeResponse> => {
    try {
      const response = await api.get(`/api/v1/likes/post/${postId}/status`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting post like status:', error);
      throw error;
    }
  },

  // Get comment like status
  getCommentLikeStatus: async (commentId: string): Promise<LikeResponse> => {
    try {
      const response = await api.get(`/api/v1/likes/comment/${commentId}/status`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting comment like status:', error);
      throw error;
    }
  },

  // Get comments for a post
  getComments: async (postId: string): Promise<CommentResponse[]> => {
    try {
      const response = await api.get(`/api/v1/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add comment to post
  addComment: async (postId: string, commentData: CommentRequest): Promise<CommentResponse> => {
    try {
      const response = await api.post(`/api/v1/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Update comment
  updateComment: async (postId: string, commentId: string, content: string): Promise<CommentResponse> => {
    try {
      const response = await api.put(`/api/v1/posts/${postId}/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/posts/${postId}/comments/${commentId}`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Get popular tags
  getPopularTags: async (): Promise<string[]> => {
    try {
      const response = await api.get('/api/v1/tags/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      throw error;
    }
  },

  // Search posts
  searchPosts: async (query: string, filters?: PostFilters): Promise<PostResponse[]> => {
    try {
      const params = new URLSearchParams({ q: query });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => params.append(key, item));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }
      
      const response = await api.get(`/api/v1/posts/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  // Get user's posts
  getUserPosts: async (userId?: string): Promise<PostResponse[]> => {
    try {
      const endpoint = userId ? `/api/v1/users/${userId}/posts` : '/api/v1/posts/my-posts';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  // Report post
  reportPost: async (postId: string, reason: string): Promise<void> => {
    try {
      await api.post(`/api/v1/posts/${postId}/report`, { reason });
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  },

  // Follow/Unfollow post (for notifications)
  toggleFollowPost: async (postId: string): Promise<{ following: boolean }> => {
    try {
      const response = await api.post(`/api/v1/posts/${postId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Error toggling post follow:', error);
      throw error;
    }
  },

};

export default api;