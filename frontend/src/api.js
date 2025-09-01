import axios from 'axios';
import { getApiUrl } from './config.js';
import { NETWORK_CONFIG } from './config/networkConfig.js';

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: getApiUrl(), // Use environment-based configuration
  timeout: NETWORK_CONFIG.TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json',
  },
  // Retry configuration
  retry: NETWORK_CONFIG.RETRY.MAX_ATTEMPTS,
  retryDelay: NETWORK_CONFIG.RETRY.BASE_DELAY,
});

// Enhanced request interceptor with retry logic
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.Authorization) {
      // Only set Authorization if not already set (to avoid overriding custom headers)
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add retry attempt counter
    config.retryAttempt = config.retryAttempt || 0;
    
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`📍 Full URL: ${config.baseURL}${config.url}`);
    console.log(`🔧 Config:`, config);
    console.log(`🌍 Origin: ${window.location.origin}`);
    console.log(`🔗 Target: ${config.baseURL}`);
    console.log(`🔑 Headers:`, config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const { config, response, message } = error;
    
    // Log the error with more details
    console.error(`❌ API Error: ${response?.status || 'Network'} - ${message}`);
    console.error('Full error object:', error);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network Error - Check if backend is running on http://localhost:5000');
    }
    
    if (error.code === 'ERR_CORS') {
      console.error('🚫 CORS Error - Check CORS configuration');
    }
    
    // Handle authentication errors
    if (response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Implement retry logic for network errors
    if (shouldRetry(error) && config.retryAttempt < NETWORK_CONFIG.RETRY.MAX_ATTEMPTS) {
      config.retryAttempt += 1;
      const delay = calculateRetryDelay(config.retryAttempt);
      
      console.log(`🔄 Retrying request (${config.retryAttempt}/${NETWORK_CONFIG.RETRY.MAX_ATTEMPTS}) in ${delay}ms...`);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(api.request(config));
        }, delay);
      });
    }
    
    // If all retries failed, enhance error message
    const enhancedError = enhanceErrorMessage(error);
    return Promise.reject(enhancedError);
  }
);

// Determine if request should be retried
function shouldRetry(error) {
  // Retry on network errors, timeouts, and 5xx server errors
  return (
    !error.response || // Network error
    error.code === 'ECONNABORTED' || // Timeout
    (error.response && error.response.status >= 500) || // Server error
    error.message.includes('Network Error') ||
    error.message.includes('timeout')
  );
}

// Calculate retry delay with exponential backoff
function calculateRetryDelay(attempt) {
  const delay = NETWORK_CONFIG.TIMEOUTS.BASE_DELAY * Math.pow(NETWORK_CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1);
  return Math.min(delay, NETWORK_CONFIG.RETRY.MAX_DELAY);
}

// Enhance error messages for better user experience
function enhanceErrorMessage(error) {
  let userMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        userMessage = 'Invalid request. Please check your input.';
        break;
      case 401:
        userMessage = 'Authentication failed. Please log in again.';
        break;
      case 403:
        userMessage = 'Access denied. You don\'t have permission for this action.';
        break;
      case 404:
        userMessage = 'The requested resource was not found.';
        break;
      case 429:
        userMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        userMessage = 'Server error. Please try again later.';
        break;
      case 502:
      case 503:
      case 504:
        userMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        userMessage = `Server error (${error.response.status}). Please try again.`;
    }
  } else if (error.code === 'ECONNABORTED') {
    userMessage = 'Request timed out. Please check your connection and try again.';
  } else if (error.message.includes('Network Error')) {
    userMessage = 'Network error. Please check your internet connection and try again.';
  } else if (error.message.includes('timeout')) {
    userMessage = 'Request timed out. Please try again.';
  }
  
  // Add enhanced error properties
  error.userMessage = userMessage;
  error.isNetworkError = !error.response;
  error.isTimeoutError = error.code === 'ECONNABORTED';
  error.retryable = shouldRetry(error);
  
  return error;
}

// Health check method
api.healthCheck = async () => {
  try {
    const response = await api.get('/health', { timeout: NETWORK_CONFIG.TIMEOUTS.HEALTH_CHECK });
    return { status: 'healthy', data: response.data };
  } catch (error) {
    return { status: 'unhealthy', error: error.userMessage || error.message };
  }
};

// Test connection method
api.testConnection = async () => {
  try {
    const startTime = Date.now();
    const response = await api.get('/health', { timeout: NETWORK_CONFIG.TIMEOUTS.CONNECTION_TEST });
    const responseTime = Date.now() - startTime;
    
    return {
      connected: true,
      responseTime,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      connected: false,
      error: error.userMessage || error.message,
      retryable: error.retryable
    };
  }
};

export default api;
