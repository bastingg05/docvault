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
          {/* Super Logo */}
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 120 120" className="logo-svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="25%" stopColor="#0099cc" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="75%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                  <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Outer Glow Ring */}
                <circle cx="60" cy="60" r="58" fill="none" stroke="url(#logoGradient)" strokeWidth="4" opacity="0.6" filter="url(#glow)"/>
                
                {/* Main Logo Shape */}
                <rect x="25" y="25" width="70" height="70" rx="12" fill="url(#logoGradient)" filter="url(#glow)"/>
                
                {/* Inner Design Elements */}
                <rect x="35" y="35" width="50" height="50" rx="8" fill="url(#innerGradient)"/>
                <rect x="42" y="42" width="36" height="36" rx="6" fill="rgba(255,255,255,0.15)"/>
                
                {/* Document Lines */}
                <rect x="48" y="48" width="24" height="2" rx="1" fill="rgba(255,255,255,0.8)"/>
                <rect x="48" y="54" width="20" height="2" rx="1" fill="rgba(255,255,255,0.6)"/>
                <rect x="48" y="60" width="22" height="2" rx="1" fill="rgba(255,255,255,0.7)"/>
                <rect x="48" y="66" width="18" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
                
                {/* Corner Accents */}
                <circle cx="32" cy="32" r="3" fill="rgba(255,255,255,0.9)"/>
                <circle cx="88" cy="32" r="3" fill="rgba(255,255,255,0.9)"/>
                <circle cx="32" cy="88" r="3" fill="rgba(255,255,255,0.9)"/>
                <circle cx="88" cy="88" r="3" fill="rgba(255,255,255,0.9)"/>
              </svg>
            </div>
            <h1 className="brand-name">DocuVault</h1>
            <div className="brand-tagline">Enterprise Security</div>
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