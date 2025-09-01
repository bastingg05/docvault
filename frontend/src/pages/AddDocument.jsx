import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api.js';

const AddDocument = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: selectedFile.name }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: droppedFile.name }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!file) {
      setError('Please select a file to upload');
      setLoading(false);
      return;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setLoading(false);
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only image, PDF, and document files are allowed');
      setLoading(false);
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);

      await API.post('/api/documents/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/documents');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-document-container">
      {/* Animated Background */}
      <div className="add-document-bg">
        <div className="add-document-orb orb-1"></div>
        <div className="add-document-orb orb-2"></div>
        <div className="add-document-orb orb-3"></div>
      </div>

      <div className="add-document-content">
        {/* Header */}
        <div className="add-document-header">
          <div className="header-content">
            <h1 className="add-document-title">📤 Add New Document</h1>
            <p className="add-document-subtitle">Upload and organize your documents securely</p>
          </div>
          <Link to="/documents" className="back-to-documents-btn">
            <span className="btn-icon">←</span>
            <span className="btn-text">Back to Documents</span>
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="add-document-card">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="upload-form">
            {/* Title Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📝</span>
                Document Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter document title"
                className="form-input"
                required
              />
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📋</span>
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter document description"
                className="form-textarea"
                rows="4"
              />
            </div>

            {/* File Upload Area */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📁</span>
                Select File
              </label>
              <div 
                className={`file-upload-area ${dragActive ? 'dragover' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                
                {file ? (
                  <div className="file-selected">
                    <div className="file-upload-icon success">✅</div>
                    <div className="file-upload-text">{file.name}</div>
                    <div className="file-upload-hint">
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div className="file-upload-type">
                      Type: {file.type || 'Unknown'}
                    </div>
                  </div>
                ) : (
                  <div className="file-upload-prompt">
                    <div className="file-upload-icon">📁</div>
                    <div className="file-upload-text">Click to select or drag and drop</div>
                    <div className="file-upload-hint">
                      Supports: Images, PDF, Word documents, Text files
                    </div>
                    <div className="file-upload-limit">Maximum file size: 10MB</div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="upload-submit-btn"
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Uploading document...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDocument; 