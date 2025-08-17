import React, { useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Register() {
  const [name, setName] = useState("");
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
      const user = await registerUser(name, email, password);
      console.log("Registered:", user);
      // Dispatch custom event to update login state
      window.dispatchEvent(new Event('loginStateChanged'));
      // Redirect to documents page after successful registration
      navigate("/documents");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || err.message || "Registration failed");
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
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join DocuVault and start managing your documents</p>
        
        {error && <p className="auth-error">{error}</p>}
        
        <div className="auth-input-group">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
            required
            disabled={isLoading}
          />
        </div>
        
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
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
