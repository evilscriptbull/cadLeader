# CAD Leader - Point Cloud Viewer & Leadership Dashboard

> **Real-time drone data processing and interactive 3D point cloud visualization for CAD project leadership**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

### Installation

#### For Windows Users

1. **Clone the repository**
   ```cmd
   git clone https://github.com/evilscriptbull/cadLeader.git
   cd cadLeader
   ```

2. **Install dependencies**
   ```cmd
   npm install
   ```

3. **Start the application**
   ```cmd
   npm start
   ```
   
   **Alternative**: Use the setup script
   ```cmd
   setup.bat
   ```

#### For Linux/macOS/WSL Users

1. **Clone the repository**
   ```bash
   git clone https://github.com/evilscriptbull/cadLeader.git
   cd cadLeader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```
   
   **Alternative**: Use the setup script
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

#### For WSL (Windows Subsystem for Linux) Users

1. **Open WSL terminal** (Ubuntu recommended)

2. **Clone the repository**
   ```bash
   git clone https://github.com/evilscriptbull/cadLeader.git
   cd cadLeader
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access from Windows browser**
   - The application will be available at `http://localhost:3000/`
   - WSL automatically forwards the port to Windows

### Verify Installation

After starting the application, you should see:
```
🚀 CAD Leadership Dashboard OPERATIONAL on port 3000
📊 Dashboard: http://localhost:3000
🔍 Health Check: http://localhost:3000/api/health
```

### Access Points
- **Main Dashboard**: http://localhost:3000/
- **Enhanced Point Cloud Viewer**: http://localhost:3000/pointcloud.html
- **Health Check**: http://localhost:3000/api/health

## 🎯 Features

### ✨ **Enhanced Point Cloud Viewer**
- **Interactive 3D Visualization** with Three.js
- **Mouse Controls**: Pan, zoom, rotate with smooth animations
- **Realistic Terrain Generation**: Hills, valleys, ridges, plateaus, and water bodies
- **Elevation-based Coloring**: Visual height representation
- **Real-time Data Processing**: Live point cloud data from LAZ files

### 📊 **Leadership Dashboard**
- **Real-time Project Status** updates
- **Key Performance Indicators** (KPIs)
- **Progress Tracking** and forecasting
- **Change Detection** between surveys
- **Automated Quality Assurance** reporting

### 🔧 **Technical Capabilities**
- **LAZ/LAS File Processing** - Point cloud data analysis
- **DEM/TIF Support** - Digital elevation models
- **RESTful API** - For integration with other systems
- **Scalable Architecture** - Express.js backend with modular design
- **Security Features** - Content Security Policy (CSP) and secure headers

## 🖥️ Usage

### Basic Navigation
- **Left Mouse Drag**: Pan the view
- **Right Mouse Drag**: Rotate the view
- **Mouse Wheel**: Zoom in/out
- **Point Cloud Data**: Automatically loads realistic terrain with elevation features

### API Endpoints
- `GET /api/health` - Server health status
- `GET /api/pointcloud/data` - Point cloud data with terrain features
- `GET /api/leadership/report` - Leadership analytics report
- `POST /api/upload` - Upload new LAZ/TIF files

## 📁 Project Structure

```
cadLeader/
├── 📄 app.js                 # Main Node.js server application
├── 📄 package.json          # Dependencies and scripts
├── 📄 readme.md             # This file
├── 📄 STRUCTURE.md          # Detailed repository structure
│
├── 📂 public/               # Web interface files
│   ├── 📄 index.html        # Main dashboard
│   ├── 📄 pointcloud.html   # Enhanced 3D point cloud viewer
│   └── 📂 js/               # Client-side JavaScript
│       ├── 📄 pointcloud-viewer.js    # Enhanced 3D viewer with controls
│       └── 📄 simple-test.js          # Simple 2D test viewer
│
├── 📂 data/                 # Data files and assets
│   ├── 📂 sample-files/     # Sample LAZ and DEM files
│   └── 📂 reports/          # Survey accuracy reports
│
├── 📂 tools/                # Development and testing tools
│   ├── 📂 testing/          # Test scripts and utilities
│   └── 📂 validation/       # Deployment validation tools
│
├── 📂 docs/                 # Documentation
│   ├── 📄 USE_CASES.md      # Detailed system use cases
│   ├── 📄 LEADERSHIP_GUIDE.md
│   └── 📄 POINTCLOUD_VIEWER.md
│
├── 📂 scripts/              # Utility scripts
├── 📂 logs/                 # Application logs
├── 📂 uploads/              # User uploaded files
└── 📂 temp/                 # Temporary files (not committed)
```

## 🔧 Development

### Running Tests
```bash
# Run comprehensive test suite
npm test

# Or run directly (Linux/macOS/WSL)
bash tools/testing/comprehensive-test.sh

# Windows alternative
# Use Git Bash or WSL to run the test script
```

### Health Check
```bash
# Check server health
curl http://localhost:3000/api/health

# Test point cloud data
curl http://localhost:3000/api/pointcloud/data?limit=10

# Windows alternative (if curl not available)
# Open browser and navigate to http://localhost:3000/api/health
```

### Development Mode
```bash
# Start with auto-reload (requires nodemon)
npm run dev

# Install nodemon globally if not available
npm install -g nodemon

# Check application logs
# Linux/macOS/WSL:
tail -f logs/combined.log

# Windows:
type logs\combined.log
```

### Available Scripts
- `npm start` - Start the application
- `npm run dev` - Start in development mode with auto-reload
- `npm test` - Run comprehensive test suite
- `npm run health` - Quick health check
- `npm run setup` - Complete setup process
- `npm run build` - Build for production (all platforms)
- `npm run build-win` - Build for Windows
- `npm run build-linux` - Build for Linux

### Platform-Specific Notes

#### **Windows Development**
- Use PowerShell or Command Prompt
- Git Bash recommended for bash scripts
- Visual Studio Code with WSL extension for best experience

#### **Linux/macOS Development**
- Standard terminal works perfectly
- All bash scripts run natively

#### **WSL Development**
- Best of both worlds - Linux tools with Windows integration
- Files accessible from Windows Explorer at `\\wsl$\Ubuntu\home\[username]\Code\cadLeader`
- Use VS Code with WSL extension for seamless development

## 📋 System Requirements

### **Minimum Requirements**
- **Node.js**: v18.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB for application, 2GB+ for point cloud data
- **Network**: Port 3000 available for local development

### **Platform Support**

#### **Windows**
- **OS**: Windows 10/11 (64-bit)
- **Node.js**: Download from [nodejs.org](https://nodejs.org/)
- **Terminal**: Command Prompt, PowerShell, or Git Bash
- **Browser**: Chrome, Firefox, Edge (latest versions)

#### **Linux**
- **OS**: Ubuntu 18.04+, CentOS 7+, or equivalent
- **Node.js**: Install via package manager or [nodejs.org](https://nodejs.org/)
- **Terminal**: Any modern terminal
- **Browser**: Chrome, Firefox (latest versions)

#### **macOS**
- **OS**: macOS 10.15+ (Catalina or newer)
- **Node.js**: Install via Homebrew or [nodejs.org](https://nodejs.org/)
- **Terminal**: Terminal.app or iTerm2
- **Browser**: Safari, Chrome, Firefox (latest versions)

#### **WSL (Windows Subsystem for Linux)**
- **OS**: Windows 10/11 with WSL 2 enabled
- **Distribution**: Ubuntu 20.04+ recommended
- **Node.js**: Install in WSL environment
- **Access**: Use Windows browser to access `http://localhost:3000/`

### **Performance Requirements**
- Data processing: < 5 minutes for standard survey
- Dashboard updates: < 2 minutes after processing
- System availability: 99.9% uptime
- Concurrent users: Support 100+ simultaneous users

### **Data Requirements**
- **Input formats**: .laz, .tif files
- **Output formats**: JSON, HTML, interactive 3D
- **Storage**: Scalable with organized directory structure
- **Security**: CSP headers and secure data handling

### **Network Requirements**
- **Development**: Localhost access only
- **Production**: Configurable port (default 3000)
- **Firewall**: Allow inbound connections on configured port
- **CORS**: Configurable for cross-origin requests

## 📚 Documentation

- **[System Use Cases](docs/USE_CASES.md)** - Detailed software requirements and user stories
- **[Repository Structure](STRUCTURE.md)** - Complete file organization guide
- **[Leadership Guide](docs/LEADERSHIP_GUIDE.md)** - Executive dashboard usage
- **[Point Cloud Viewer Guide](docs/POINTCLOUD_VIEWER.md)** - 3D viewer documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

#### **Server won't start**

**Windows:**
- Check if port 3000 is available: `netstat -an | findstr :3000`
- Verify Node.js version: `node --version` (should be 18+)
- Try running as administrator if permissions issues occur

**Linux/macOS/WSL:**
- Check if port 3000 is available: `lsof -i :3000`
- Verify Node.js version: `node --version` (should be 18+)
- Kill any existing processes: `pkill -f "node app.js"`

#### **Point cloud not displaying**
- Check browser console for errors (F12 → Console)
- Verify LAZ files are in `data/sample-files/` directory
- Test API endpoint: 
  - **Windows**: `curl http://localhost:3000/api/pointcloud/data` (if curl installed)
  - **Linux/macOS/WSL**: `curl http://localhost:3000/api/pointcloud/data`
- Try refreshing the browser page

#### **Mouse controls not working**
- Ensure JavaScript is enabled in browser
- Check for Content Security Policy errors in browser console
- Try refreshing the page
- Test with different browser (Chrome, Firefox, Edge)

#### **WSL Specific Issues**
- If you can't access from Windows browser, check WSL networking:
  ```bash
  # Check if service is running
  ps aux | grep "node app.js"
  
  # Check port binding
  netstat -tlnp | grep :3000
  ```
- Try accessing via WSL IP address if localhost doesn't work:
  ```bash
  # Find WSL IP
  ip addr show eth0
  # Then access via http://[WSL_IP]:3000/
  ```

#### **Installation Issues**

**Node.js not found:**
- **Windows**: Download from [nodejs.org](https://nodejs.org/) and install
- **Linux**: `sudo apt update && sudo apt install nodejs npm`
- **macOS**: `brew install node` (requires Homebrew)
- **WSL**: `sudo apt update && sudo apt install nodejs npm`

**npm install fails:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules` (Linux/macOS) or `rmdir /s node_modules` (Windows)
- Reinstall: `npm install`

**Permission errors:**
- **Windows**: Run Command Prompt as Administrator
- **Linux/macOS/WSL**: Don't use sudo with npm install in user directories

### Getting Help

If you encounter other issues:

1. **Check the logs**: Look in `logs/combined.log` and `logs/error.log`
2. **Test health endpoint**: `curl http://localhost:3000/api/health`
3. **Run comprehensive tests**: `npm test`
4. **Check Node.js version**: Must be 18 or higher

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Express.js and Three.js
- Enhanced terrain generation algorithms
- Interactive 3D visualization capabilities
- Professional CAD workflow integration

---

**Made with ❤️ for CAD professionals and project leaders**
