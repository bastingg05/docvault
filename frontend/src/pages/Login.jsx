import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/userService';
import API from '../api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testApiConnection = async () => {
    setApiStatus('Testing...');
    try {
      const response = await API.get('/health');
      setApiStatus(`✅ API Connected! Status: ${response.status}`);
      console.log('API Response:', response.data);
    } catch (error) {
      setApiStatus(`❌ API Failed: ${error.message}`);
      console.error('API Test Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(formData.email, formData.password);
      onLogin(data.user, data.token);
    } catch (error) {
      setError(error.userMessage || error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to access your documents</p>
        
        {/* API Test Button */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={testApiConnection}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Test API Connection
          </button>
          {apiStatus && (
            <div style={{ 
              marginTop: '10px', 
              fontSize: '12px', 
              color: apiStatus.includes('✅') ? '#28a745' : '#dc3545' 
            }}>
              {apiStatus}
            </div>
          )}
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Demo Account: <br />
          Email: <strong>bastin123@gmail.com</strong><br />
          Password: <strong>test123</strong>
        </p>
        
        <Link to="/register" className="auth-link">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;

