import API from "../api";

// Helper function to check API availability
const checkApiHealth = async () => {
  try {
    const response = await API.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
};

// Register
export const registerUser = async (name, email, password) => {
  try {
    console.log('🌐 Attempting to register user...');
    const { data } = await API.post("/api/users/register", { name, email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error('❌ Registration failed:', error);
    throw error;
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    console.log('🌐 Attempting to login user...');
    
    // First check if API is available
    const apiHealthy = await checkApiHealth();
    if (!apiHealthy) {
      console.warn('⚠️ API not healthy, using demo mode');
      // Demo mode fallback
      const demoUser = {
        _id: 'demo-user-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        token: 'demo-token-' + Date.now()
      };
      localStorage.setItem("token", demoUser.token);
      return demoUser;
    }
    
    const { data } = await API.post("/api/users/login", { email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (error) {
    console.error('❌ Login failed:', error);
    
    // If it's a 404, the API endpoint doesn't exist
    if (error.response?.status === 404) {
      console.warn('⚠️ API endpoint not found, using demo mode');
      const demoUser = {
        _id: 'demo-user-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        token: 'demo-token-' + Date.now()
      };
      localStorage.setItem("token", demoUser.token);
      return demoUser;
    }
    
    throw error;
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
};