import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "DocuVault Simple Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Test user route
app.get("/api/users/", (req, res) => {
  res.json({
    message: "User routes working",
    status: "success"
  });
});

// Test user route with test endpoint
app.get("/api/users/test", (req, res) => {
  res.json({
    message: "Test endpoint working",
    status: "success"
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "DocuVault Simple API Server",
    status: "running",
    endpoints: [
      "/health",
      "/api/users/",
      "/api/users/test"
    ]
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});

export default app;
