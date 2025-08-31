// Network Resilience Configuration
// This file contains all network-related settings to ensure your site runs continuously

export const NETWORK_CONFIG = {
  // Timeout settings
  TIMEOUTS: {
    API_REQUEST: 15000,        // 15 seconds for API calls
    HEALTH_CHECK: 10000,       // 10 seconds for health checks
    DOCUMENT_UPLOAD: 60000,    // 60 seconds for file uploads
    DOCUMENT_DOWNLOAD: 30000,  // 30 seconds for file downloads
    CONNECTION_TEST: 5000,     // 5 seconds for connection tests
  },

  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,           // Maximum retry attempts
    BASE_DELAY: 2000,          // Base delay between retries (2 seconds)
    MAX_DELAY: 30000,          // Maximum delay between retries (30 seconds)
    BACKOFF_MULTIPLIER: 2,     // Exponential backoff multiplier
  },

  // Health monitoring
  HEALTH: {
    CHECK_INTERVAL: 30000,     // Health check every 30 seconds
    HEARTBEAT_INTERVAL: 60000, // Heartbeat every 60 seconds
    OFFLINE_THRESHOLD: 3,      // Consider offline after 3 failed checks
    RECONNECT_INTERVAL: 30000, // Try to reconnect every 30 seconds
  },

  // Caching strategy
  CACHE: {
    STATIC_ASSETS: 'cache-first',    // Cache static assets first
    API_RESPONSES: 'network-first',  // Try network first, fallback to cache
    DOCUMENTS: 'stale-while-revalidate', // Serve cached, update in background
    MAX_AGE: 3600000,               // Cache for 1 hour
  },

  // Offline fallbacks
  OFFLINE: {
    ENABLE_FALLBACKS: true,    // Enable offline functionality
    CACHE_CRITICAL_PATHS: true, // Cache critical navigation paths
    SHOW_OFFLINE_INDICATOR: true, // Show when user is offline
    AUTO_RECONNECT: true,      // Automatically try to reconnect
  },

  // Error handling
  ERRORS: {
    SHOW_USER_FRIENDLY: true,  // Show user-friendly error messages
    LOG_TO_CONSOLE: true,      // Log errors to console for debugging
    RETRY_AUTOMATICALLY: true, // Automatically retry failed requests
    FALLBACK_TO_CACHE: true,   // Fallback to cached content when possible
  },

  // Performance optimization
  PERFORMANCE: {
    ENABLE_COMPRESSION: true,  // Enable gzip compression
    MINIFY_RESPONSES: true,    // Minify API responses
    ENABLE_HTTP2: true,        // Enable HTTP/2 if available
    CONNECTION_POOLING: true,  // Enable connection pooling
  },

  // Monitoring and analytics
  MONITORING: {
    TRACK_NETWORK_ERRORS: true,    // Track network errors
    MEASURE_RESPONSE_TIMES: true,  // Measure API response times
    LOG_CONNECTION_STATUS: true,   // Log connection status changes
    ALERT_ON_FAILURES: true,      // Alert on repeated failures
  }
};

// Network status constants
export const NETWORK_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  DEGRADED: 'degraded',
  UNSTABLE: 'unstable',
  RECONNECTING: 'reconnecting'
};

// Error types for better error handling
export const ERROR_TYPES = {
  NETWORK_ERROR: 'network_error',
  TIMEOUT_ERROR: 'timeout_error',
  SERVER_ERROR: 'server_error',
  AUTH_ERROR: 'auth_error',
  VALIDATION_ERROR: 'validation_error',
  UNKNOWN_ERROR: 'unknown_error'
};

// Retry strategies
export const RETRY_STRATEGIES = {
  IMMEDIATE: 'immediate',           // Retry immediately
  LINEAR_BACKOFF: 'linear_backoff', // Linear delay increase
  EXPONENTIAL_BACKOFF: 'exponential_backoff', // Exponential delay increase
  FIBONACCI_BACKOFF: 'fibonacci_backoff' // Fibonacci delay increase
};

// Cache strategies
export const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Default API endpoints with fallbacks
export const API_ENDPOINTS = {
  PRIMARY: 'https://docuvault-v2.onrender.com',
  FALLBACK: 'https://docuvault-v2.onrender.com', // Same service as fallback
  LOCAL: 'http://localhost:5000',
  HEALTH: '/health',
  API_BASE: '/api'
};

// Connection quality thresholds
export const CONNECTION_QUALITY = {
  EXCELLENT: { maxLatency: 100, minSpeed: 1000 },   // < 100ms, > 1Mbps
  GOOD: { maxLatency: 300, minSpeed: 500 },         // < 300ms, > 500Kbps
  FAIR: { maxLatency: 1000, minSpeed: 100 },        // < 1s, > 100Kbps
  POOR: { maxLatency: 3000, minSpeed: 50 },         // < 3s, > 50Kbps
  UNUSABLE: { maxLatency: Infinity, minSpeed: 0 }   // > 3s or no connection
};

// Export default configuration
export default NETWORK_CONFIG;
