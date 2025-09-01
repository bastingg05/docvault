import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">📄</span>
          <span className="navbar-title">DocuVault V2</span>
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/" className="navbar-link">
                🏠 Home
              </Link>
              <Link to="/documents" className="navbar-link">
                📁 Documents
              </Link>
              <Link to="/add-document" className="navbar-link">
                ➕ Add Document
              </Link>
              <div className="navbar-user">
                <span className="navbar-username">👤 {user.name}</span>
                <button onClick={onLogout} className="navbar-logout">
                  🚪 Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="navbar-link">
                🏠 Home
              </Link>
              <Link to="/login" className="navbar-link">
                🔑 Login
              </Link>
              <Link to="/register" className="navbar-link">
                📝 Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
