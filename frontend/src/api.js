import axios from "axios";

// Use environment variable for API URL, fallback to working backend for production
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://docvault-1.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
