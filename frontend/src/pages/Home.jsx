import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Main Content */}
      <div className="hero-section">
        <div className="hero-content">
          {/* Logo */}
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 100 100" className="logo-svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <rect x="20" y="20" width="60" height="60" rx="8" fill="url(#logoGradient)" />
                <rect x="30" y="30" width="40" height="40" rx="4" fill="rgba(255,255,255,0.1)" />
                <rect x="35" y="35" width="30" height="30" rx="2" fill="rgba(255,255,255,0.2)" />
              </svg>
            </div>
            <h1 className="brand-name">DocuVault</h1>
          </div>

          {/* Short Headings */}
          <h2 className="hero-title">Secure Documents</h2>
          <h3 className="hero-subtitle">Enterprise Management</h3>

          {/* Simple Actions */}
          <div className="hero-actions">
            <Link to="/register" className="cta-primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 