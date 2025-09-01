import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <defs>
                <linearGradient id="navbarLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="25%" stopColor="#0099cc" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="75%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="url(#navbarLogoGradient)"/>
              <circle cx="12" cy="16" r="1" fill="url(#navbarLogoGradient)"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="url(#navbarLogoGradient)"/>
            </svg>
          </div>
          <span className="navbar-brand-text">DocuVault</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/" className="navbar-link">
                <span className="navbar-icon">🏠</span>
                <span className="navbar-text">Home</span>
              </Link>
              <Link to="/documents" className="navbar-link">
                <span className="navbar-icon">📄</span>
                <span className="navbar-text">Documents</span>
              </Link>
              <Link to="/add-document" className="navbar-link">
                <span className="navbar-icon">➕</span>
                <span className="navbar-text">Add Document</span>
              </Link>
              <div className="navbar-user">
                <span className="navbar-username">
                  <span className="navbar-icon">👤</span>
                  <span className="navbar-text">{user.name}</span>
                </span>
                <button onClick={handleLogout} className="navbar-logout">
                  <span className="navbar-icon">🚪</span>
                  <span className="navbar-text">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="navbar-link">
                <span className="navbar-icon">🏠</span>
                <span className="navbar-text">Home</span>
                </Link>
              <Link to="/login" className="navbar-link">
                <span className="navbar-icon">🔐</span>
                <span className="navbar-text">Login</span>
              </Link>
              <Link to="/register" className="navbar-link">
                <span className="navbar-icon">📝</span>
                <span className="navbar-text">Register</span>
              </Link>
            </>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
