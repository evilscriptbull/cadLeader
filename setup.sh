#!/bin/bash
echo "========================================"
echo "CAD Leader - Quick Setup Script"
echo "========================================"
echo ""

echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found"
node --version

echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "Starting CAD Leader application..."
echo ""
echo "📊 Dashboard will be available at: http://localhost:3000/"
echo "🎯 Point Cloud Viewer at: http://localhost:3000/pointcloud.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
