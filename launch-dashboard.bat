@echo off
echo 🚀 Starting CAD Leadership Dashboard...
echo =======================================

if not exist "dist\app.exe" (
    echo ❌ Executable not found. Please run: npm run build-win
    pause
    exit /b 1
)

echo 🎯 Launching mission-critical CAD Leadership Dashboard...
start "CAD Dashboard" dist\app.exe

echo ✅ Dashboard launched successfully
echo 📊 Dashboard URL: http://localhost:3000
echo 🔍 Health Check: http://localhost:3000/api/health
echo.
echo Press any key to exit...
pause > nul
