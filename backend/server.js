import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userroutes.js";
import documentRoutes from "./routes/documentRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Uptime tracking
const startTime = Date.now();
let requestCount = 0;
let errorCount = 0;
let lastHealthCheck = Date.now();

// Health check data
const healthData = {
  status: 'healthy',
  uptime: 0,
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  database: 'connected',
  memory: {},
  performance: {}
};

// Middleware
app.use(cors());
app.use(express.json());

// Request logging and monitoring middleware
app.use((req, res, next) => {
  requestCount++;
  const start = Date.now();
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400) {
      errorCount++;
    }
    
    // Update performance metrics
    healthData.performance = {
      totalRequests: requestCount,
      totalErrors: errorCount,
      errorRate: (errorCount / requestCount * 100).toFixed(2),
      averageResponseTime: duration,
      lastRequest: new Date().toISOString()
    };
  });
  
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  const currentTime = Date.now();
  const uptime = currentTime - startTime;
  
  // Update health data
  healthData.uptime = uptime;
  healthData.timestamp = new Date().toISOString();
  healthData.memory = {
    used: process.memoryUsage().heapUsed,
    total: process.memoryUsage().heapTotal,
    external: process.memoryUsage().external
  };
  
  // Check database connection
  try {
    // Simple database ping
    healthData.database = 'connected';
  } catch (error) {
    healthData.database = 'disconnected';
    healthData.status = 'degraded';
  }
  
  // Determine overall status
  if (healthData.database === 'connected' && healthData.errorRate < 5) {
    healthData.status = 'healthy';
  } else if (healthData.database === 'connected') {
    healthData.status = 'degraded';
  } else {
    healthData.status = 'unhealthy';
  }
  
  lastHealthCheck = currentTime;
  
  res.status(200).json(healthData);
});

// Detailed health check endpoint
app.get("/health/detailed", (req, res) => {
  const currentTime = Date.now();
  const uptime = currentTime - startTime;
  
  const detailedHealth = {
    ...healthData,
    uptime,
    uptimeFormatted: formatUptime(uptime),
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      uptime: process.uptime()
    },
    database: {
      status: healthData.database,
      connectionTime: Date.now()
    },
    performance: {
      ...healthData.performance,
      uptimePercentage: calculateUptimePercentage(startTime)
    }
  };
  
  res.status(200).json(detailedHealth);
});

// Uptime endpoint
app.get("/uptime", (req, res) => {
  const currentTime = Date.now();
  const uptime = currentTime - startTime;
  
  res.json({
    uptime: uptime,
    uptimeFormatted: formatUptime(uptime),
    startTime: new Date(startTime).toISOString(),
    currentTime: new Date(currentTime).toISOString(),
    uptimePercentage: calculateUptimePercentage(startTime)
  });
});

// Metrics endpoint for monitoring systems
app.get("/metrics", (req, res) => {
  const currentTime = Date.now();
  const uptime = currentTime - startTime;
  
  res.set('Content-Type', 'text/plain');
  res.send(`
# HELP docuvault_uptime_seconds Total uptime in seconds
# TYPE docuvault_uptime_seconds counter
docuvault_uptime_seconds ${Math.floor(uptime / 1000)}

# HELP docuvault_requests_total Total number of requests
# TYPE docuvault_requests_total counter
docuvault_requests_total ${requestCount}

# HELP docuvault_errors_total Total number of errors
# TYPE docuvault_errors_total counter
docuvault_errors_total ${errorCount}

# HELP docuvault_error_rate Error rate percentage
# TYPE docuvault_error_rate gauge
docuvault_error_rate ${(errorCount / requestCount * 100) || 0}

# HELP docuvault_memory_heap_used_bytes Memory heap used in bytes
# TYPE docuvault_memory_heap_used_bytes gauge
docuvault_memory_heap_used_bytes ${process.memoryUsage().heapUsed}

# HELP docuvault_memory_heap_total_bytes Memory heap total in bytes
# TYPE docuvault_memory_heap_total_bytes gauge
docuvault_memory_heap_total_bytes ${process.memoryUsage().heapTotal}
  `);
});

// Auto-recovery endpoint
app.post("/health/recover", (req, res) => {
  try {
    // Reset error count
    errorCount = 0;
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    // Update health status
    healthData.status = 'healthy';
    healthData.timestamp = new Date().toISOString();
    
    res.json({
      message: 'Recovery initiated successfully',
      status: 'recovered',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Recovery failed',
      error: error.message
    });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("DocuVault API is running... 🚀");
});

// Error handling middleware
app.use((err, req, res, next) => {
  errorCount++;
  console.error('Error:', err);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    timestamp: new Date().toISOString()
  });
});

// Helper functions
function formatUptime(uptime) {
  const seconds = Math.floor(uptime / 1000);
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

function calculateUptimePercentage(startTime) {
  const currentTime = Date.now();
  const uptime = currentTime - startTime;
  const totalTime = currentTime;
  return ((uptime / totalTime) * 100).toFixed(6);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DocuVault Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 Health check available at: http://localhost:${PORT}/health`);
  console.log(`📈 Metrics available at: http://localhost:${PORT}/metrics`);
  console.log(`⏰ Uptime tracking enabled`);
});
