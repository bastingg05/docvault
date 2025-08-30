import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import userRoutes from "./routes/userroutes.js";
import documentRoutes from "./routes/documentRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
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
app.use(cors());
app.use(express.json());

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

// Health check
app.get("/health", (req, res) => {
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
});

// Detailed health
app.get("/health/detailed", (req, res) => {
  const uptime = Date.now() - startTime;

  res.status(200).json({
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
    performance: {
      ...healthData.performance,
      uptimePercentage: calculateUptimePercentage(startTime)
    }
  });
});

// Uptime
app.get("/uptime", (req, res) => {
  const uptime = Date.now() - startTime;

  res.json({
    uptime,
    uptimeFormatted: formatUptime(uptime),
    startTime: new Date(startTime).toISOString(),
    currentTime: new Date().toISOString(),
    uptimePercentage: calculateUptimePercentage(startTime)
  });
});

// Metrics for Prometheus
app.get("/metrics", (req, res) => {
  const uptime = Date.now() - startTime;

  res.set("Content-Type", "text/plain");
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
docuvault_error_rate ${((errorCount / requestCount) * 100) || 0}

# HELP docuvault_memory_heap_used_bytes Memory heap used in bytes
# TYPE docuvault_memory_heap_used_bytes gauge
docuvault_memory_heap_used_bytes ${process.memoryUsage().heapUsed}

# HELP docuvault_memory_heap_total_bytes Memory heap total in bytes
# TYPE docuvault_memory_heap_total_bytes gauge
docuvault_memory_heap_total_bytes ${process.memoryUsage().heapTotal}
  `);
});

// Recovery endpoint
app.post("/health/recover", (req, res) => {
  try {
    errorCount = 0;

    if (global.gc) global.gc();

    healthData.status = "healthy";
    healthData.timestamp = new Date().toISOString();

    res.json({ message: "Recovery initiated", status: "recovered", timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ message: "Recovery failed", error: error.message });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 DocuVault API is running...");
});

// Error handler
app.use((err, req, res, next) => {
  errorCount++;
  console.error("Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
    timestamp: new Date().toISOString()
  });
});

// Helper functions
function formatUptime(uptime) {
  const seconds = Math.floor(uptime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function calculateUptimePercentage(startTime) {
  const uptime = Date.now() - startTime;
  const totalTime = Date.now();
  return ((uptime / totalTime) * 100).toFixed(6);
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down...");
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
});
