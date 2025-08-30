import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const Home = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome to DocuVault</h1>
        <p>Secure document management and storage</p>
        
        <div className="auth-buttons">
          <Link to="/login" className="auth-button login-btn">
            Sign In
          </Link>
          <Link to="/register" className="auth-button register-btn">
            Sign Up
          </Link>
        </div>
        
        <div className="auth-features">
          <h3>Features:</h3>
          <ul>
            <li>🔐 Secure authentication</li>
            <li>📁 Document upload and management</li>
            <li>🔍 Easy document search</li>
            <li>📱 Responsive design</li>
            <li>⚡ Fast and reliable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home; 