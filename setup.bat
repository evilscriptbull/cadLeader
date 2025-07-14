@echo off
echo ========================================
echo CAD Leader - Quick Setup Script
echo ========================================
echo.

echo Checking Node.js installation...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

echo.
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo Starting CAD Leader application...
echo.
echo 📊 Dashboard will be available at: http://localhost:3000/
echo 🎯 Point Cloud Viewer at: http://localhost:3000/pointcloud.html
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
