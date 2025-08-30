import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockUsers = [
  { id: 1, name: "Bastin", email: "bastin123@gmail.com", password: "test123" }
];

const mockDocuments = [];

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock login endpoint
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { email: user.email, id: user.id }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Mock registration endpoint
app.post("/api/users/register", (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User with this email already exists' });
  }
  
  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    password
  };
  
  mockUsers.push(newUser);
  
  // Generate token for new user
  const token = jwt.sign(
    { email: newUser.email, userId: newUser.id },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );
  
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { name: newUser.name, email: newUser.email, id: newUser.id }
  });
});

// Mock documents endpoint
app.get("/api/documents", (req, res) => {
  res.status(200).json({ documents: mockDocuments });
});

app.post("/api/documents", (req, res) => {
  const { title, description } = req.body;
  
  const newDoc = {
    id: Date.now(),
    title: title || 'Untitled Document',
    description: description || '',
    uploadDate: new Date().toISOString(),
    size: '1.5 MB'
  };
  
  mockDocuments.push(newDoc);
  
  res.status(201).json({
    message: 'Document uploaded successfully',
    document: newDoc
  });
});

// Mock document delete endpoint
app.delete("/api/documents/:id", (req, res) => {
  const documentId = req.params.id;
  
  // Find the document index
  const documentIndex = mockDocuments.findIndex(doc => (doc.id || doc._id) == documentId);
  
  if (documentIndex === -1) {
    return res.status(404).json({ message: 'Document not found' });
  }
  
  // Remove the document
  const deletedDocument = mockDocuments.splice(documentIndex, 1)[0];
  
  res.status(200).json({
    message: 'Document deleted successfully',
    document: deletedDocument
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "DocuVault Mock API Server", endpoints: ["/health", "/api/users/login", "/api/documents"] });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Mock API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Login: POST http://localhost:${PORT}/api/users/login`);
  console.log(`Register: POST http://localhost:${PORT}/api/users/register`);
  console.log(`Documents: GET/POST/DELETE http://localhost:${PORT}/api/documents`);
});
