@echo off
echo 🚀 Starting CAD Leadership Dashboard...
echo =======================================

echo Checking Node.js installation...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.
echo 🎯 Launching CAD Leadership Dashboard...
echo.
echo 📊 Dashboard will be available at: http://localhost:3000/
echo 🔍 Health Check: http://localhost:3000/api/health
echo 🎯 Point Cloud Viewer at: http://localhost:3000/pointcloud.html
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
