import React, { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your DocuVault account</p>
        
        {error && <p className="auth-error">{error}</p>}
        
        <div className="auth-input-group">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="auth-input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;

