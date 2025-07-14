# CAD Leader - Repository Structure

This document outlines the organized structure of the CAD Leader point cloud viewer project.

## 📁 Directory Structure

```
cadLeader/
├── 📄 app.js                 # Main Node.js server application
├── 📄 package.json          # Dependencies and project configuration
├── 📄 readme.md             # Project documentation
├── 📄 STRUCTURE.md          # This file - repository structure guide
├── 📄 .gitignore            # Git ignore patterns
│
├── 📂 public/               # Static web files (served to browser)
│   ├── 📄 index.html        # Main dashboard page
│   ├── 📄 pointcloud.html   # Enhanced point cloud viewer
│   └── 📂 js/               # Client-side JavaScript
│       ├── 📄 pointcloud-viewer.js    # Enhanced 3D viewer with controls
│       └── 📄 simple-test.js          # Simple 2D test viewer
│
├── 📂 data/                 # Data files and assets
│   ├── 📂 sample-files/     # Sample point cloud and terrain data
│   │   ├── 📄 dem.tif       # Digital elevation model
│   │   └── 📄 *.laz         # Point cloud files
│   └── 📂 reports/          # Analysis reports and documentation
│       └── 📄 *.pdf         # Survey accuracy reports
│
├── 📂 scripts/              # Utility scripts
│   └── 📄 health-check.js   # Server health monitoring
│
├── 📂 tools/                # Development and testing tools
│   ├── 📂 testing/          # Test files and utilities
│   │   ├── 📄 test-*.js     # Various test scripts
│   │   └── 📄 *-test.js     # Testing utilities
│   └── 📂 validation/       # Deployment validation tools
│       ├── 📄 validate-deployment.js
│       └── 📄 verify-visual-data.js
│
├── 📂 docs/                 # Documentation
│   ├── 📄 LEADERSHIP_GUIDE.md
│   ├── 📄 POINTCLOUD_VIEWER.md
│   └── 📄 QUICK_REFERENCE.md
│
├── 📂 logs/                 # Application logs
│   ├── 📄 combined.log
│   └── 📄 error.log
│
├── 📂 uploads/              # User uploaded files
│   └── 📂 drone-data/       # Drone survey data
│
└── 📂 temp/                 # Temporary files (not committed)
    ├── 📄 *.log             # Temporary log files
    ├── 📄 debug-test.html   # Development test files
    └── 📄 launch-dashboard.* # Legacy launch scripts
```

## 🎯 Key Components

### **Core Application**
- `app.js` - Main Express server with enhanced terrain generation
- `public/pointcloud.html` - Primary point cloud viewer interface
- `public/js/pointcloud-viewer.js` - Enhanced 3D viewer with mouse controls

### **Data Management**
- `data/sample-files/` - Point cloud data (LAZ files) and terrain models
- `data/reports/` - Survey accuracy and analysis reports
- `uploads/drone-data/` - User-uploaded survey data

### **Development Tools**
- `tools/testing/` - Test scripts for functionality validation
- `tools/validation/` - Deployment and visual data verification
- `temp/` - Temporary files and legacy scripts

## 🚀 Quick Start

1. **Install dependencies**: `npm install`
2. **Start server**: `npm start` or `node app.js`
3. **Open viewer**: http://localhost:3000/pointcloud.html

## 📝 Recent Improvements

- ✅ Enhanced mouse controls (pan, zoom, rotate)
- ✅ Realistic terrain generation with elevation features
- ✅ Organized file structure with proper directories
- ✅ Removed deprecated files and scripts
- ✅ Improved point cloud visualization with elevation-based coloring

## 🔧 Maintenance

- **Logs**: Check `logs/` directory for application logs
- **Testing**: Run tests from `tools/testing/` directory
- **Cleanup**: Temporary files in `temp/` can be safely removed
