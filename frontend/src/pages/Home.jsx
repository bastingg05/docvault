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

      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose DocuVault?</h2>
          <p className="section-subtitle">Enterprise-grade security meets cutting-edge technology</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="feature-title">Military-Grade Security</h3>
            <p className="feature-description">
              AES-256 encryption with zero-knowledge architecture ensures your documents remain completely private.
            </p>
            <div className="feature-stats">
              <span className="stat-badge">256-bit</span>
              <span className="stat-badge">Zero-Knowledge</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h3 className="feature-title">AI-Powered Organization</h3>
            <p className="feature-description">
              Advanced AI automatically categorizes, tags, and indexes your documents for instant retrieval.
            </p>
            <div className="feature-stats">
              <span className="stat-badge">99.8% Accuracy</span>
              <span className="stat-badge">10x Faster</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 className="feature-title">Universal Access</h3>
            <p className="feature-description">
              Access your documents from any device, anywhere with real-time synchronization and offline capabilities.
            </p>
            <div className="feature-stats">
              <span className="stat-badge">24/7 Access</span>
              <span className="stat-badge">Global CDN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="specialties-section">
        <div className="section-header">
          <h2 className="section-title">Our Specialties</h2>
          <p className="section-subtitle">Built for enterprise scale and security</p>
        </div>
        
        <div className="specialties-grid">
          <div className="specialty-item">
            <div className="specialty-number">01</div>
            <h3 className="specialty-title">Document Management</h3>
            <p className="specialty-description">
              Streamlined workflow for creating, editing, and organizing documents with version control.
            </p>
          </div>
          
          <div className="specialty-item">
            <div className="specialty-number">02</div>
            <h3 className="specialty-title">Advanced Search</h3>
            <p className="specialty-description">
              Powerful search capabilities with filters, tags, and AI-powered content recognition.
            </p>
          </div>
          
          <div className="specialty-item">
            <div className="specialty-number">03</div>
            <h3 className="specialty-title">Team Collaboration</h3>
            <p className="specialty-description">
              Real-time collaboration tools with role-based access control and audit trails.
            </p>
          </div>
          
          <div className="specialty-item">
            <div className="specialty-number">04</div>
            <h3 className="specialty-title">Compliance Ready</h3>
            <p className="specialty-description">
              Built-in compliance features for GDPR, SOC 2, HIPAA, and other regulatory requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 