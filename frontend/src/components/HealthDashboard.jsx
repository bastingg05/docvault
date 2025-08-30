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
      backdropFilter: 'blur(10px)'
    }}>
      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          color: '#ff6b6b',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 107, 107, 0.3)';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 107, 107, 0.2)';
          e.target.style.transform = 'scale(1)';
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
          padding: '10px 15px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '10px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginRight: '40px' // Make space for close button
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
          {/* Uptime Section */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>⏰ Uptime</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ff88' }}>
                  {calculateUptimePercentage()}%
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Uptime</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00d4ff' }}>
                  {formatUptime(uptime)}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Current Session</div>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>🌐 Connection</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: getConnectionQualityColor(healthStatus.connectionQuality || 'unknown') }}>
                  {getConnectionIcon(healthStatus.connectionQuality || 'unknown')} {healthStatus.connectionQuality || 'Unknown'}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Connection Quality</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: healthStatus.isOnline ? '#00ff88' : '#ff4444' }}>
                  {healthStatus.isOnline ? '🟢 Online' : '🔴 Offline'}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Network Status</div>
              </div>
            </div>
          </div>

          {/* Health History */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>📈 Recent Health Checks</h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
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
                    fontSize: '12px'
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

          {/* Actions */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => healthService.forceHealthCheck()}
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                margin: '0 10px',
                fontSize: '14px'
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
                margin: '0 10px',
                fontSize: '14px'
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
