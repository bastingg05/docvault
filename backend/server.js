import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userroutes.js";
import documentRoutes from "./routes/documentRoutes.js";

// Load environment variables from multiple sources
dotenv.config(); // Load .env first
dotenv.config({ path: './env.local' }); // Override with env.local if exists

console.log("🚀 Starting DocuVault server...");
console.log("Environment:", process.env.NODE_ENV);
console.log("MongoDB URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

// Connect to MongoDB - Updated for local development
let dbConnected = false;
connectDB().then(connected => {
  dbConnected = connected;
  if (connected) {
    console.log("🚀 Database connection established successfully");
  } else {
    console.log("⚠️ Running in demo mode without database connection");
  }
});

const app = express();

// Tracking variables
const startTime = Date.now();
let requestCount = 0;
let errorCount = 0;

// Health data object
const healthData = {
  status: "healthy",
  uptime: 0,
  timestamp: new Date().toISOString(),
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
  database: "checking",
  memory: {},
  performance: {}
};

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger + monitoring
app.use((req, res, next) => {
  requestCount++;
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400) errorCount++;

    healthData.performance = {
      totalRequests: requestCount,
      totalErrors: errorCount,
      errorRate: ((errorCount / requestCount) * 100).toFixed(2),
      lastResponseTime: duration,
      lastRequest: new Date().toISOString()
    };
  });

  next();
});

// Enhanced health check with better error handling
app.get("/health", (req, res) => {
  try {
    const uptime = Date.now() - startTime;

    healthData.uptime = uptime;
    healthData.timestamp = new Date().toISOString();
    healthData.memory = {
      used: process.memoryUsage().heapUsed,
      total: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external
    };

    // Check DB status
    healthData.database = dbConnected ? "connected" : "disconnected";

    if (healthData.database === "connected" && healthData.performance.errorRate < 5) {
      healthData.status = "healthy";
    } else if (healthData.database === "connected") {
      healthData.status = "degraded";
    } else {
      healthData.status = "unhealthy";
    }

    res.status(200).json(healthData);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Simple health check for load balancers
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DocuVault Backend is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: Date.now() - startTime
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  
  errorCount++;
  
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
    status: "error",
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  // Don't exit immediately, let the process continue
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit immediately, let the process continue
});

// Memory leak detection
setInterval(() => {
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  
  if (heapUsedMB > 500) { // Warning at 500MB
    console.warn(`⚠️ High memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB`);
  }
  
  // Force garbage collection if memory usage is high
  if (heapUsedMB > 800) { // Force GC at 800MB
    console.warn('🧹 Forcing garbage collection...');
    if (global.gc) {
      global.gc();
    }
  }
}, 60000); // Check every minute

// Start server only in local development
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check available at: http://localhost:${PORT}/health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Database: ${dbConnected ? 'Connected' : 'Demo Mode'}`);
    console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
  });

  // Server error handling
  server.on('error', (error) => {
    console.error('💥 Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
    }
  });
} else {
  console.log('🚀 Running in Vercel production mode');
}

export default app;
