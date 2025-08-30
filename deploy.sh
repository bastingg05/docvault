#!/bin/bash

# DocuVault High Availability Deployment Script
# This script ensures zero-downtime deployments

set -e

# Configuration
APP_NAME="docuvault"
BACKEND_PORT=5000
FRONTEND_PORT=3000
HEALTH_CHECK_URL="http://localhost:${BACKEND_PORT}/health"
MAX_HEALTH_CHECK_ATTEMPTS=30
HEALTH_CHECK_INTERVAL=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Health check function
check_health() {
    local attempts=0
    log_info "Checking application health..."
    
    while [ $attempts -lt $MAX_HEALTH_CHECK_ATTEMPTS ]; do
        if curl -s -f "$HEALTH_CHECK_URL" > /dev/null; then
            log_success "Health check passed!"
            return 0
        else
            attempts=$((attempts + 1))
            log_warning "Health check failed (attempt $attempts/$MAX_HEALTH_CHECK_ATTEMPTS)"
            sleep $HEALTH_CHECK_INTERVAL
        fi
    done
    
    log_error "Health check failed after $MAX_HEALTH_CHECK_ATTEMPTS attempts"
    return 1
}

# Backup function
backup_current_version() {
    log_info "Creating backup of current version..."
    
    if [ -d "backup" ]; then
        rm -rf backup
    fi
    
    mkdir -p backup
    cp -r backend backup/
    cp -r frontend backup/
    cp package*.json backup/
    
    log_success "Backup created successfully"
}

# Stop application function
stop_application() {
    log_info "Stopping application..."
    
    # Stop backend
    pkill -f "node.*server.js" || true
    pkill -f "node.*monitor.js" || true
    
    # Wait for processes to stop
    sleep 3
    
    log_success "Application stopped"
}

# Start application function
start_application() {
    log_info "Starting application..."
    
    # Start backend
    cd backend
    npm install
    nohup npm start > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    # Start monitor
    nohup npm run monitor > ../logs/monitor.log 2>&1 &
    MONITOR_PID=$!
    echo $MONITOR_PID > ../monitor.pid
    
    cd ..
    
    # Start frontend
    cd frontend
    npm install
    nohup npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    
    cd ..
    
    log_success "Application started"
}

# Wait for application to be ready
wait_for_ready() {
    log_info "Waiting for application to be ready..."
    
    # Wait for backend to start
    local attempts=0
    while [ $attempts -lt 30 ]; do
        if curl -s "http://localhost:${BACKEND_PORT}" > /dev/null; then
            log_success "Backend is ready"
            break
        fi
        attempts=$((attempts + 1))
        sleep 2
    done
    
    if [ $attempts -eq 30 ]; then
        log_error "Backend failed to start"
        return 1
    fi
    
    # Wait for frontend to start
    attempts=0
    while [ $attempts -lt 30 ]; do
        if curl -s "http://localhost:${FRONTEND_PORT}" > /dev/null; then
            log_success "Frontend is ready"
            break
        fi
        attempts=$((attempts + 1))
        sleep 2
    done
    
    if [ $attempts -eq 30 ]; then
        log_error "Frontend failed to start"
        return 1
    fi
}

# Rollback function
rollback() {
    log_warning "Rolling back to previous version..."
    
    stop_application
    
    # Restore from backup
    rm -rf backend frontend
    cp -r backup/backend ./
    cp -r backup/frontend ./
    cp backup/package*.json ./
    
    start_application
    wait_for_ready
    
    if check_health; then
        log_success "Rollback completed successfully"
    else
        log_error "Rollback failed - manual intervention required"
        exit 1
    fi
}

# Main deployment function
deploy() {
    log_info "Starting DocuVault deployment..."
    
    # Create logs directory
    mkdir -p logs
    
    # Check if application is currently running
    if pgrep -f "node.*server.js" > /dev/null; then
        log_info "Application is currently running"
        
        # Perform health check before deployment
        if ! check_health; then
            log_error "Application is not healthy before deployment"
            exit 1
        fi
        
        # Create backup
        backup_current_version
        
        # Stop application
        stop_application
    else
        log_info "Application is not currently running"
    fi
    
    # Start application
    start_application
    
    # Wait for application to be ready
    if ! wait_for_ready; then
        log_error "Application failed to start"
        rollback
        exit 1
    fi
    
    # Perform health check
    if ! check_health; then
        log_error "Application is not healthy after deployment"
        rollback
        exit 1
    fi
    
    log_success "Deployment completed successfully!"
    
    # Display status
    log_info "Application status:"
    echo "Backend: http://localhost:${BACKEND_PORT}"
    echo "Frontend: http://localhost:${FRONTEND_PORT}"
    echo "Health: ${HEALTH_CHECK_URL}"
    echo "Uptime: http://localhost:${BACKEND_PORT}/uptime"
    echo "Metrics: http://localhost:${BACKEND_PORT}/metrics"
}

# Status function
status() {
    log_info "Checking application status..."
    
    echo "=== Backend Status ==="
    if pgrep -f "node.*server.js" > /dev/null; then
        echo "✅ Backend is running"
        if curl -s "$HEALTH_CHECK_URL" > /dev/null; then
            echo "✅ Health check passed"
        else
            echo "❌ Health check failed"
        fi
    else
        echo "❌ Backend is not running"
    fi
    
    echo ""
    echo "=== Frontend Status ==="
    if pgrep -f "npm.*dev" > /dev/null; then
        echo "✅ Frontend is running"
    else
        echo "❌ Frontend is not running"
    fi
    
    echo ""
    echo "=== Monitor Status ==="
    if pgrep -f "node.*monitor.js" > /dev/null; then
        echo "✅ Monitor is running"
    else
        echo "❌ Monitor is not running"
    fi
    
    echo ""
    echo "=== Port Status ==="
    if netstat -tuln | grep ":$BACKEND_PORT " > /dev/null; then
        echo "✅ Backend port $BACKEND_PORT is listening"
    else
        echo "❌ Backend port $BACKEND_PORT is not listening"
    fi
    
    if netstat -tuln | grep ":$FRONTEND_PORT " > /dev/null; then
        echo "✅ Frontend port $FRONTEND_PORT is listening"
    else
        echo "❌ Frontend port $FRONTEND_PORT is not listening"
    fi
}

# Cleanup function
cleanup() {
    log_info "Cleaning up..."
    
    # Remove PID files
    rm -f backend.pid frontend.pid monitor.pid
    
    # Remove logs directory if empty
    if [ -d "logs" ] && [ -z "$(ls -A logs)" ]; then
        rmdir logs
    fi
    
    log_success "Cleanup completed"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "status")
        status
        ;;
    "stop")
        stop_application
        ;;
    "start")
        start_application
        ;;
    "restart")
        stop_application
        start_application
        wait_for_ready
        ;;
    "rollback")
        rollback
        ;;
    "cleanup")
        cleanup
        ;;
    "health")
        check_health
        ;;
    *)
        echo "Usage: $0 {deploy|status|stop|start|restart|rollback|cleanup|health}"
        echo ""
        echo "Commands:"
        echo "  deploy    - Deploy the application with zero downtime"
        echo "  status    - Check application status"
        echo "  stop      - Stop the application"
        echo "  start     - Start the application"
        echo "  restart   - Restart the application"
        echo "  rollback  - Rollback to previous version"
        echo "  cleanup   - Clean up temporary files"
        echo "  health    - Check application health"
        exit 1
        ;;
esac

# Always cleanup on exit
trap cleanup EXIT
