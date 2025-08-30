import React, { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("bastin2005@gmail.com");
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
      console.log("✅ Logged in successfully:", user);
      
      // Store token in localStorage
      if (user.token) {
        localStorage.setItem("token", user.token);
      }
      
      // Dispatch custom event to update login state
      window.dispatchEvent(new Event('loginStateChanged'));
      
      // Wait a moment for state to update, then redirect to documents
      setTimeout(() => {
        navigate("/documents");
      }, 100);
      
    } catch (err) {
      console.error("❌ Login error:", err);
      
      // Handle different types of errors
      if (err.isNetworkError) {
        setError("Network error. Please check your internet connection and try again.");
      } else if (err.isTimeoutError) {
        setError("Request timed out. Please try again.");
      } else if (err.userMessage) {
        setError(err.userMessage);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-back-home">
        <Link to="/" className="auth-home-link">
          ← Back to Home
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your DocuVault account</p>
        
        {/* Error Display */}
        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}
        
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

