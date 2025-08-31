# 📄 DocuVault V2 - Document Management System

A modern, secure document management system built with React, Node.js, and MongoDB. Store, organize, and access your documents from anywhere with a beautiful, responsive interface.

## ✨ Features

- **🔐 Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- **📁 Document Management** - Upload, view, and delete documents with ease
- **🎨 Modern UI/UX** - Beautiful, responsive design with smooth animations
- **📱 Mobile Responsive** - Works perfectly on all devices
- **⚡ Real-time Updates** - Instant feedback and updates
- **🔍 File Type Support** - Images, PDFs, Word documents, and text files
- **📊 File Information** - View file size, upload date, and metadata
- **🌐 Cloud Storage** - MongoDB Atlas for reliable cloud storage

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bastingg05/docuvault-v2.git
   cd docuvault-v2
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start backend server (in one terminal)
   npm run dev
   
   # Start frontend server (in another terminal)
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 🔐 Default Login

The application comes with a default demo account:
- **Email**: `bastin123@gmail.com`
- **Password**: `test123`

## 📁 Project Structure

```
docuvault-v2/
├── server.js              # Main backend server
├── package.json           # Backend dependencies
├── render.yaml            # Render deployment config
├── uploads/               # File upload directory
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
└── README.md              # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get user profile

### Documents
- `GET /api/documents` - Get user's documents
- `POST /api/documents` - Upload new document
- `GET /api/documents/:id` - Get specific document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Health Check
- `GET /health` - Server health status

## 🚀 Deployment

### Render.com (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Click "Apply" to deploy

The `render.yaml` file will automatically configure both backend and frontend services.

### Manual Deployment

#### Backend Service
- **Type**: Web Service
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`

#### Frontend Service
- **Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

## 🔧 Environment Variables

The application works with default MongoDB Atlas connection. For production, consider setting:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 📱 Features in Detail

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- Automatic token refresh

### Document Management
- Drag & drop file upload
- Multiple file type support
- File size validation (10MB limit)
- Real-time upload progress
- Document metadata display

### User Interface
- Modern gradient design
- Responsive layout
- Smooth animations
- Loading states
- Error handling
- Success notifications

## 🛡️ Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication
- **CORS Protection** - Cross-origin security
- **File Validation** - Type and size checks
- **Input Sanitization** - XSS protection
- **Rate Limiting** - API protection

## 📊 Performance

- **Fast Loading** - Optimized bundle size
- **Efficient Queries** - MongoDB indexing
- **Caching** - Browser caching
- **Lazy Loading** - Component optimization
- **CDN Ready** - Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/bastingg05/docuvault-v2/issues) page
2. Review the deployment logs
3. Verify your MongoDB connection
4. Check the browser console for errors

## 🔮 Roadmap

- [ ] File sharing between users
- [ ] Document versioning
- [ ] Advanced search functionality
- [ ] Document categories and tags
- [ ] Bulk file operations
- [ ] File preview generation
- [ ] API rate limiting
- [ ] User roles and permissions

---

**Built with ❤️ by Bastin**
