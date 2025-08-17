import React, { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      console.log("Logged in:", user);
      // Dispatch custom event to update login state
      window.dispatchEvent(new Event('loginStateChanged'));
      // Redirect to documents page after successful login
      navigate("/documents");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Invalid credentials");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      padding: "20px"
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%",
        maxWidth: "400px",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          margin: "0 0 20px 0",
          color: "#333",
          fontSize: "24px"
        }}>Login</h2>
        
        {error && <p style={{ 
          color: "red", 
          textAlign: "center", 
          margin: "0",
          fontSize: "14px"
        }}>{error}</p>}
        
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
            required
          />
        </div>
        
        <button type="submit" style={{
          padding: "12px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>Login</button>
      </form>
    </div>
  );
}

export default Login;

