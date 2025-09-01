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
      // Debug logging
      console.log('🔍 Starting upload process...');
      console.log('📁 File:', file);
      console.log('📝 Form data:', formData);
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token value:', token ? token.substring(0, 20) + '...' : 'No token');
      
      if (!token) {
        setError('You are not logged in. Please log in again.');
        setLoading(false);
        return;
      }

      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);

      console.log('📤 Uploading to:', '/api/documents/upload');
      console.log('📤 FormData entries:');
      for (let [key, value] of uploadData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await API.post('/api/documents/upload', uploadData, {
        headers: {
          // Don't set Content-Type for multipart/form-data - let browser set it with boundary
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Upload successful:', response.data);
      navigate('/documents');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      
      let errorMessage = 'Failed to upload document';
      
      if (error.response) {
        // Server responded with error
        console.log('📡 Server responded with error status:', error.response.status);
        console.log('📡 Server error data:', error.response.data);
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        console.log('📡 No response received from server');
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        console.log('📡 Request setup error:', error.message);
        errorMessage = error.message || 'Request setup failed';
      }
      
      setError(errorMessage);
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
        <div className="add-document-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px', 
          padding: '40px', 
          background: 'rgba(30, 41, 59, 0.95)', 
          borderRadius: '24px', 
          border: '2px solid rgba(6, 182, 212, 0.6)', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          zIndex: 15
        }}>
          <div className="header-content">
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: '800', 
              color: '#ffffff', 
              marginBottom: '16px', 
              letterSpacing: '-1px',
              textShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
              margin: 0,
              padding: 0
            }}>📤 Add New Document</h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#ffffff', 
              fontWeight: '600', 
              lineHeight: '1.6',
              margin: 0,
              padding: 0
            }}>Upload and organize your documents securely</p>
          </div>
          <Link to="/documents" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '14px 24px', 
            background: 'rgba(139, 92, 246, 0.3)', 
            color: '#ffffff', 
            textDecoration: 'none', 
            border: '2px solid rgba(139, 92, 246, 0.6)', 
            borderRadius: '12px', 
            fontWeight: '600', 
            fontSize: '14px', 
            transition: 'all 0.3s ease'
          }}>
            <span>←</span>
            <span>Back to Documents</span>
          </Link>
        </div>

        {/* Main Form Card */}
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.95)', 
          borderRadius: '24px', 
          padding: '40px', 
          border: '2px solid rgba(6, 182, 212, 0.6)', 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          zIndex: 15
        }}>
          {error && <div style={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
            color: 'white', 
            padding: '16px 24px', 
            borderRadius: '12px', 
            marginBottom: '24px', 
            fontWeight: '600', 
            textAlign: 'center', 
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
          }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Title Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#ffffff', 
                marginBottom: '4px'
              }}>
                <span>📝</span>
                Document Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter document title"
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  background: 'rgba(51, 65, 85, 0.8)', 
                  border: '2px solid rgba(6, 182, 212, 0.4)', 
                  borderRadius: '12px', 
                  color: '#ffffff', 
                  fontSize: '16px', 
                  fontFamily: 'Inter, sans-serif'
                }}
                required
              />
            </div>

            {/* Description Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#ffffff', 
                marginBottom: '4px'
              }}>
                <span>📋</span>
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter document description"
                rows="4"
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  background: 'rgba(51, 65, 85, 0.8)', 
                  border: '2px solid rgba(6, 182, 212, 0.4)', 
                  borderRadius: '12px', 
                  color: '#ffffff', 
                  fontSize: '16px', 
                  fontFamily: 'Inter, sans-serif',
                  minHeight: '120px',
                  resize: 'vertical',
                  lineHeight: '1.6'
                }}
              />
            </div>

            {/* File Upload Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#ffffff', 
                marginBottom: '4px'
              }}>
                <span>📁</span>
                Select File
              </label>
              <div 
                style={{ 
                  position: 'relative', 
                  padding: '40px', 
                  background: dragActive ? 'rgba(6, 182, 212, 0.2)' : 'rgba(51, 65, 85, 0.6)', 
                  border: dragActive ? '3px solid rgba(6, 182, 212, 0.8)' : '3px dashed rgba(6, 182, 212, 0.4)', 
                  borderRadius: '16px', 
                  textAlign: 'center', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease'
                }}
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
                  style={{ display: 'none' }}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                
                {file ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{file.name}</div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.5' }}>
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#06b6d4', 
                      fontWeight: '600', 
                      background: 'rgba(6, 182, 212, 0.1)', 
                      padding: '4px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}>
                      Type: {file.type || 'Unknown'}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>📁</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>Click to select or drag and drop</div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: '1.5' }}>
                      Supports: Images, PDF, Word documents, Text files
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>Maximum file size: 10MB</div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || !file}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px', 
                width: '100%', 
                padding: '18px 32px', 
                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 25%, #3b82f6 50%, #1d4ed8 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '16px', 
                fontWeight: '700', 
                fontSize: '18px', 
                cursor: loading || !file ? 'not-allowed' : 'pointer', 
                transition: 'all 0.4s ease', 
                boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)', 
                letterSpacing: '1px', 
                marginTop: '20px',
                opacity: loading || !file ? 0.6 : 1
              }}
            >
              {loading ? (
                <>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid rgba(255, 255, 255, 0.3)', 
                    borderRadius: '50%', 
                    borderTopColor: '#ffffff', 
                    animation: 'spin 1s ease-in-out infinite'
                  }}></div>
                  <span>Uploading document...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
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