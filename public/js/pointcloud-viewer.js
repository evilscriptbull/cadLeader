console.log('🎯 Enhanced Point Cloud Viewer Loading...');

// Enhanced viewer with mouse controls and better visualization
class PointCloudViewer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.points = [];
        this.bounds = null;
        this.transform = {
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            rotation: 0
        };
        this.mouse = {
            isDown: false,
            lastX: 0,
            lastY: 0,
            button: 0
        };
        this.animationId = null;
        
        // Enhancement: Add color modes and point size control
        this.colorMode = 'elevation'; // 'elevation', 'random', 'intensity'
        this.pointSize = 2;
        this.viewPresets = {
            default: { scale: 1, offsetX: 0, offsetY: 0, rotation: 0 },
            topDown: { scale: 1.5, offsetX: 0, offsetY: 0, rotation: 0 },
            angled: { scale: 1.2, offsetX: 0, offsetY: 0, rotation: 0.5 }
        };
        
        // Phase 1b: Enhanced statistics and measurement
        this.stats = {
            visiblePoints: 0,
            renderedPoints: 0,
            fps: 0,
            lastFrameTime: 0,
            frameCount: 0
        };
        
        // Measurement tools
        this.measurementMode = null; // 'distance', 'area', null
        this.measurementPoints = [];
        this.measurements = [];
        this.savedViewStates = [];
        
        // Performance monitoring
        this.performanceMonitor = {
            frameCount: 0,
            lastTime: performance.now(),
            fps: 0
        };
    }

    init() {
        console.log('🚀 Starting point cloud viewer initialization...');
        this.updateProgress('Loading point cloud data...', 25);
        
        // Load data with fallback
        fetch('/api/pointcloud/data?limit=500')
            .then(response => {
                console.log('📡 API response received:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('✅ Data loaded successfully:', data);
                this.updateProgress('Creating enhanced visualization...', 75);
                setTimeout(() => this.createEnhancedViewer(data), 100);
            })
            .catch(error => {
                console.warn('⚠️ API failed, using demo data:', error);
                this.updateProgress('Using demo data...', 50);
                setTimeout(() => this.createDemoViewer(), 100);
            });
    }

    updateProgress(message, percent) {
        const statusEl = document.getElementById('loadingStatus');
        const progressEl = document.getElementById('loadingProgress');
        
        if (statusEl) statusEl.textContent = message;
        if (progressEl) progressEl.innerHTML = `${percent}%: ${message}`;
    }

    createEnhancedViewer(data) {
        console.log('🎯 createEnhancedViewer called with data:', data);
        
        const container = document.getElementById('potreeContainer');
        console.log('📦 Container found:', container);
        
        if (!container) {
            console.error('❌ Container not found!');
            return;
        }
        
        this.canvas = document.createElement('canvas');
        console.log('🎨 Canvas created');
        
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.background = '#000';
        this.canvas.style.cursor = 'grab';
        
        console.log('📐 Canvas size:', this.canvas.width, 'x', this.canvas.height);
        
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        console.log('🖼️ Canvas context created');
        
        // Store data
        this.points = data.points || [];
        this.bounds = data.metadata ? data.metadata.bounds : null;
        console.log('💾 Data stored - points:', this.points.length, 'bounds:', this.bounds);
        
        // Setup mouse controls
        console.log('🖱️ Setting up mouse controls...');
        this.setupMouseControls();
        
        // Initial render
        console.log('🎬 Starting initial render...');
        this.render();
        
        // Start animation loop
        console.log('🔄 Starting animation loop...');
        this.startAnimation();
        
        console.log('🏁 Finishing loading...');
        this.finishLoading('Enhanced point cloud viewer ready!');
        
        // Setup enhanced controls after DOM is ready
        setTimeout(() => {
            console.log('🎮 Setting up enhanced controls...');
            this.setupEnhancedControls();
        }, 100);
    }

    setupMouseControls() {
        // Mouse down
        this.canvas.addEventListener('mousedown', (e) => {
            // Phase 1b: Handle measurement mode clicks first
            if (this.measurementMode) {
                this.addMeasurementPoint(e.offsetX, e.offsetY);
                return;
            }
            
            this.mouse.isDown = true;
            this.mouse.lastX = e.clientX;
            this.mouse.lastY = e.clientY;
            this.mouse.button = e.button;
            this.canvas.style.cursor = 'grabbing';
        });

        // Mouse up
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
            this.canvas.style.cursor = this.measurementMode ? 'crosshair' : 'grab';
        });

        // Mouse leave
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isDown = false;
            this.canvas.style.cursor = this.measurementMode ? 'crosshair' : 'grab';
        });

        // Mouse move
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.mouse.isDown) return;

            const deltaX = e.clientX - this.mouse.lastX;
            const deltaY = e.clientY - this.mouse.lastY;

            if (this.mouse.button === 0) { // Left click - pan
                this.transform.offsetX += deltaX;
                this.transform.offsetY += deltaY;
            } else if (this.mouse.button === 2) { // Right click - rotate
                this.transform.rotation += deltaX * 0.01;
            }

            this.mouse.lastX = e.clientX;
            this.mouse.lastY = e.clientY;
        });

        // Mouse wheel - zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.transform.scale *= zoomFactor;
            this.transform.scale = Math.max(0.1, Math.min(5, this.transform.scale));
        });

        // Disable context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    setupEnhancedControls() {
        console.log('🎮 Setting up enhanced controls...');
        
        // Color mode cycling
        const colorModeBtn = document.getElementById('colorModeBtn');
        if (colorModeBtn) {
            colorModeBtn.addEventListener('click', () => {
                this.cycleColorMode();
            });
        }
        
        // Point size control
        const pointSizeBtn = document.getElementById('pointSizeBtn');
        if (pointSizeBtn) {
            pointSizeBtn.addEventListener('click', () => {
                this.cyclePointSize();
            });
        }
        
        // Phase 1b: Enhanced measurement tools
        this.setupMeasurementTools();
        
        // Phase 1b: View state management
        this.setupViewStateManagement();
        
        // Phase 1b: Start statistics updates
        this.startStatisticsUpdates();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'c':
                    this.cycleColorMode();
                    break;
                case '+':
                case '=':
                    this.adjustPointSize(1);
                    break;
                case '-':
                    this.adjustPointSize(-1);
                    break;
                case 'r':
                    this.resetView();
                    break;
                case 'm':
                    this.toggleMeasurementMode();
                    break;
                case 'escape':
                    this.cancelMeasurement();
                    break;
            }
        });
    }

    // Phase 1b: Enhanced measurement tools
    setupMeasurementTools() {
        const distanceBtn = document.getElementById('measureDistanceBtn');
        const areaBtn = document.getElementById('measureAreaBtn');
        const clearBtn = document.getElementById('clearMeasurementsBtn');
        
        if (distanceBtn) {
            distanceBtn.addEventListener('click', () => {
                this.startMeasurement('distance');
            });
        }
        
        if (areaBtn) {
            areaBtn.addEventListener('click', () => {
                this.startMeasurement('area');
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearMeasurements();
            });
        }
    }

    // Phase 1b: View state management
    setupViewStateManagement() {
        const saveBtn = document.getElementById('saveViewStateBtn');
        const loadBtn = document.getElementById('loadViewStateBtn');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveViewState();
            });
        }
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadViewState();
            });
        }
    }

    // Phase 1b: Start real-time statistics updates
    startStatisticsUpdates() {
        setInterval(() => {
            this.updateStatistics();
        }, 1000); // Update every second
    }

    // Phase 1b: Measurement functions
    startMeasurement(type) {
        this.measurementMode = type;
        this.measurementPoints = [];
        this.updateStatus(`${type} measurement mode - Click points to measure`);
        
        // Update UI to show measurement is active
        const distanceBtn = document.getElementById('measureDistanceBtn');
        const areaBtn = document.getElementById('measureAreaBtn');
        
        if (distanceBtn) distanceBtn.style.background = type === 'distance' ? '#ffd700' : '#17a2b8';
        if (areaBtn) areaBtn.style.background = type === 'area' ? '#ffd700' : '#17a2b8';
    }

    addMeasurementPoint(x, y) {
        if (!this.measurementMode) return;
        
        // Convert screen coordinates to world coordinates
        const worldX = (x - this.canvas.width/2 - this.transform.offsetX) / this.transform.scale;
        const worldY = (y - this.canvas.height/2 - this.transform.offsetY) / this.transform.scale;
        
        this.measurementPoints.push({ x: worldX, y: worldY, screenX: x, screenY: y });
        
        if (this.measurementMode === 'distance' && this.measurementPoints.length === 2) {
            this.finalizeMeasurement();
        } else if (this.measurementMode === 'area' && this.measurementPoints.length >= 3) {
            this.finalizeMeasurement();
        }
    }

    finalizeMeasurement() {
        let result = 0;
        let unit = 'm';
        
        if (this.measurementMode === 'distance' && this.measurementPoints.length === 2) {
            const p1 = this.measurementPoints[0];
            const p2 = this.measurementPoints[1];
            result = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            unit = 'm';
        } else if (this.measurementMode === 'area' && this.measurementPoints.length >= 3) {
            // Simple polygon area calculation
            let area = 0;
            for (let i = 0; i < this.measurementPoints.length; i++) {
                const j = (i + 1) % this.measurementPoints.length;
                area += this.measurementPoints[i].x * this.measurementPoints[j].y;
                area -= this.measurementPoints[j].x * this.measurementPoints[i].y;
            }
            result = Math.abs(area / 2);
            unit = 'm²';
        }
        
        this.measurements.push({
            type: this.measurementMode,
            points: [...this.measurementPoints],
            result: result,
            unit: unit
        });
        
        // Update UI
        this.updateMeasurementDisplay(result, unit);
        this.cancelMeasurement();
        
        this.updateStatus(`Measurement complete: ${result.toFixed(2)} ${unit}`);
    }

    clearMeasurements() {
        this.measurements = [];
        this.measurementPoints = [];
        this.measurementMode = null;
        this.updateMeasurementDisplay(0, 'm');
        this.updateStatus('Measurements cleared');
    }

    cancelMeasurement() {
        this.measurementMode = null;
        this.measurementPoints = [];
        
        // Reset button colors
        const distanceBtn = document.getElementById('measureDistanceBtn');
        const areaBtn = document.getElementById('measureAreaBtn');
        if (distanceBtn) distanceBtn.style.background = '#17a2b8';
        if (areaBtn) areaBtn.style.background = '#17a2b8';
    }

    // Phase 1b: View state management
    saveViewState() {
        const viewState = {
            transform: { ...this.transform },
            colorMode: this.colorMode,
            pointSize: this.pointSize,
            timestamp: new Date().toISOString(),
            name: `View_${this.savedViewStates.length + 1}`
        };
        
        this.savedViewStates.push(viewState);
        this.updateStatus(`View state saved: ${viewState.name}`);
        
        // Update current view display
        this.updateElement('currentView', viewState.name);
    }

    loadViewState() {
        if (this.savedViewStates.length === 0) {
            this.updateStatus('No saved view states available');
            return;
        }
        
        const lastState = this.savedViewStates[this.savedViewStates.length - 1];
        this.transform = { ...lastState.transform };
        this.colorMode = lastState.colorMode;
        this.pointSize = lastState.pointSize;
        
        this.updateStatus(`View state loaded: ${lastState.name}`);
        this.updateElement('currentView', lastState.name);
        this.updateElement('currentColorMode', this.colorMode);
        this.updateElement('currentPointSize', `${this.pointSize}px`);
    }

    // Phase 1b: Enhanced statistics updates
    updateStatistics() {
        // Calculate FPS
        const now = performance.now();
        this.performanceMonitor.frameCount++;
        
        if (now - this.performanceMonitor.lastTime >= 1000) {
            this.performanceMonitor.fps = this.performanceMonitor.frameCount;
            this.performanceMonitor.frameCount = 0;
            this.performanceMonitor.lastTime = now;
        }
        
        // Update visible points calculation
        this.stats.visiblePoints = this.calculateVisiblePoints();
        this.stats.renderedPoints = this.points.length;
        
        // Update UI elements
        this.updateElement('zoomLevel', `${this.transform.scale.toFixed(1)}x`);
        this.updateElement('visiblePoints', this.stats.visiblePoints.toLocaleString());
        this.updateElement('renderedPoints', this.stats.renderedPoints.toLocaleString());
        this.updateElement('currentFPS', this.performanceMonitor.fps);
    }

    calculateVisiblePoints() {
        // Simple calculation based on current viewport
        const viewportArea = this.canvas.width * this.canvas.height;
        const scaleFactor = Math.min(this.transform.scale, 2);
        return Math.floor(this.points.length * scaleFactor * 0.8);
    }

    updateMeasurementDisplay(value, unit) {
        const resultsDiv = document.getElementById('measurementResults');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            
            if (unit === 'm') {
                this.updateElement('lastDistance', `${value.toFixed(2)} ${unit}`);
            } else if (unit === 'm²') {
                this.updateElement('lastArea', `${value.toFixed(2)} ${unit}`);
            }
            
            this.updateElement('measurementPoints', this.measurementPoints.length);
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateStatus(message) {
        const statusEl = document.getElementById('viewerStatus');
        if (statusEl) {
            statusEl.innerHTML = `<strong>Status:</strong> <span style="color: #ffd700;">${message}</span>`;
        }
    }

    toggleMeasurementMode() {
        if (this.measurementMode) {
            this.cancelMeasurement();
        } else {
            this.startMeasurement('distance');
        }
   }

    // Phase 1b: Enhanced render function with measurement overlay
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update performance counter
        this.performanceMonitor.frameCount++;
        
        // Draw points
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.transform.scale, this.transform.scale);
        this.ctx.translate(this.transform.offsetX / this.transform.scale, this.transform.offsetY / this.transform.scale);
        this.ctx.rotate(this.transform.rotation);
        
        // Draw point cloud
        this.points.forEach(point => {
            const x = parseFloat(point.x);
            const y = parseFloat(point.y);
            const z = parseFloat(point.z);
            
            // Calculate color based on current mode
            let color;
            if (this.colorMode === 'elevation') {
                color = this.getElevationColor(y);
            } else if (this.colorMode === 'random') {
                color = this.getRandomColor();
            } else if (this.colorMode === 'intensity') {
                color = this.getIntensityColor(point.intensity || 50);
            } else if (point.rgb) {
                color = `rgb(${point.rgb.r}, ${point.rgb.g}, ${point.rgb.b})`;
            } else {
                color = '#ffffff';
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x - this.pointSize/2, -z - this.pointSize/2, this.pointSize, this.pointSize);
        });
        
        this.ctx.restore();
        
        // Phase 1b: Draw measurement overlay
        this.drawMeasurementOverlay();
        
        // Draw UI info
        this.drawUIInfo();
    }

    // Phase 1b: Draw measurement points and lines
    drawMeasurementOverlay() {
        if (this.measurementPoints.length === 0) return;
        
        this.ctx.save();
        
        // Draw measurement points
        this.ctx.fillStyle = '#ff0000';
        this.measurementPoints.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.screenX, point.screenY, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        // Draw measurement lines
        if (this.measurementPoints.length > 1) {
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.measurementPoints[0].screenX, this.measurementPoints[0].screenY);
            
            for (let i = 1; i < this.measurementPoints.length; i++) {
                this.ctx.lineTo(this.measurementPoints[i].screenX, this.measurementPoints[i].screenY);
            }
            
            // Close polygon for area measurement
            if (this.measurementMode === 'area' && this.measurementPoints.length > 2) {
                this.ctx.closePath();
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
                this.ctx.fill();
            }
            
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    drawUIInfo() {
        // Draw coordinate system
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('X →', this.canvas.width - 40, this.canvas.height - 20);
        this.ctx.fillText('Z ↓', 10, 20);
        
        // Draw enhanced controls info
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`Points: ${this.points.length} | Scale: ${this.transform.scale.toFixed(1)}x | Mode: ${this.colorMode}`, 10, this.canvas.height - 80);
        this.ctx.fillText(`Size: ${this.pointSize}px | FPS: ${this.performanceMonitor.fps}`, 10, this.canvas.height - 60);
        
        if (this.measurementMode) {
            this.ctx.fillText(`Measurement Mode: ${this.measurementMode} (${this.measurementPoints.length} points)`, 10, this.canvas.height - 40);
        } else {
            this.ctx.fillText('Left drag: Pan | Right drag: Rotate | Scroll: Zoom | C: Colors | M: Measure', 10, this.canvas.height - 40);
        }
        
        this.ctx.fillText('✅ Enhanced 2D Viewer with Phase 1b Features', 10, this.canvas.height - 20);
    }

    startAnimation() {
        const animate = () => {
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    finishLoading(message) {
        console.log('🏁 finishLoading called with message:', message);
        setTimeout(() => {
            const loadingEl = document.getElementById('loading');
            if (loadingEl) {
                console.log('📋 Hiding loading element');
                loadingEl.style.display = 'none';
            }
            
            const statusEl = document.getElementById('viewerStatus');
            if (statusEl) {
                console.log('📊 Updating status:', message);
                statusEl.innerHTML = `<strong>Status:</strong> <span style="color: #00ff00;">${message}</span>`;
            }
            
            console.log('✅ Point cloud viewer fully loaded!');
        }, 500);
    }

    createDemoViewer() {
        console.log('🎯 createDemoViewer called - using fallback demo data');
        
        const container = document.getElementById('potreeContainer');
        if (!container) {
            console.error('❌ Container not found in demo viewer!');
            return;
        }
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.background = '#000';
        this.canvas.style.cursor = 'grab';
        
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Generate demo data
        this.generateDemoData();
        
        // Setup controls
        this.setupMouseControls();
        this.startAnimation();
        
        this.finishLoading('Demo viewer with enhanced controls ready!');
        
        // Setup enhanced controls after DOM is ready
        setTimeout(() => {
            this.setupEnhancedControls();
        }, 100);
    }

    generateDemoData() {
        console.log('🎲 Generating demo data...');
        this.points = [];
        this.bounds = {
            minX: -100, maxX: 100,
            minY: 280, maxY: 470,
            minZ: -100, maxZ: 100
        };

        // Generate realistic demo terrain
        for (let i = 0; i < 300; i++) {
            const x = (Math.random() - 0.5) * 200; // -100 to 100
            const z = (Math.random() - 0.5) * 200; // -100 to 100
            
            // Create hills and valleys
            const hill1 = Math.max(0, 50 - Math.abs(x - 30) - Math.abs(z - 20));
            const hill2 = Math.max(0, 40 - Math.abs(x + 40) - Math.abs(z + 30));
            const valley = Math.max(0, 30 - Math.sqrt(x*x + z*z) * 0.3);
            
            const y = 320 + hill1 + hill2 + valley + (Math.random() - 0.5) * 20;
            
            // Generate terrain-appropriate colors
            const elevationNorm = (y - 280) / (470 - 280);
            let r, g, b;
            
            if (elevationNorm > 0.8) { // High - snow/rock
                r = 200 + Math.random() * 55;
                g = 200 + Math.random() * 55;
                b = 255;
            } else if (elevationNorm > 0.6) { // Mid-high - rock
                r = 120 + Math.random() * 60;
                g = 100 + Math.random() * 50;
                b = 80 + Math.random() * 40;
            } else if (elevationNorm > 0.4) { // Mid - vegetation
                r = 60 + Math.random() * 40;
                g = 120 + Math.random() * 80;
                b = 40 + Math.random() * 30;
            } else { // Low - soil/water
                r = 80 + Math.random() * 40;
                g = 60 + Math.random() * 30;
                b = 40 + Math.random() * 20;
            }
            
            this.points.push({
                x: x.toFixed(2),
                y: y.toFixed(2),
                z: z.toFixed(2),
                intensity: Math.floor(Math.random() * 100),
                rgb: { r: Math.floor(r), g: Math.floor(g), b: Math.floor(b) }
            });
        }
        
        console.log('✅ Generated', this.points.length, 'demo points');
    }

    // Phase 1b: Color helper functions
    getElevationColor(elevation) {
        if (!this.bounds) return '#ffffff';
        
        const minY = this.bounds.minY || 280;
        const maxY = this.bounds.maxY || 470;
        const normalized = (elevation - minY) / (maxY - minY);
        
        // Create elevation-based color gradient
        if (normalized > 0.8) {
            // High elevation - white/snow
            return `rgb(${255}, ${255}, ${255})`;
        } else if (normalized > 0.6) {
            // Mid-high elevation - brown/rock
            return `rgb(${139}, ${117}, ${93})`;
        } else if (normalized > 0.4) {
            // Mid elevation - green/vegetation
            return `rgb(${34}, ${139}, ${34})`;
        } else if (normalized > 0.2) {
            // Low-mid elevation - yellow/sand
            return `rgb(${218}, ${165}, ${32})`;
        } else {
            // Low elevation - blue/water
            return `rgb(${30}, ${144}, ${255})`;
        }
    }

    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
            '#ee5a24', '#0abde3', '#10ac84', '#f368e0', '#feca57'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getIntensityColor(intensity) {
        const normalizedIntensity = Math.max(0, Math.min(100, intensity)) / 100;
        
        // Create intensity-based grayscale
        const value = Math.floor(255 * normalizedIntensity);
        return `rgb(${value}, ${value}, ${value})`;
    }

    // Phase 1b: Enhanced color cycling
    cycleColorMode() {
        const modes = ['elevation', 'random', 'intensity'];
        const currentIndex = modes.indexOf(this.colorMode);
        this.colorMode = modes[(currentIndex + 1) % modes.length];
        
        // Update UI
        this.updateElement('currentColorMode', this.colorMode);
        this.updateStatus(`Color mode: ${this.colorMode}`);
    }

    // Phase 1b: Point size control
    cyclePointSize() {
        this.pointSize = this.pointSize >= 5 ? 1 : this.pointSize + 1;
        this.updateElement('currentPointSize', `${this.pointSize}px`);
        this.updateStatus(`Point size: ${this.pointSize}px`);
    }

    adjustPointSize(delta) {
        this.pointSize = Math.max(1, Math.min(10, this.pointSize + delta));
        this.updateElement('currentPointSize', `${this.pointSize}px`);
        this.updateStatus(`Point size: ${this.pointSize}px`);
    }

    // Phase 1b: View reset
    resetView() {
        this.transform = {
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            rotation: 0
        };
        this.updateStatus('View reset to default');
    }
}

// Initialize enhanced viewer
let viewer = null;

function showImmediateViewer() {
    viewer = new PointCloudViewer();
    viewer.init();
}

// Simple controls for buttons
function setupSimpleControls() {
    // Fullscreen
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        });
    }
    
    // Reset view
    const resetBtn = document.getElementById('resetViewBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (viewer) {
                viewer.transform = {
                    scale: 1,
                    offsetX: 0,
                    offsetY: 0,
                    rotation: 0
                };
            }
        });
    }
    
    // Measure
    const measureBtn = document.getElementById('measureBtn');
    if (measureBtn) {
        measureBtn.addEventListener('click', () => {
            alert('🔧 Measurement tools coming soon!\n\nCurrent view:\n' + 
                  `Scale: ${viewer ? viewer.transform.scale.toFixed(1) : 1}x\n` +
                  `Rotation: ${viewer ? (viewer.transform.rotation * 180 / Math.PI).toFixed(1) : 0}°`);
        });
    }
}

// Start immediately when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, starting point cloud viewer...');
    setupSimpleControls();
    
    // Start immediately - no delays
    setTimeout(() => {
        showImmediateViewer();
    }, 100);
});

// Fallback if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM still loading, wait for DOMContentLoaded
} else {
    // DOM already loaded
    console.log('🚀 DOM ready, starting viewer immediately...');
    setupSimpleControls();
    setTimeout(() => {
        showImmediateViewer();
    }, 100);
}
