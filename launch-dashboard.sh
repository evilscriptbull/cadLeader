#!/bin/bash
# CAD Leadership Dashboard Launcher

echo "🚀 Starting CAD Leadership Dashboard..."
echo "======================================="

echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found"
node --version

echo ""
echo "🎯 Launching CAD Leadership Dashboard..."
echo ""
echo "📊 Dashboard will be available at: http://localhost:3000/"
echo "🔍 Health Check: http://localhost:3000/api/health"
echo "🎯 Point Cloud Viewer at: http://localhost:3000/pointcloud.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
