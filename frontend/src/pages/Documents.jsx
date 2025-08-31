import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.get('/api/documents', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDocuments(response.data);
    } catch (error) {
      setError('Failed to load documents');
      console.error('Error fetching documents:', error);
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
      await axios.delete(`/api/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDocuments(documents.filter(doc => doc._id !== documentId));
    } catch (error) {
      setError('Failed to delete document');
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
          <div className="loading"></div>
          <p>Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h1 className="documents-title">My Documents</h1>
        <Link to="/add-document" className="btn btn-primary">
          ➕ Add Document
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {documents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📁</div>
          <h2 style={{ marginBottom: '16px', color: '#333' }}>No documents yet</h2>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            Start by uploading your first document to get organized.
          </p>
          <Link to="/add-document" className="btn btn-primary">
            Upload Your First Document
          </Link>
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((document) => (
            <div key={document._id} className="document-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>
                  {getFileIcon(document.fileType)}
                </span>
                <h3 className="document-title">{document.title}</h3>
              </div>
              
              {document.description && (
                <p className="document-description">{document.description}</p>
              )}
              
              <div className="document-meta">
                <span>{formatFileSize(document.fileSize)}</span>
                <span>{formatDate(document.createdAt)}</span>
              </div>
              
              <div className="document-actions">
                <button 
                  className="btn btn-secondary"
                  style={{ fontSize: '14px', padding: '8px 16px' }}
                  onClick={() => window.open(`/uploads/${document.fileName}`, '_blank')}
                >
                  👁️ View
                </button>
                <button 
                  className="btn"
                  style={{ 
                    fontSize: '14px', 
                    padding: '8px 16px',
                    background: '#ff4757',
                    color: 'white'
                  }}
                  onClick={() => handleDelete(document._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents; 