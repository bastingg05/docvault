#!/usr/bin/env node

import fetch from 'node-fetch';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

class DocuVaultMonitor {
  constructor() {
    this.config = {
      healthCheckUrl: process.env.HEALTH_CHECK_URL || 'http://localhost:5000/health',
      checkInterval: parseInt(process.env.CHECK_INTERVAL) || 30000, // 30 seconds
      maxFailures: parseInt(process.env.MAX_FAILURES) || 3,
      restartCommand: process.env.RESTART_COMMAND || 'npm start',
      logFile: process.env.LOG_FILE || './monitor.log',
      metricsFile: process.env.METRICS_FILE || './metrics.json'
    };
    
    this.failureCount = 0;
    this.lastHealthCheck = null;
    this.startTime = Date.now();
    this.totalChecks = 0;
    this.successfulChecks = 0;
    this.failedChecks = 0;
    this.uptime = 0;
    
    this.init();
  }

  init() {
    console.log('🚀 DocuVault Monitor starting...');
    console.log(`📊 Health check URL: ${this.config.healthCheckUrl}`);
    console.log(`⏰ Check interval: ${this.config.checkInterval}ms`);
    console.log(`🔴 Max failures before restart: ${this.config.maxFailures}`);
    
    this.startMonitoring();
    this.setupGracefulShutdown();
  }

  startMonitoring() {
    // Initial health check
    this.performHealthCheck();
    
    // Set up periodic health checks
    setInterval(() => {
      this.performHealthCheck();
    }, this.config.checkInterval);

    // Update uptime every second
    setInterval(() => {
      this.uptime = Date.now() - this.startTime;
    }, 1000);
  }

  async performHealthCheck() {
    try {
      const startTime = Date.now();
      this.totalChecks++;
      
      const response = await fetch(this.config.healthCheckUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const healthData = await response.json();
        this.handleSuccessfulHealthCheck(healthData, responseTime);
      } else {
        this.handleFailedHealthCheck(`HTTP ${response.status}`, responseTime);
      }
    } catch (error) {
      this.handleFailedHealthCheck(error.message, null);
    }

    this.lastHealthCheck = Date.now();
    this.updateMetrics();
  }

  handleSuccessfulHealthCheck(healthData, responseTime) {
    this.successfulChecks++;
    this.failureCount = 0; // Reset failure count on success
    
    const logMessage = `✅ Health check passed - Status: ${healthData.status}, Response time: ${responseTime}ms, Uptime: ${this.formatUptime(healthData.uptime)}`;
    this.log(logMessage);
    
    // Check if we need to take action based on health data
    if (healthData.status === 'degraded') {
      this.log('⚠️  System is in degraded state - monitoring closely');
    }
    
    // Log memory usage if available
    if (healthData.memory) {
      const memoryMB = Math.round(healthData.memory.used / 1024 / 1024);
      if (memoryMB > 500) { // Alert if memory usage > 500MB
        this.log(`⚠️  High memory usage: ${memoryMB}MB`);
      }
    }
  }

  handleFailedHealthCheck(error, responseTime) {
    this.failedChecks++;
    this.failureCount++;
    
    const logMessage = `❌ Health check failed (${this.failureCount}/${this.config.maxFailures}) - Error: ${error}`;
    this.log(logMessage);
    
    if (this.failureCount >= this.config.maxFailures) {
      this.log('🚨 Max failures reached - initiating restart...');
      this.restartService();
    }
  }

  async restartService() {
    try {
      this.log('🔄 Restarting service...');
      
      // Kill existing process if running
      if (process.pid) {
        process.kill(process.pid, 'SIGTERM');
      }
      
      // Wait a moment for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Execute restart command
      const restartProcess = spawn(this.config.restartCommand, [], {
        stdio: 'inherit',
        shell: true
      });
      
      restartProcess.on('error', (error) => {
        this.log(`❌ Restart failed: ${error.message}`);
      });
      
      restartProcess.on('exit', (code) => {
        this.log(`🔄 Restart process exited with code ${code}`);
      });
      
    } catch (error) {
      this.log(`❌ Failed to restart service: ${error.message}`);
    }
  }

  updateMetrics() {
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: this.uptime,
      totalChecks: this.totalChecks,
      successfulChecks: this.successfulChecks,
      failedChecks: this.failedChecks,
      failureCount: this.failureCount,
      lastHealthCheck: this.lastHealthCheck,
      uptimePercentage: this.calculateUptimePercentage(),
      healthScore: this.calculateHealthScore()
    };

    // Save metrics to file
    try {
      fs.writeFileSync(this.config.metricsFile, JSON.stringify(metrics, null, 2));
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }

  calculateUptimePercentage() {
    if (this.totalChecks === 0) return 100;
    return ((this.successfulChecks / this.totalChecks) * 100).toFixed(2);
  }

  calculateHealthScore() {
    if (this.totalChecks === 0) return 100;
    
    let score = 100;
    
    // Deduct points for failures
    score -= (this.failedChecks / this.totalChecks) * 50;
    
    // Deduct points for consecutive failures
    score -= this.failureCount * 10;
    
    // Ensure score doesn't go below 0
    return Math.max(0, Math.round(score));
  }

  formatUptime(milliseconds) {
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
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    console.log(logEntry);
    
    // Write to log file
    try {
      fs.appendFileSync(this.config.logFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  setupGracefulShutdown() {
    process.on('SIGTERM', () => {
      this.log('SIGTERM received, shutting down gracefully');
      this.cleanup();
      process.exit(0);
    });

    process.on('SIGINT', () => {
      this.log('SIGINT received, shutting down gracefully');
      this.cleanup();
      process.exit(0);
    });

    process.on('uncaughtException', (error) => {
      this.log(`Uncaught exception: ${error.message}`);
      this.cleanup();
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      this.log(`Unhandled rejection at ${promise}: ${reason}`);
      this.cleanup();
      process.exit(1);
    });
  }

  cleanup() {
    this.log('🧹 Cleaning up monitor...');
    this.updateMetrics();
    this.log('📊 Final metrics saved');
    this.log('👋 Monitor shutdown complete');
  }

  // Public methods for external access
  getStatus() {
    return {
      uptime: this.uptime,
      totalChecks: this.totalChecks,
      successfulChecks: this.successfulChecks,
      failedChecks: this.failedChecks,
      failureCount: this.failureCount,
      lastHealthCheck: this.lastHealthCheck,
      uptimePercentage: this.calculateUptimePercentage(),
      healthScore: this.calculateHealthScore()
    };
  }

  forceHealthCheck() {
    this.performHealthCheck();
  }

  resetFailureCount() {
    this.failureCount = 0;
    this.log('🔄 Failure count reset');
  }
}

// Start the monitor if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new DocuVaultMonitor();
  
  // Handle process signals
  process.on('SIGUSR1', () => {
    console.log('📊 Current status:', monitor.getStatus());
  });
  
  process.on('SIGUSR2', () => {
    monitor.forceHealthCheck();
  });
}

export default DocuVaultMonitor;
