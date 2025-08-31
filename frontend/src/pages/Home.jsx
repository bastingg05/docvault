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
      
      {/* Action Buttons */}
      {user ? (
        <div className="action-buttons">
          <Link to="/documents" className="btn btn-primary">
            📁 View Documents
          </Link>
          <Link to="/add-document" className="btn btn-secondary">
            ➕ Add New Document
          </Link>
        </div>
      ) : (
        <div className="action-buttons">
          <Link to="/login" className="btn btn-primary">
            🔑 Get Started
          </Link>
          <Link to="/register" className="btn btn-secondary">
            📝 Create Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home; 