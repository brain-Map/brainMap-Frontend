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
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
  (error) => {
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
      const response = await api.get(`/api/v1/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
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

  // Like/Unlike post
  toggleLike: async (id: string): Promise<{ liked: boolean; likesCount: number }> => {
    try {
      const response = await api.post(`/api/v1/posts/${id}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
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

  // Like/Unlike comment
  toggleCommentLike: async (postId: string, commentId: string): Promise<{ liked: boolean; likesCount: number }> => {
    try {
      const response = await api.post(`/api/v1/posts/${postId}/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling comment like:', error);
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