class HealthService {
  constructor() {
    this.healthCheckInterval = 30000; // 30 seconds
    this.uptimeStart = Date.now();
    this.healthChecks = [];
    this.isOnline = navigator.onLine;
    this.connectionQuality = 'good';
    this.lastHealthCheck = null;
    this.healthStatus = 'healthy';
    
    this.init();
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

  startHealthMonitoring() {
    // Initial health check
    this.performHealthCheck();
    
    // Set up periodic health checks
    setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckInterval);

    // Set up heartbeat
    setInterval(() => {
      this.sendHeartbeat();
    }, 60000); // Every minute
  }

  async performHealthCheck() {
    try {
      const startTime = Date.now();
      
      // Check backend health
      const healthResponse = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseTime = Date.now() - startTime;
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        this.updateHealthMetrics(healthData, responseTime);
        this.healthStatus = 'healthy';
      } else {
        this.healthStatus = 'degraded';
        this.logHealthIssue('Backend health check failed', responseTime);
      }
    } catch (error) {
      this.healthStatus = 'unhealthy';
      this.logHealthIssue('Health check error', null, error);
    }

    this.lastHealthCheck = Date.now();
    this.updateHealthStatus();
  }

  updateHealthMetrics(healthData, responseTime) {
    const healthCheck = {
      timestamp: Date.now(),
      status: healthData.status,
      responseTime,
      uptime: healthData.uptime,
      database: healthData.database,
      memory: healthData.memory,
      errorRate: healthData.performance?.errorRate || 0
    };

    this.healthChecks.push(healthCheck);
    
    // Keep only last 100 health checks
    if (this.healthChecks.length > 100) {
      this.healthChecks.shift();
    }

    // Update connection quality based on response time
    if (responseTime < 100) {
      this.connectionQuality = 'excellent';
    } else if (responseTime < 300) {
      this.connectionQuality = 'good';
    } else if (responseTime < 1000) {
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
      detail: {
        status: this.healthStatus,
        isOnline: this.isOnline,
        connectionQuality: this.connectionQuality,
        lastHealthCheck: this.lastHealthCheck
      }
    }));
  }

  async sendHeartbeat() {
    try {
      await fetch('/api/health/heartbeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          online: this.isOnline,
          connectionQuality: this.connectionQuality
        })
      });
    } catch (error) {
      console.log('Heartbeat failed:', error);
    }
  }

  logHealthIssue(message, responseTime, error = null) {
    const issue = {
      timestamp: Date.now(),
      message,
      responseTime,
      error: error?.message || null,
      stack: error?.stack || null
    };

    console.warn('Health Issue:', issue);
    
    // Store in localStorage for debugging
    const issues = JSON.parse(localStorage.getItem('healthIssues') || '[]');
    issues.push(issue);
    
    // Keep only last 50 issues
    if (issues.length > 50) {
      issues.shift();
    }
    
    localStorage.setItem('healthIssues', JSON.stringify(issues));
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
    return {
      status: this.healthStatus,
      isOnline: this.isOnline,
      connectionQuality: this.connectionQuality,
      lastHealthCheck: this.lastHealthCheck,
      uptime: Date.now() - this.uptimeStart
    };
  }

  getHealthHistory() {
    return this.healthChecks;
  }

  forceHealthCheck() {
    this.performHealthCheck();
  }

  // Cleanup method
  destroy() {
    this.logHealthMetrics();
    // Clear intervals if needed
  }
}

// Create singleton instance
const healthService = new HealthService();

export default healthService;
