# DocuVault

A modern document management system built with Node.js backend and React frontend.

## Features

- User authentication and authorization
- Document upload and management
- Secure file storage
- Modern responsive UI
- RESTful API backend

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT authentication
- Multer for file uploads

### Frontend
- React
- Vite
- Modern CSS
- Responsive design

## Project Structure

```
docuvault/
├── backend/          # Node.js backend server
│   ├── config/       # Database configuration
│   ├── middleware/   # Authentication middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── uploads/      # File upload directory
│   └── utils/        # Utility functions
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── pages/    # React components
│   │   ├── services/ # API service functions
│   │   └── assets/   # Static assets
│   └── public/       # Public assets
└── uploads/          # Global upload directory
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-github-repo-url>
cd docuvault
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add your MongoDB connection string and JWT secret

5. Start the backend server:
```bash
cd ../backend
npm start
```

6. Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

## API Endpoints

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/documents` - Get user documents
- `POST /api/documents` - Upload new document
- `DELETE /api/documents/:id` - Delete document

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
