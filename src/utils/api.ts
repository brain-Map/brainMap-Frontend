import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL, // your Spring Boot API base URL
// });

const api = axios.create({
  baseURL: `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token for every request
api.interceptors.request.use(
  (config) => {
    console.log('🔍 [API INTERCEPTOR] Request to:', config.url);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [API INTERCEPTOR] Token attached:', token.substring(0, 30) + '...');
    } else {
      console.warn('⚠️ [API INTERCEPTOR] No token found - request will be unauthorized');
      console.log('📍 [API INTERCEPTOR] Checked locations:');
      console.log('   localStorage.accessToken:', localStorage.getItem('accessToken') ? 'exists' : 'null');
      console.log('   sessionStorage.accessToken:', sessionStorage.getItem('accessToken') ? 'exists' : 'null');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [API INTERCEPTOR] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API INTERCEPTOR] Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ [API INTERCEPTOR] Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.error('🚫 [API INTERCEPTOR] 401 UNAUTHORIZED - Token may be invalid or expired');
      console.log('🔑 [API INTERCEPTOR] Current token:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');
    }
    
    return Promise.reject(error);
  }
);

export default api;
