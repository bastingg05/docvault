import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="home-container">
      {/* Glowing Logo */}
      <div className="logo-container">
        <div className="glowing-logo">
          <div className="logo-stack">
            <div className="logo-top"></div>
            <div className="logo-bottom-left"></div>
            <div className="logo-bottom-right"></div>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="home-title">
        <span className="title-docu">DOCU</span>
        <span className="title-vault">VAULT</span>
      </h1>
      
      {/* Subtitle */}
      <p className="home-subtitle">
        Enterprise Document Management System
      </p>

      {/* Grid Pattern Background */}
      <div className="grid-pattern"></div>
      
      {/* Glowing Dots */}
      <div className="glowing-dot blue-dot"></div>
      <div className="glowing-dot red-dot"></div>

      {/* Feature Section */}
      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Military-Grade Security</h3>
          <p className="feature-description">
            256 encryption with zero-knowledge architecture ensures your documents remain completely private
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📁</div>
          <h3 className="feature-title">AI-Powered Organization</h3>
          <p className="feature-description">
            Intelligent categorization and advanced search capabilities powered by machine learning
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3 className="feature-title">Universal Access</h3>
          <p className="feature-description">
            Access your documents from any device, anywhere in the world with real-time synchronization
          </p>
        </div>
      </div>

      {/* Call-to-Action Buttons */}
      <div className="cta-buttons">
        <Link to="/register" className="btn btn-primary">
          🚀 GET STARTED
        </Link>
        <Link to="/login" className="btn btn-secondary">
          🔑 SIGN IN
        </Link>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-icon">📄</div>
          <div className="stat-number">10M+</div>
          <div className="stat-label">Documents Secured</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">⚡</div>
          <div className="stat-number">99.99%</div>
          <div className="stat-label">Uptime Guarantee</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">🔒</div>
          <div className="stat-number">256-bit</div>
          <div className="stat-label">AES Encryption</div>
        </div>
      </div>
    </div>
  );
};

export default Home; 