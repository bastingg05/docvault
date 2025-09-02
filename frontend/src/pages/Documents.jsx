import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { getApiUrl } from '../config.js';

const Documents = ({ user }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/documents', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDocuments(documents.filter(doc => doc._id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('text')) return '📄';
    return '📁';
  };

  if (loading) {
    return (
      <div className="documents-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-container">
      {/* Animated Background */}
      <div className="documents-bg">
        <div className="documents-orb orb-1"></div>
        <div className="documents-orb orb-2"></div>
        <div className="documents-orb orb-3"></div>
      </div>

      <div className="documents-content">
        <div className="documents-header">
          <div className="header-content">
            <h1 className="documents-title">📁 My Documents</h1>
            <p className="documents-subtitle">Manage and organize your secure documents</p>
          </div>
          <Link to="/add-document" className="add-document-btn">
            <span className="btn-icon">➕</span>
            <span className="btn-text">Add Document</span>
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h2 className="empty-title">No documents yet</h2>
            <p className="empty-description">
              Start by uploading your first document to get organized and secure.
            </p>
            <Link to="/add-document" className="empty-cta">
              <span className="cta-icon">🚀</span>
              <span className="cta-text">Upload Your First Document</span>
            </Link>
          </div>
        ) : (
          <div className="documents-grid">
            {documents.map((document, index) => (
              <div 
                key={document._id} 
                className="document-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <div className="file-icon">{getFileIcon(document.fileType)}</div>
                  <h3 className="document-title">{document.title}</h3>
                </div>
                
                {document.description && (
                  <p className="document-description">{document.description}</p>
                )}
                
                <div className="document-meta">
                  <div className="meta-item">
                    <span className="meta-label">Size:</span>
                    <span className="meta-value">{formatFileSize(document.fileSize)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Uploaded:</span>
                    <span className="meta-value">{formatDate(document.createdAt)}</span>
                  </div>
                </div>
                
                <div className="document-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => window.open(getApiUrl(`/uploads/${document.fileName}`), '_blank')}
                  >
                    <span className="btn-icon">👁️</span>
                    <span className="btn-text">View</span>
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(document._id)}
                  >
                    <span className="btn-icon">🗑️</span>
                    <span className="btn-text">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents; 