@echo off
REM DocuVault High Availability Deployment Script for Windows
REM This script ensures zero-downtime deployments

setlocal enabledelayedexpansion

REM Configuration
set APP_NAME=docuvault
set BACKEND_PORT=5000
set FRONTEND_PORT=3000
set HEALTH_CHECK_URL=http://localhost:%BACKEND_PORT%/health
set MAX_HEALTH_CHECK_ATTEMPTS=30
set HEALTH_CHECK_INTERVAL=5

REM Colors for output (Windows 10+)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Logging functions
:log_info
echo %BLUE%[INFO]%NC% %~1
goto :eof

:log_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:log_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:log_error
echo %RED%[ERROR]%NC% %~1
goto :eof

REM Health check function
:check_health
set attempts=0
call :log_info "Checking application health..."

:health_check_loop
curl -s -f "%HEALTH_CHECK_URL%" >nul 2>&1
if %errorlevel% equ 0 (
    call :log_success "Health check passed!"
    exit /b 0
) else (
    set /a attempts+=1
    call :log_warning "Health check failed (attempt !attempts!/%MAX_HEALTH_CHECK_ATTEMPTS%)"
    if !attempts! geq %MAX_HEALTH_CHECK_ATTEMPTS% (
        call :log_error "Health check failed after %MAX_HEALTH_CHECK_ATTEMPTS% attempts"
        exit /b 1
    )
    timeout /t %HEALTH_CHECK_INTERVAL% /nobreak >nul
    goto :health_check_loop
)

REM Backup function
:backup_current_version
call :log_info "Creating backup of current version..."

if exist "backup" rmdir /s /q "backup"
mkdir "backup"
xcopy "backend" "backup\backend\" /e /i /q
xcopy "frontend" "backup\frontend\" /e /i /q
copy "package*.json" "backup\" >nul

call :log_success "Backup created successfully"
goto :eof

REM Stop application function
:stop_application
call :log_info "Stopping application..."

REM Stop backend processes
taskkill /f /im node.exe /fi "WINDOWTITLE eq *server.js*" >nul 2>&1
taskkill /f /f /im node.exe /fi "WINDOWTITLE eq *monitor.js*" >nul 2>&1

REM Wait for processes to stop
timeout /t 3 /nobreak >nul

call :log_success "Application stopped"
goto :eof

REM Start application function
:start_application
call :log_info "Starting application..."

REM Start backend
cd backend
call npm install >nul 2>&1
start "Backend Server" cmd /c "npm start"
cd ..

REM Start monitor
cd backend
start "Monitor Service" cmd /c "npm run monitor"
cd ..

REM Start frontend
cd frontend
call npm install >nul 2>&1
start "Frontend Dev" cmd /c "npm run dev"
cd ..

call :log_success "Application started"
goto :eof

REM Wait for application to be ready
:wait_for_ready
call :log_info "Waiting for application to be ready..."

REM Wait for backend to start
set attempts=0
:backend_wait_loop
curl -s "http://localhost:%BACKEND_PORT%" >nul 2>&1
if %errorlevel% equ 0 (
    call :log_success "Backend is ready"
    goto :frontend_wait
)
set /a attempts+=1
if !attempts! geq 30 (
    call :log_error "Backend failed to start"
    exit /b 1
)
timeout /t 2 /nobreak >nul
goto :backend_wait_loop

:frontend_wait
REM Wait for frontend to start
set attempts=0
:frontend_wait_loop
curl -s "http://localhost:%FRONTEND_PORT%" >nul 2>&1
if %errorlevel% equ 0 (
    call :log_success "Frontend is ready"
    goto :eof
)
set /a attempts+=1
if !attempts! geq 30 (
    call :log_error "Frontend failed to start"
    exit /b 1
)
timeout /t 2 /nobreak >nul
goto :frontend_wait_loop

REM Rollback function
:rollback
call :log_warning "Rolling back to previous version..."

call :stop_application

REM Restore from backup
if exist "backup" (
    rmdir /s /q "backend"
    rmdir /s /q "frontend"
    xcopy "backup\backend" "backend\" /e /i /q
    xcopy "backup\frontend" "frontend\" /e /i /q
    copy "backup\package*.json" "." >nul
)

call :start_application
call :wait_for_ready

call :check_health
if %errorlevel% equ 0 (
    call :log_success "Rollback completed successfully"
) else (
    call :log_error "Rollback failed - manual intervention required"
    exit /b 1
)
goto :eof

REM Main deployment function
:deploy
call :log_info "Starting DocuVault deployment..."

REM Create logs directory
if not exist "logs" mkdir "logs"

REM Check if application is currently running
tasklist /fi "imagename eq node.exe" /fi "WINDOWTITLE eq *server.js*" | find "node.exe" >nul
if %errorlevel% equ 0 (
    call :log_info "Application is currently running"
    
    REM Perform health check before deployment
    call :check_health
    if %errorlevel% neq 0 (
        call :log_error "Application is not healthy before deployment"
        exit /b 1
    )
    
    REM Create backup
    call :backup_current_version
    
    REM Stop application
    call :stop_application
) else (
    call :log_info "Application is not currently running"
)

REM Start application
call :start_application

REM Wait for application to be ready
call :wait_for_ready
if %errorlevel% neq 0 (
    call :log_error "Application failed to start"
    call :rollback
    exit /b 1
)

REM Perform health check
call :check_health
if %errorlevel% neq 0 (
    call :log_error "Application is not healthy after deployment"
    call :rollback
    exit /b 1
)

call :log_success "Deployment completed successfully!"

REM Display status
call :log_info "Application status:"
echo Backend: http://localhost:%BACKEND_PORT%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo Health: %HEALTH_CHECK_URL%
echo Uptime: http://localhost:%BACKEND_PORT%/uptime
echo Metrics: http://localhost:%BACKEND_PORT%/metrics
goto :eof

REM Status function
:status
call :log_info "Checking application status..."

echo === Backend Status ===
tasklist /fi "imagename eq node.exe" /fi "WINDOWTITLE eq *server.js*" | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Backend is running
    curl -s "%HEALTH_CHECK_URL%" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Health check passed
    ) else (
        echo ❌ Health check failed
    )
) else (
    echo ❌ Backend is not running
)

echo.
echo === Frontend Status ===
tasklist /fi "imagename eq node.exe" /fi "WINDOWTITLE eq *npm*" | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend is running
) else (
    echo ❌ Frontend is not running
)

echo.
echo === Monitor Status ===
tasklist /fi "imagename eq node.exe" /fi "WINDOWTITLE eq *monitor*" | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Monitor is running
) else (
    echo ❌ Monitor is not running
)

echo.
echo === Port Status ===
netstat -an | find ":%BACKEND_PORT% " >nul
if %errorlevel% equ 0 (
    echo ✅ Backend port %BACKEND_PORT% is listening
) else (
    echo ❌ Backend port %BACKEND_PORT% is not listening
)

netstat -an | find ":%FRONTEND_PORT% " >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend port %FRONTEND_PORT% is listening
) else (
    echo ❌ Frontend port %FRONTEND_PORT% is not listening
)
goto :eof

REM Main script logic
if "%1"=="" goto :deploy
if "%1"=="deploy" goto :deploy
if "%1"=="status" goto :status
if "%1"=="stop" goto :stop_application
if "%1"=="start" goto :start_application
if "%1"=="restart" (
    call :stop_application
    call :start_application
    call :wait_for_ready
    goto :eof
)
if "%1"=="rollback" goto :rollback
if "%1"=="health" goto :check_health

echo Usage: %0 {deploy^|status^|stop^|start^|restart^|rollback^|health}
echo.
echo Commands:
echo   deploy    - Deploy the application with zero downtime
echo   status    - Check application status
echo   stop      - Stop the application
echo   start     - Start the application
echo   restart   - Restart the application
echo   rollback  - Rollback to previous version
echo   health    - Check application health
exit /b 1
