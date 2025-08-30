import React, { useState, useEffect } from 'react';
import healthService from '../services/healthService';

const HealthDashboard = ({ onClose }) => {
  const [healthStatus, setHealthStatus] = useState({});
  const [healthHistory, setHealthHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    // Get initial health status
    updateHealthStatus();
    
    // Listen for health status changes
    const handleHealthChange = (event) => {
      setHealthStatus(event.detail);
    };
    
    window.addEventListener('healthStatusChanged', handleHealthChange);
    
    // Update uptime every second
    const uptimeInterval = setInterval(() => {
      const status = healthService.getHealthStatus();
      setUptime(status.uptime);
    }, 1000);
    
    // Update health history every 10 seconds
    const historyInterval = setInterval(() => {
      setHealthHistory(healthService.getHealthHistory());
    }, 10000);
    
    return () => {
      window.removeEventListener('healthStatusChanged', handleHealthChange);
      clearInterval(uptimeInterval);
      clearInterval(historyInterval);
    };
  }, []);

  const updateHealthStatus = () => {
    setHealthStatus(healthService.getHealthStatus());
    setHealthHistory(healthService.getHealthHistory());
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const formatUptime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#00ff88';
      case 'degraded': return '#ffaa00';
      case 'unhealthy': return '#ff4444';
      default: return '#888888';
    }
  };

  const getConnectionQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return '#00ff88';
      case 'good': return '#00d4ff';
      case 'fair': return '#ffaa00';
      case 'poor': return '#ff4444';
      default: return '#888888';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'degraded': return '🟡';
      case 'unhealthy': return '🔴';
      default: return '⚪';
    }
  };

  const getConnectionIcon = (quality) => {
    switch (quality) {
      case 'excellent': return '📶';
      case 'good': return '📶';
      case 'fair': return '📶';
      case 'poor': return '📶';
      default: return '📶';
    }
  };

  const calculateUptimePercentage = () => {
    // This is a simplified calculation - in reality, you'd track total time vs downtime
    return 99.9; // Placeholder for actual calculation
  };

  return (
    <div className="health-dashboard" style={{
      position: 'relative',
      background: 'rgba(0, 0, 0, 0.9)',
      borderRadius: '15px',
      padding: '20px',
      margin: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      minWidth: '350px'
    }}>
      {/* Close Tab Button - Positioned at the top right corner of the entire dashboard */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          background: 'rgba(255, 107, 107, 0.9)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 107, 107, 1)';
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 107, 107, 0.9)';
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        }}
        title="Close Health Dashboard"
      >
        ✕
      </button>

      <div 
        className="health-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          padding: '15px 20px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '10px',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          marginTop: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <span style={{ fontWeight: 'bold', color: '#00d4ff' }}>System Health</span>
          <span 
            style={{ 
              fontSize: '12px',
              color: getStatusColor(healthStatus.status || 'unknown'),
              fontWeight: 'bold'
            }}
          >
            {getStatusIcon(healthStatus.status || 'unknown')} {healthStatus.status || 'Unknown'}
          </span>
        </div>
        
        <span style={{ fontSize: '14px', color: '#888' }}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div className="health-content" style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Connection Quality Section - Right Aligned */}
          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px', textAlign: 'right' }}>📶 Connection Quality</h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center', 
              gap: '10px',
              padding: '10px 15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ fontSize: '14px', color: '#ccc' }}>Quality:</span>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: getConnectionQualityColor(healthStatus.connectionQuality || 'unknown') 
              }}>
                {healthStatus.connectionQuality || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Network Status Section - Right Aligned */}
          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px', textAlign: 'right' }}>🌐 Network Status</h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center', 
              gap: '10px',
              padding: '10px 15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ fontSize: '14px', color: '#ccc' }}>Status:</span>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: healthStatus.isOnline ? '#00ff88' : '#ff4444' 
              }}>
                {healthStatus.isOnline ? '🟢 Online' : '🔴 Offline'}
              </span>
            </div>
          </div>

          {/* Recent Health Checks Section - Right Aligned */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px', textAlign: 'right' }}>📈 Recent Health Checks</h3>
            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {healthHistory.slice(-10).reverse().map((check, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    margin: '5px 0',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <span style={{ color: '#ccc' }}>
                    {new Date(check.timestamp).toLocaleTimeString()}
                  </span>
                  <span style={{ color: getStatusColor(check.status) }}>
                    {getStatusIcon(check.status)} {check.status}
                  </span>
                  <span style={{ color: '#888' }}>
                    {check.responseTime}ms
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions - Right Aligned */}
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => healthService.forceHealthCheck()}
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                margin: '0 10px 10px 0',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 212, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🔄 Refresh Health
            </button>
            <button
              onClick={updateHealthStatus}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b, #cc4444)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                margin: '0 0 10px 0',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              📊 Update Metrics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;
