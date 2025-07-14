#!/bin/bash
# CAD Leadership Dashboard Launcher
# Mission-Critical Executable

echo "🚀 Starting CAD Leadership Dashboard..."
echo "======================================="

# Check if executable exists
if [ ! -f "./dist/app" ]; then
    echo "❌ Executable not found. Building..."
    npm run build-linux
fi

# Launch the mission-critical dashboard
echo "🎯 Launching mission-critical CAD Leadership Dashboard..."
./dist/app &

PID=$!
echo "✅ Dashboard launched with PID: $PID"
echo "📊 Dashboard URL: http://localhost:3000"
echo "🔍 Health Check: http://localhost:3000/api/health"
echo ""
echo "To stop the dashboard:"
echo "kill $PID"
