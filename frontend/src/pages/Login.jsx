import React, { useState, useEffect } from "react";
import { loginUser } from "../services/userService";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("bastin2005@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  // Check connection status on component mount
  useEffect(() => {
    checkConnection();
    
    // Set up periodic connection checks
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Check backend connection
  const checkConnection = async () => {
    try {
      setConnectionStatus("checking");
      const result = await api.testConnection();
      
      if (result.connected) {
        setConnectionStatus("connected");
        setError(""); // Clear any previous errors
      } else {
        setConnectionStatus("disconnected");
        if (retryCount === 0) {
          setError("Unable to connect to server. Please check your internet connection.");
        }
      }
    } catch (error) {
      setConnectionStatus("error");
      console.error("Connection check failed:", error);
    }
  };

  // Handle form submission with enhanced error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check connection before attempting login
    if (connectionStatus !== "connected") {
      setError("No connection to server. Please check your internet connection and try again.");
      await checkConnection();
      return;
    }
    
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
        setConnectionStatus("disconnected");
      } else if (err.isTimeoutError) {
        setError("Request timed out. Please try again.");
      } else if (err.userMessage) {
        setError(err.userMessage);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
      
      // Increment retry count for network errors
      if (err.isNetworkError || err.isTimeoutError) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Retry connection manually
  const handleRetryConnection = async () => {
    setRetryCount(0);
    await checkConnection();
  };

  // Get connection status display
  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case "connected":
        return { text: "🟢 Connected", className: "status-connected" };
      case "disconnected":
        return { text: "🔴 Disconnected", className: "status-disconnected" };
      case "checking":
        return { text: "🟡 Checking...", className: "status-checking" };
      case "error":
        return { text: "⚠️ Error", className: "status-error" };
      default:
        return { text: "❓ Unknown", className: "status-unknown" };
    }
  };

  const connectionDisplay = getConnectionStatusDisplay();

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
        
        {/* Connection Status */}
        <div className={`connection-status ${connectionDisplay.className}`}>
          <span className="status-text">{connectionDisplay.text}</span>
          {connectionStatus === "disconnected" && (
            <button 
              type="button" 
              onClick={handleRetryConnection}
              className="retry-connection-btn"
            >
              🔄 Retry
            </button>
          )}
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            {retryCount > 0 && (
              <span className="retry-count">(Attempt {retryCount})</span>
            )}
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
            disabled={isLoading || connectionStatus !== "connected"}
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
            disabled={isLoading || connectionStatus !== "connected"}
          />
        </div>
        
        <button 
          type="submit" 
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || connectionStatus !== "connected"}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
        
        {/* Network Troubleshooting Tips */}
        {connectionStatus === "disconnected" && (
          <div className="network-tips">
            <h4>🌐 Network Troubleshooting</h4>
            <ul>
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Check if the server is running</li>
              <li>Try again in a few moments</li>
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;

