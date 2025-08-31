import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Atlas Connection
const MONGODB_URI = 'mongodb+srv://bastingg05:gladwin2@bastin0.zvpymix.mongodb.net/docuvault-v2?retryWrites=true&w=majority&appName=Bastin0';

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Document Schema
const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number },
  fileType: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Document = mongoose.model('Document', documentSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF, and document files are allowed!'));
    }
  }
});

// Connect to MongoDB
async function connectDB() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log('✅ MongoDB Connected Successfully!');

    // Create default user
    const defaultUser = await User.findOne({ email: 'bastin123@gmail.com' });
    if (!defaultUser) {
      const hashedPassword = await bcrypt.hash('test123', 12);
      await User.create({
        name: 'Bastin',
        email: 'bastin123@gmail.com',
        password: hashedPassword
      });
      console.log('✅ Default user created: bastin123@gmail.com / test123');
    } else {
      console.log('✅ Default user already exists');
    }

    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, 'your-super-secret-jwt-key-change-this-in-production', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Login endpoint
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register endpoint
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'your-super-secret-jwt-key-change-this-in-production',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document
app.post('/api/documents', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description } = req.body;

    const document = await Document.create({
      title: title || req.file.originalname,
      description: description || '',
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all documents for user
app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');

    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single document
app.get('/api/documents/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id
    }).populate('uploadedBy', 'name email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update document
app.put('/api/documents/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, uploadedBy: req.user._id },
      {
        title,
        description,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document
app.delete('/api/documents/:id', authenticateToken, async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.user._id
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  const dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 DocuVault V2 Server running on port ${PORT}`);
    console.log(`📊 Database status: ${dbConnected ? 'Connected' : 'Disconnected'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Login: POST http://localhost:${PORT}/api/users/login`);
    console.log(`📝 Register: POST http://localhost:${PORT}/api/users/register`);
    console.log(`📄 Documents: GET/POST/PUT/DELETE http://localhost:${PORT}/api/documents`);
  });
}

startServer();