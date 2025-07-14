console.log('🚀 Enhanced Simple Test Viewer starting...');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;

// Mouse controls
let mouse = {
    isDown: false,
    lastX: 0,
    lastY: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0
};

// Setup mouse controls
canvas.addEventListener('mousedown', (e) => {
    mouse.isDown = true;
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mouseup', () => {
    mouse.isDown = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mousemove', (e) => {
    if (!mouse.isDown) return;
    
    const deltaX = e.clientX - mouse.lastX;
    const deltaY = e.clientY - mouse.lastY;
    
    mouse.offsetX += deltaX;
    mouse.offsetY += deltaY;
    
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;
    
    // Re-render if we have data
    if (window.currentData) {
        drawPointCloud(window.currentData);
    }
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    mouse.scale *= zoomFactor;
    mouse.scale = Math.max(0.1, Math.min(5, mouse.scale));
    
    // Re-render if we have data
    if (window.currentData) {
        drawPointCloud(window.currentData);
    }
});

canvas.style.cursor = 'grab';

statusEl.textContent = 'Drawing test pattern...';

// Draw immediate test pattern
function drawTestPattern() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.translate(mouse.offsetX, mouse.offsetY);
    ctx.scale(mouse.scale, mouse.scale);
    
    ctx.fillStyle = '#00ff88';
    for (let i = 0; i < 1000; i++) {
        const angle = (i / 1000) * Math.PI * 6;
        const radius = 50 + (i / 20);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        ctx.fillRect(x - 1, y - 1, 2, 2);
    }
    
    ctx.restore();
    
    // Add text
    ctx.fillStyle = '#ffd700';
    ctx.font = '20px Arial';
    ctx.fillText('✅ Canvas Test Working!', 20, 40);
    ctx.font = '14px Arial';
    ctx.fillText('This proves the basic display works', 20, 65);
    ctx.fillText('Left drag: Pan | Scroll: Zoom', 20, 85);
}

function drawPointCloud(data) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!data.points || data.points.length === 0) return;
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.translate(mouse.offsetX, mouse.offsetY);
    ctx.scale(mouse.scale, mouse.scale);
    
    const bounds = data.metadata.bounds;
    const rangeX = bounds.maxX - bounds.minX;
    const rangeZ = bounds.maxZ - bounds.minZ;
    const maxRange = Math.max(rangeX, rangeZ);
    const baseScale = Math.min(canvas.width, canvas.height) * 0.4 / maxRange;
    
    // Draw points with enhanced visualization
    data.points.forEach((point, i) => {
        const px = parseFloat(point.x);
        const pz = parseFloat(point.z);
        const py = parseFloat(point.y);
        
        const x = px * baseScale;
        const y = pz * baseScale;
        
        // Size based on elevation
        const elevationNorm = (py - bounds.minY) / (bounds.maxY - bounds.minY);
        const size = Math.max(2, 4 + elevationNorm * 3);
        
        // Color from point data
        if (point.rgb) {
            const brightness = 0.7 + elevationNorm * 0.5;
            ctx.fillStyle = `rgb(${Math.floor(point.rgb.r * brightness)}, ${Math.floor(point.rgb.g * brightness)}, ${Math.floor(point.rgb.b * brightness)})`;
        } else {
            const intensity = Math.floor(elevationNorm * 255);
            ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${Math.min(255, intensity + 50)})`;
        }
        
        // Draw point as circle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.restore();
    
    // Draw UI
    ctx.fillStyle = '#ffd700';
    ctx.font = '20px Arial';
    ctx.fillText('✅ Real Point Cloud Data with Controls!', 20, 40);
    ctx.font = '14px Arial';
    ctx.fillText(`Showing ${data.points.length} live survey points`, 20, 65);
    ctx.fillText(`Scale: ${mouse.scale.toFixed(1)}x | Left drag: Pan | Scroll: Zoom`, 20, 85);
    
    // Store data globally for mouse events
    window.currentData = data;
}

// Initial pattern
drawTestPattern();

document.getElementById('pointCount').textContent = '1,000';
statusEl.textContent = 'Ready - Test pattern displayed!';

// Now try to load real data
setTimeout(() => {
    statusEl.textContent = 'Fetching real data...';
    
    fetch('/api/pointcloud/data?limit=200')
        .then(response => response.json())
        .then(data => {
            statusEl.textContent = 'Drawing real points...';
            
            console.log('📊 Enhanced test data:', data);
            
            drawPointCloud(data);
            
            document.getElementById('pointCount').textContent = data.points.length;
            document.getElementById('dataSource').textContent = 'Live API';
            statusEl.textContent = 'Ready - Enhanced live data displayed!';
        })
        .catch(error => {
            console.warn('API failed:', error);
            statusEl.textContent = 'API failed - showing test pattern';
            document.getElementById('dataSource').textContent = 'Test Pattern';
        });
}, 1000);

console.log('✅ Test viewer ready');
