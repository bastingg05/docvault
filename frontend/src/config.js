// Environment-based configuration
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

export const config = {
  // Backend URL - automatically switches based on environment
  API_BASE_URL: isDevelopment 
    ? 'http://localhost:5000'  // Local development
    : 'https://docuvault-backend.onrender.com', // Production - Render backend
  
  // Environment info
  ENV: import.meta.env.MODE || 'development',
  IS_DEV: isDevelopment,
  
  // App settings
  APP_NAME: 'DocuVault',
  VERSION: '1.0.0',
  
  // Feature flags
  FEATURES: {
    OFFLINE_MODE: true,
    AUTO_RETRY: true,
    HEALTH_MONITORING: true,
    CACHING: true
  }
};

// Helper function to get API URL
export const getApiUrl = (endpoint = '') => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function to check if running locally
export const isLocalhost = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

export default config;
