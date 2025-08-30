# DocuVault - High Availability Document Management System 🚀

DocuVault is a secure, high-availability document management system designed to achieve **99.9% uptime** with comprehensive monitoring, auto-recovery, and offline capabilities.

## ✨ Features

### 🔒 Security & Authentication
- JWT-based authentication
- Secure document storage
- User role management
- Encrypted data transmission

### 📱 Progressive Web App (PWA)
- Offline functionality
- Service worker caching
- App-like experience
- Push notifications

### 🚀 High Availability (99.9% Uptime)
- Real-time health monitoring
- Auto-recovery mechanisms
- Graceful error handling
- Performance metrics tracking
- Zero-downtime deployments

### 📊 Monitoring & Analytics
- Live health dashboard
- Uptime tracking
- Performance metrics
- Error rate monitoring
- Memory usage tracking

## 🏗️ Architecture

```
DocuVault/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication & validation
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── server.js           # Main server with health endpoints
│   └── monitor.js          # Health monitoring service
├── frontend/               # React PWA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main application
│   ├── public/
│   │   ├── sw.js           # Service worker
│   │   ├── manifest.json   # PWA manifest
│   │   └── offline.html    # Offline page
│   └── package.json
├── deploy.sh               # Zero-downtime deployment script
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd docuvault
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Setup
Create `.env` file in backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/docuvault
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=5000
```

### 3. Start the Application
```bash
# Start backend with monitoring
cd backend
npm run monitor

# Start frontend (in new terminal)
cd frontend
npm run dev
```

## 📊 Health Monitoring

### Backend Health Endpoints
- **`/health`** - Basic health status
- **`/health/detailed`** - Comprehensive health data
- **`/uptime`** - Uptime statistics
- **`/metrics`** - Prometheus-style metrics
- **`/health/recover`** - Trigger auto-recovery

### Frontend Health Dashboard
- Real-time system status
- Connection quality monitoring
- Uptime tracking
- Health check history
- Performance metrics

## 🔧 Deployment

### Zero-Downtime Deployment
```bash
# Make script executable
chmod +x deploy.sh

# Deploy with zero downtime
./deploy.sh deploy

# Check status
./deploy.sh status

# Rollback if needed
./deploy.sh rollback
```

### Deployment Commands
- `./deploy.sh deploy` - Deploy application
- `./deploy.sh status` - Check application status
- `./deploy.sh stop` - Stop application
- `./deploy.sh start` - Start application
- `./deploy.sh restart` - Restart application
- `./deploy.sh rollback` - Rollback to previous version
- `./deploy.sh health` - Health check

## 📈 Monitoring & Maintenance

### Backend Monitoring
```bash
# Start monitoring service
cd backend
npm run monitor

# Check health
npm run health

# View uptime
npm run uptime

# View metrics
npm run metrics

# Trigger recovery
npm run recover
```

### Health Check Intervals
- **Health Check**: Every 30 seconds
- **Heartbeat**: Every 60 seconds
- **Metrics Update**: Every 10 seconds
- **Auto-recovery**: After 3 consecutive failures

### Performance Thresholds
- **Response Time**: < 300ms (excellent), < 1000ms (good)
- **Error Rate**: < 5% (healthy), < 10% (degraded)
- **Memory Usage**: < 500MB (warning threshold)
- **Uptime Target**: 99.9%

## 🛡️ High Availability Features

### 1. Auto-Recovery
- Automatic service restart on failures
- Health check monitoring
- Graceful error handling
- Memory leak detection

### 2. Offline Capabilities
- Service worker caching
- Offline document viewing
- Background sync
- Progressive enhancement

### 3. Load Balancing Ready
- Stateless API design
- Health check endpoints
- Metrics for load balancers
- Graceful shutdown handling

### 4. Monitoring & Alerting
- Real-time health dashboard
- Performance metrics
- Error tracking
- Uptime monitoring

## 🔍 Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check logs
tail -f logs/backend.log

# Check health
curl http://localhost:5000/health

# Restart service
./deploy.sh restart
```

#### Health Check Failures
```bash
# Check monitor logs
tail -f logs/monitor.log

# Force health check
cd backend && npm run health

# Reset failure count
pkill -SIGUSR2 -f monitor.js
```

#### High Memory Usage
```bash
# Check memory usage
curl http://localhost:5000/health/detailed

# Trigger garbage collection
curl -X POST http://localhost:5000/health/recover

# Restart if needed
./deploy.sh restart
```

### Log Files
- `logs/backend.log` - Backend application logs
- `logs/monitor.log` - Health monitoring logs
- `logs/frontend.log` - Frontend development logs
- `backend/monitor.log` - Monitor service logs
- `backend/metrics.json` - Performance metrics

## 📱 PWA Features

### Service Worker
- Automatic caching
- Offline functionality
- Background sync
- Push notifications

### Installation
- Add to home screen
- Offline access
- App-like experience
- Automatic updates

## 🔐 Security Features

- JWT authentication
- CORS protection
- Input validation
- Secure file uploads
- Rate limiting ready

## 📊 Performance Metrics

### Backend Metrics
- Request count
- Error rate
- Response time
- Memory usage
- Uptime percentage

### Frontend Metrics
- Connection quality
- Health status
- Offline time
- Cache hit rate

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://production-db:27017/docuvault
JWT_SECRET=production-secret-key
PORT=5000
HEALTH_CHECK_URL=http://your-domain.com/health
```

### Process Management
```bash
# Use PM2 for production
npm install -g pm2
pm2 start backend/server.js --name "docuvault-backend"
pm2 start backend/monitor.js --name "docuvault-monitor"
pm2 startup
pm2 save
```

### Load Balancer Configuration
- Health check endpoint: `/health`
- Expected response: 200 OK
- Check interval: 30 seconds
- Failure threshold: 3
- Success threshold: 2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the logs
- Use the health endpoints
- Check the monitoring dashboard

---

**Built with ❤️ for high availability and reliability**
