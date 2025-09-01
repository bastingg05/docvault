import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="home-container">
      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div className="floating-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          {/* Modern Logo */}
          <div className="modern-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 100 100" className="logo-svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="50%" stopColor="#0099cc" />
                    <stop offset="100%" stopColor="#0066aa" />
                  </linearGradient>
                </defs>
                <rect x="20" y="20" width="60" height="60" rx="8" fill="url(#logoGradient)" />
                <rect x="30" y="30" width="40" height="40" rx="4" fill="rgba(255,255,255,0.1)" />
                <rect x="35" y="35" width="30" height="30" rx="2" fill="rgba(255,255,255,0.2)" />
              </svg>
            </div>
            <div className="logo-text">
              <span className="brand-name">DocuVault</span>
              <span className="brand-tagline">Enterprise</span>
            </div>
          </div>

          {/* Main Title with Enhanced Typography */}
          <h1 className="hero-title">
            <span className="title-line-1">Secure Document</span>
            <span className="title-line-2">
              <span className="highlight-text">Management</span>
              <span className="accent-dot">.</span>
            </span>
            <span className="title-line-3">Reimagined</span>
          </h1>
          
          {/* Enhanced Subtitle */}
          <p className="hero-subtitle">
            Enterprise-grade document security with AI-powered organization, 
            <br />
            <span className="subtitle-highlight">military-grade encryption</span>, and seamless collaboration tools.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="hero-actions">
            <Link to="/register" className="cta-primary">
              <span className="btn-text">Start Free Trial</span>
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/login" className="cta-secondary">
              <span className="btn-text">Sign In</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span className="trust-text">SOC 2 Compliant</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span className="trust-text">GDPR Ready</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span className="trust-text">99.99% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Feature Section */}
      <div className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose DocuVault?</h2>
          <p className="section-subtitle">Built for enterprise security and scale</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card feature-card-1">
            <div className="feature-header">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="feature-badge">Enterprise</div>
            </div>
            <h3 className="feature-title">Military-Grade Security</h3>
            <p className="feature-description">
              AES-256 encryption with zero-knowledge architecture ensures your documents remain completely private and secure.
            </p>
            <div className="feature-stats">
              <div className="stat">
                <span className="stat-value">256-bit</span>
                <span className="stat-label">Encryption</span>
              </div>
              <div className="stat">
                <span className="stat-value">Zero</span>
                <span className="stat-label">Knowledge</span>
              </div>
            </div>
          </div>
          
          <div className="feature-card feature-card-2">
            <div className="feature-header">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="feature-badge">AI-Powered</div>
            </div>
            <h3 className="feature-title">Intelligent Organization</h3>
            <p className="feature-description">
              Advanced AI automatically categorizes, tags, and indexes your documents for instant retrieval and smart search.
            </p>
            <div className="feature-stats">
              <div className="stat">
                <span className="stat-value">99.8%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="stat">
                <span className="stat-value">10x</span>
                <span className="stat-label">Faster Search</span>
              </div>
            </div>
          </div>
          
          <div className="feature-card feature-card-3">
            <div className="feature-header">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div className="feature-badge">Global</div>
            </div>
            <h3 className="feature-title">Universal Access</h3>
            <p className="feature-description">
              Access your documents from any device, anywhere in the world with real-time synchronization and offline capabilities.
            </p>
            <div className="feature-stats">
              <div className="stat">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Access</span>
              </div>
              <div className="stat">
                <span className="stat-value">Global</span>
                <span className="stat-label">CDN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">10M+</div>
              <div className="stat-label">Documents Secured</div>
              <div className="stat-trend">+25% this month</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">99.99%</div>
              <div className="stat-label">Uptime SLA</div>
              <div className="stat-trend">Last 12 months</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">256-bit</div>
              <div className="stat-label">AES Encryption</div>
              <div className="stat-trend">Bank-grade security</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Enterprise Users</div>
              <div className="stat-trend">Growing daily</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Secure Your Documents?</h2>
          <p className="cta-subtitle">Join thousands of enterprises who trust DocuVault for their document security needs.</p>
          <div className="cta-actions">
            <Link to="/register" className="cta-button-primary">
              <span>Start Free Trial</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/login" className="cta-button-secondary">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 