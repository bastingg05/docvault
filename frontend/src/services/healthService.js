import { getApiUrl } from '../config.js';

class HealthService {
  constructor() {
    this.healthCheckInterval = 30000; // 30 seconds
    this.retryAttempts = 3;
    this.retryDelay = 5000; // 5 seconds
    this.offlineMode = false;
    this.lastSuccessfulCheck = Date.now();
    this.connectionRetryTimer = null;
    this.offlineFallbackData = {
      status: 'offline',
      isOnline: false,
      connectionQuality: 'poor',
      lastHealthCheck: Date.now(),
      uptime: 0
    };
  }

  init() {
    this.startHealthMonitoring();
    this.setupEventListeners();
    this.registerServiceWorker();
  }

  setupEventListeners() {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.connectionQuality = 'good';
      this.updateHealthStatus();
      this.notifyConnectionChange('online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.connectionQuality = 'poor';
      this.updateHealthStatus();
      this.notifyConnectionChange('offline');
    });

    // Monitor page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.performHealthCheck();
      }
    });

    // Monitor beforeunload for graceful shutdown
    window.addEventListener('beforeunload', () => {
      this.logHealthMetrics();
    });
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        
        // Monitor service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notifyServiceWorkerUpdate();
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Enhanced health check with retry logic and offline detection
  async performHealthCheck() {
    let attempts = 0;
    
    while (attempts < this.retryAttempts) {
      try {
        const startTime = Date.now();
        
        // Check if we're online first
        if (!navigator.onLine) {
          this.setOfflineMode();
          return;
        }
        
        // Check backend health with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const healthResponse = await fetch(getApiUrl('/health'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          this.updateHealthMetrics(healthData, responseTime);
          this.healthStatus = 'healthy';
          this.setOnlineMode();
          this.lastSuccessfulCheck = Date.now();
          return; // Success, exit retry loop
        } else {
          this.healthStatus = 'degraded';
          this.logHealthIssue('Backend health check failed', responseTime);
        }
      } catch (error) {
        attempts++;
        this.logHealthIssue(`Health check attempt ${attempts} failed`, null, error);
        
        if (error.name === 'AbortError') {
          console.warn('Health check timed out, retrying...');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          this.setOfflineMode();
          return; // Don't retry network errors
        }
        
        if (attempts < this.retryAttempts) {
          await this.delay(this.retryDelay);
        }
      }
    }
    
    // All retries failed
    this.healthStatus = 'unhealthy';
    this.setOfflineMode();
  }

  // Set offline mode and use fallback data
  setOfflineMode() {
    this.offlineMode = true;
    this.healthStatus = 'offline';
    this.isOnline = false;
    this.connectionQuality = 'poor';
    
    // Schedule retry when connection is restored
    if (this.connectionRetryTimer) {
      clearTimeout(this.connectionRetryTimer);
    }
    
    this.connectionRetryTimer = setTimeout(() => {
      this.attemptReconnection();
    }, 30000); // Try to reconnect every 30 seconds
    
    // Dispatch offline event
    window.dispatchEvent(new CustomEvent('healthStatusChanged', {
      detail: this.offlineFallbackData
    }));
  }

  // Set online mode and restore normal operation
  setOnlineMode() {
    this.offlineMode = false;
    this.isOnline = true;
    
    if (this.connectionRetryTimer) {
      clearTimeout(this.connectionRetryTimer);
      this.connectionRetryTimer = null;
    }
  }

  // Attempt to reconnect when connection is restored
  async attemptReconnection() {
    if (navigator.onLine && this.offlineMode) {
      console.log('🔄 Attempting to reconnect...');
      await this.performHealthCheck();
    }
  }

  // Enhanced start monitoring with connection event listeners
  startHealthMonitoring() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('🌐 Network connection restored');
      this.attemptReconnection();
    });
    
    window.addEventListener('offline', () => {
      console.log('📡 Network connection lost');
      this.setOfflineMode();
    });
    
    // Start health checks
    this.performHealthCheck();
    
    // Set up periodic health checks
    setInterval(() => {
      if (!this.offlineMode) {
        this.performHealthCheck();
      }
    }, this.healthCheckInterval);
    
    // Set up heartbeat
    setInterval(() => {
      if (!this.offlineMode) {
        this.sendHeartbeat();
      }
    }, 60000); // Every minute
  }

  updateHealthMetrics(healthData, responseTime) {
    const healthCheck = {
      timestamp: Date.now(),
      status: this.healthStatus,
      responseTime: responseTime,
      data: healthData
    };
    
    this.healthHistory.push(healthCheck);
    
    // Keep only last 50 entries
    if (this.healthHistory.length > 50) {
      this.healthHistory.shift();
    }
    
    // Update connection quality based on response time
    if (responseTime < 300) {
      this.connectionQuality = 'excellent';
    } else if (responseTime < 1000) {
      this.connectionQuality = 'good';
    } else if (responseTime < 3000) {
      this.connectionQuality = 'fair';
    } else {
      this.connectionQuality = 'poor';
    }
  }

  updateHealthStatus() {
    const healthIndicator = document.getElementById('health-indicator');
    if (healthIndicator) {
      healthIndicator.className = `health-indicator ${this.healthStatus}`;
      healthIndicator.title = `Status: ${this.healthStatus}, Connection: ${this.connectionQuality}`;
    }

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('healthStatusChanged', {
      detail: this.getHealthStatus()
    }));
  }

  // Enhanced heartbeat with retry logic
  async sendHeartbeat() {
    try {
      const response = await fetch(getApiUrl('/api/heartbeat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          client: 'frontend',
          version: '1.0.0'
        })
      });
      
      if (response.ok) {
        console.log('💓 Heartbeat sent successfully');
      }
    } catch (error) {
      console.warn('💓 Heartbeat failed:', error.message);
    }
  }

  logHealthIssue(message, responseTime, error) {
    const issue = {
      timestamp: Date.now(),
      message: message,
      responseTime: responseTime,
      error: error ? error.message : null
    };
    
    console.warn('⚠️ Health Issue:', issue);
    
    // Store in health history
    this.healthHistory.push({
      timestamp: Date.now(),
      status: 'error',
      responseTime: responseTime || 0,
      error: message
    });
  }

  logHealthMetrics() {
    const metrics = {
      totalUptime: Date.now() - this.uptimeStart,
      healthChecks: this.healthChecks.length,
      lastStatus: this.healthStatus,
      connectionQuality: this.connectionQuality,
      timestamp: Date.now()
    };

    console.log('Health Metrics:', metrics);
    
    // Store in localStorage
    const allMetrics = JSON.parse(localStorage.getItem('healthMetrics') || '[]');
    allMetrics.push(metrics);
    
    // Keep only last 100 metrics
    if (allMetrics.length > 100) {
      allMetrics.shift();
    }
    
    localStorage.setItem('healthMetrics', JSON.stringify(allMetrics));
  }

  notifyConnectionChange(status) {
    // Show notification
    if (status === 'online') {
      this.showNotification('Connection Restored', 'You are back online! 🟢');
    } else {
      this.showNotification('Connection Lost', 'You are offline. Working with cached data... 🔴');
    }
  }

  notifyServiceWorkerUpdate() {
    this.showNotification('Update Available', 'A new version is available. Refresh to update! 🔄');
  }

  showNotification(title, message) {
    // Check if notifications are supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }

    // Also show in-app notification
    this.showInAppNotification(title, message);
  }

  showInAppNotification(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'health-notification';
    notification.innerHTML = `
      <div class="notification-header">
        <span class="notification-title">${title}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="notification-message">${message}</div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Public methods for other components
  getHealthStatus() {
    if (this.offlineMode) {
      return this.offlineFallbackData;
    }
    
    return {
      status: this.healthStatus || 'unknown',
      isOnline: this.isOnline !== undefined ? this.isOnline : navigator.onLine,
      connectionQuality: this.connectionQuality || 'unknown',
      lastHealthCheck: this.lastHealthCheck || Date.now(),
      uptime: this.uptime || 0
    };
  }

  getHealthHistory() {
    return this.healthHistory || [];
  }

  forceHealthCheck() {
    console.log('🔄 Forcing health check...');
    this.performHealthCheck();
  }

  // Cleanup method
  destroy() {
    this.logHealthMetrics();
    // Clear intervals if needed
  }

  // Utility method for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create and export singleton instance
const healthService = new HealthService();
export default healthService;
