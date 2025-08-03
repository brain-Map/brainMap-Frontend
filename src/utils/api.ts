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
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
