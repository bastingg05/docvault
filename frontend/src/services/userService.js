import API from "../api";

// Register
export const registerUser = async (name, email, password) => {
  const { data } = await API.post("/users/register", { name, email, password });
  if (data.token) {
    localStorage.setItem("token", data.token); // Save JWT
  }
  return data;
};

// Login
export const loginUser = async (email, password) => {
  const { data } = await API.post("/users/login", { email, password });
  if (data.token) {
    localStorage.setItem("token", data.token); // Save JWT
  }
  return data;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
};
