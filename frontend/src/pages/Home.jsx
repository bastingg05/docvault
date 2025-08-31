import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to DocuVault V2</h1>
      <p className="home-subtitle">
        Your secure and modern document management system. Store, organize, and access your documents from anywhere.
      </p>
      
      {user ? (
        <div style={{ marginTop: '40px' }}>
          <Link to="/documents" className="btn btn-primary" style={{ marginRight: '20px' }}>
            📁 View Documents
          </Link>
          <Link to="/add-document" className="btn btn-secondary">
            ➕ Add New Document
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '40px' }}>
          <Link to="/login" className="btn btn-primary" style={{ marginRight: '20px' }}>
            🔑 Get Started
          </Link>
          <Link to="/register" className="btn btn-secondary">
            📝 Create Account
          </Link>
        </div>
      )}

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Secure Storage</h3>
          <p className="feature-description">
            Your documents are encrypted and stored securely in the cloud with enterprise-grade security.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Lightning Fast</h3>
          <p className="feature-description">
            Upload and access your documents instantly with our optimized cloud infrastructure.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h3 className="feature-title">Access Anywhere</h3>
          <p className="feature-description">
            Access your documents from any device, anywhere in the world with our responsive web app.
          </p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Smart Organization</h3>
          <p className="feature-description">
            Automatically organize and categorize your documents for easy searching and management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 