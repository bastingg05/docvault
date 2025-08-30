// Configuration for different environments
export const config = {
  development: {
    apiUrl: "http://localhost:5000",
    environment: "development"
  },
  production: {
    apiUrl: "https://docvault-1.onrender.com", // Your Render backend URL
    environment: "production"
  }
};

// Get current environment
export const getCurrentConfig = () => {
  const env = import.meta.env.MODE || "development";
  return config[env] || config.development;
};

// Get API URL for current environment
export const getApiUrl = () => {
  // Check for custom API URL first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Use environment-specific config
  return getCurrentConfig().apiUrl;
};
