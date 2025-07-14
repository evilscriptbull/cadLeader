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
    }

    init() {
        this.updateProgress('Loading point cloud data...', 25);
        
        // Load data with fallback
        fetch('/api/pointcloud/data?limit=500')
            .then(response => response.json())
            .then(data => {
                this.updateProgress('Creating enhanced visualization...', 75);
                setTimeout(() => this.createEnhancedViewer(data), 100);
            })
            .catch(error => {
                console.warn('API failed, using demo data:', error);
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
        const container = document.getElementById('potreeContainer');
        this.canvas = document.createElement('canvas');
        
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.background = '#000';
        this.canvas.style.cursor = 'grab';
        
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Store data
        this.points = data.points || [];
        this.bounds = data.metadata.bounds;
        
        // Setup mouse controls
        this.setupMouseControls();
        
        // Initial render
        this.render();
        
        // Start animation loop
        this.startAnimation();
        
        this.finishLoading('Enhanced point cloud viewer ready!');
    }

    setupMouseControls() {
        // Mouse down
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            this.mouse.lastX = e.clientX;
            this.mouse.lastY = e.clientY;
            this.mouse.button = e.button;
            this.canvas.style.cursor = 'grabbing';
        });

        // Mouse up
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
            this.canvas.style.cursor = 'grab';
        });

        // Mouse leave
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isDown = false;
            this.canvas.style.cursor = 'grab';
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

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.points.length) return;

        // Save context
        this.ctx.save();

        // Apply transformations
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.translate(this.transform.offsetX, this.transform.offsetY);
        this.ctx.scale(this.transform.scale, this.transform.scale);
        this.ctx.rotate(this.transform.rotation);

        // Calculate base scale
        const rangeX = this.bounds.maxX - this.bounds.minX;
        const rangeZ = this.bounds.maxZ - this.bounds.minZ;
        const maxRange = Math.max(rangeX, rangeZ);
        const baseScale = Math.min(this.canvas.width, this.canvas.height) * 0.6 / maxRange;

        // Draw points
        this.points.forEach((point, i) => {
            const px = parseFloat(point.x);
            const pz = parseFloat(point.z);
            const py = parseFloat(point.y);
            
            // Calculate position
            const x = px * baseScale;
            const y = pz * baseScale;
            
            // Calculate size based on elevation and distance
            const elevationNorm = (py - this.bounds.minY) / (this.bounds.maxY - this.bounds.minY);
            const size = Math.max(1, 3 + elevationNorm * 2);
            
            // Color based on elevation and RGB
            if (point.rgb) {
                const brightness = 0.8 + elevationNorm * 0.4; // Higher elevation = brighter
                this.ctx.fillStyle = `rgb(${Math.floor(point.rgb.r * brightness)}, ${Math.floor(point.rgb.g * brightness)}, ${Math.floor(point.rgb.b * brightness)})`;
            } else {
                const intensity = Math.floor(elevationNorm * 255);
                this.ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${Math.min(255, intensity + 50)})`;
            }
            
            // Draw point
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Restore context
        this.ctx.restore();

        // Draw UI elements
        this.drawUI();
    }

    drawUI() {
        // Draw coordinate system
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('X →', this.canvas.width - 40, this.canvas.height - 20);
        this.ctx.fillText('Z ↓', 10, 20);
        
        // Draw controls info
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`Points: ${this.points.length} | Scale: ${this.transform.scale.toFixed(1)}x`, 10, this.canvas.height - 60);
        this.ctx.fillText('Left drag: Pan | Right drag: Rotate | Scroll: Zoom', 10, this.canvas.height - 40);
        this.ctx.fillText('✅ Enhanced 2D Viewer with Mouse Controls', 10, this.canvas.height - 20);
    }

    startAnimation() {
        const animate = () => {
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    createDemoViewer() {
        const container = document.getElementById('potreeContainer');
        this.canvas = document.createElement('canvas');
        
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.background = '#000';
        
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Generate demo data
        this.generateDemoData();
        this.setupMouseControls();
        this.startAnimation();
        
        this.finishLoading('Demo viewer with enhanced controls ready!');
    }

    generateDemoData() {
        this.points = [];
        this.bounds = {
            minX: -100, maxX: 100,
            minY: 280, maxY: 470,
            minZ: -100, maxZ: 100
        };

        // Generate more realistic demo terrain
        for (let i = 0; i < 300; i++) {
            const x = (Math.random() - 0.5) * 200; // -100 to 100
            const z = (Math.random() - 0.5) * 200; // -100 to 100
            
            // Create hills and valleys
            const distanceFromCenter = Math.sqrt(x*x + z*z);
            const hill1 = Math.max(0, 50 - Math.abs(x - 30) - Math.abs(z - 20));
            const hill2 = Math.max(0, 40 - Math.abs(x + 40) - Math.abs(z + 30));
            const valley = Math.max(0, 30 - distanceFromCenter * 0.3);
            
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
                rgb: { r: Math.floor(r), g: Math.floor(g), b: Math.floor(b) }
            });
        }
    }

    finishLoading(message) {
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
            
            const statusEl = document.querySelector('#viewerStatus span');
            if (statusEl) {
                statusEl.textContent = message;
                statusEl.style.color = '#28a745';
            }
            
            console.log('✅ Viewer ready:', message);
        }, 500);
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
    console.log('🚀 Starting ultra-simple viewer...');
    setupSimpleControls();
    
    // Start immediately - no delays
    showImmediateViewer();
});

// Fallback if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM still loading, wait for DOMContentLoaded
} else {
    // DOM already loaded
    console.log('🚀 DOM ready, starting viewer immediately...');
    setupSimpleControls();
    showImmediateViewer();
}
