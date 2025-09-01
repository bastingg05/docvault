import API from "../api";



// Register
export const registerUser = async (name, email, password) => {
  try {
    console.log('🌐 Attempting to register user...');
    const { data } = await API.post("/api/users/register", { name, email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    // Return the user object directly for the onLogin callback
    return { user: data, token: data.token };
  } catch (error) {
    console.error('❌ Registration failed:', error);
    throw error;
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    console.log('🌐 Attempting to login user...');
    
    const { data } = await API.post("/api/users/login", { email, password });
    console.log('📥 Login response:', data);
    
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    
    // Handle different response formats from backend
    if (data.user) {
      // Backend returns {message, user, token}
      return { user: data.user, token: data.token };
    } else {
      // Backend returns {_id, name, email, token}
      return { user: data, token: data.token };
    }
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
};