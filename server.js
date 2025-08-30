import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import User from './models/User.js';
import Document from './models/Document.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", async (req, res) => {
  let dbStatus = 'Unknown';
  try {
    // Simple check if DB is connected
    await User.estimatedDocumentCount();
    dbStatus = 'MongoDB Connected';
  } catch {
    dbStatus = 'MongoDB Disconnected';
  }
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Login endpoint
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    // NOTE: In production, use hashed passwords!
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { email: user.email, id: user._id, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registration endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // NOTE: In production, hash the password before saving!
    const newUser = await User.create({
      name,
      email,
      password
    });

    // Generate token for new user
    const token = jwt.sign(
      { email: newUser.email, userId: newUser._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { name: newUser.name, email: newUser.email, id: newUser._id }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get documents endpoint
app.get("/api/documents", authenticateToken, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create document endpoint
app.post("/api/documents", authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newDoc = await Document.create({
      title: title || 'Untitled Document',
      description: description || '',
      userId: req.user._id
    });

    res.status(201).json({
      message: 'Document created successfully',
      document: newDoc
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document endpoint
app.delete("/api/documents/:id", authenticateToken, async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await Document.findOneAndDelete({
      _id: documentId,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({
      message: 'Document deleted successfully',
      document
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "DocuVault MongoDB API Server",
    endpoints: [
      "/health",
      "/api/users/login",
      "/api/users/register",
      "/api/documents (GET, POST, DELETE)"
    ],
    database: "MongoDB"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MongoDB API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Login: POST http://localhost:${PORT}/api/users/login`);
  console.log(`Register: POST http://localhost:${PORT}/api/users/register`);
  console.log(`Documents: GET/POST/DELETE http://localhost:${PORT}/api/documents`);
  console.log(`Database: MongoDB`);
});