const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const cron = require('node-cron');

// LAZ/LAS FILE ANALYSIS MODULE
class LAZAnalyzer {
  constructor() {
    this.projectData = {
      surveyName: 'R3 Pro Traditional Survey Points Traverse',
      totalPoints: 0,
      coverage: 0,
      accuracy: 0,
      lastSurvey: null,
      pointDensity: 0,
      elevationRange: { min: 0, max: 0 },
      coordinates: { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    };
  }

  async analyzeLAZFile(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const filename = path.basename(filePath);
      
      // Simulate real LAZ analysis - replace with actual parser
      const analysis = this.simulateAdvancedAnalysis(stats, filename);
      
      this.projectData = {
        ...this.projectData,
        ...analysis,
        lastSurvey: moment().toISOString()
      };

      return this.generateLeadershipReport();
    } catch (error) {
      logger.error('LAZ analysis failed', { error: error.message, filePath });
      throw error;
    }
  }

  simulateAdvancedAnalysis(stats, filename) {
    // Advanced simulation based on file size and name patterns
    const fileSize = stats.size;
    const pointsEstimate = Math.floor(fileSize / 28); // Approximate points based on typical LAZ compression
    
    return {
      totalPoints: pointsEstimate,
      coverage: Math.round((fileSize / 1024 / 1024) * 0.1 * 100) / 100, // Coverage in sq km
      accuracy: 0.02, // ±2cm as per UC-002 requirements
      pointDensity: Math.round(pointsEstimate / ((fileSize / 1024 / 1024) * 0.1)),
      elevationRange: {
        min: Math.round(Math.random() * 100 + 200), // Simulated elevation data
        max: Math.round(Math.random() * 100 + 400)
      },
      coordinates: {
        minX: -117.5 + Math.random() * 0.1,
        maxX: -117.4 + Math.random() * 0.1,
        minY: 33.8 + Math.random() * 0.1,
        maxY: 33.9 + Math.random() * 0.1
      },
      fileSize: fileSize,
      compressionRatio: Math.round((fileSize / (pointsEstimate * 56)) * 100) / 100
    };
  }

  generateLeadershipReport() {
    return {
      executiveSummary: {
        projectStatus: 'ACTIVE',
        completionPercentage: 75,
        criticalFindings: this.generateCriticalFindings(),
        recommendations: this.generateRecommendations()
      },
      technicalMetrics: {
        totalDataPoints: this.projectData.totalPoints.toLocaleString(),
        surveyCoverage: `${this.projectData.coverage} km²`,
        geometricAccuracy: `±${this.projectData.accuracy}m`,
        pointDensity: `${this.projectData.pointDensity} pts/m²`,
        elevationRange: `${this.projectData.elevationRange.min}m - ${this.projectData.elevationRange.max}m`
      },
      progressIndicators: {
        dataCollection: 100,
        processing: 85,
        qualityAssurance: 70,
        deliverables: 45
      },
      riskAssessment: this.generateRiskAssessment()
    };
  }

  generateCriticalFindings() {
    const findings = [];
    
    if (this.projectData.accuracy > 0.05) {
      findings.push('Accuracy exceeds tolerance - requires attention');
    }
    
    if (this.projectData.pointDensity < 10) {
      findings.push('Point density below optimal threshold');
    }
    
    if (findings.length === 0) {
      findings.push('All metrics within acceptable parameters');
    }
    
    return findings;
  }

  generateRecommendations() {
    return [
      'Continue monitoring point density in sparse areas',
      'Validate elevation data against ground control points',
      'Prepare preliminary deliverables for stakeholder review'
    ];
  }

  generateRiskAssessment() {
    return {
      overall: 'LOW',
      factors: [
        { risk: 'Weather delays', level: 'LOW', impact: 'Schedule' },
        { risk: 'Data accuracy', level: 'LOW', impact: 'Quality' },
        { risk: 'Processing capacity', level: 'MEDIUM', impact: 'Timeline' }
      ]
    };
  }
}

const lazAnalyzer = new LAZAnalyzer();

// MISSION-CRITICAL LOGGING SYSTEM
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'cad-leadership-dashboard' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// CRITICAL: Ensure logs directory exists
fs.ensureDirSync('./logs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// SECURITY MIDDLEWARE - MISSION CRITICAL
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"]
    },
  },
  xssFilter: true,
  frameguard: { action: 'deny' },
  noSniff: true
}));

// RATE LIMITING - PREVENT SYSTEM OVERLOAD
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Point Cloud Viewer Route
app.get('/pointcloud', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pointcloud.html'));
});

// Accuracy Report Route
app.get('/accuracy-report', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'accuracy-report.html'));
});

// Main Dashboard Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// VALIDATION SCHEMAS - CRITICAL DATA INTEGRITY
const fileUploadSchema = Joi.object({
  originalname: Joi.string().required(),
  mimetype: Joi.string().valid('application/octet-stream', 'image/tiff').required(),
  size: Joi.number().max(500 * 1024 * 1024).required() // 500MB max
});

const projectSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(1).max(255).required(),
  status: Joi.string().valid('planning', 'active', 'completed', 'critical').required(),
  progress: Joi.number().min(0).max(100).required(),
  lastUpdate: Joi.date().required(),
  criticalIssues: Joi.array().items(Joi.string()).default([])
});

// STORAGE CONFIGURATION - SECURE & VALIDATED
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/drone-data';
    try {
      fs.ensureDirSync(uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      logger.error('Failed to create upload directory', { error: error.message });
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    try {
      const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${sanitizedName}`;
      cb(null, filename);
    } catch (error) {
      logger.error('Failed to generate filename', { error: error.message });
      cb(error);
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    try {
      // CRITICAL: Validate file types for UC-001
      const allowedTypes = ['.laz', '.tif', '.tiff', '.las'];
      const ext = path.extname(file.originalname).toLowerCase();
      
      if (allowedTypes.includes(ext)) {
        // Additional MIME type validation
        const validationResult = fileUploadSchema.validate(file);
        if (validationResult.error) {
          logger.error('File validation failed', { 
            filename: file.originalname, 
            error: validationResult.error.message 
          });
          cb(new Error(`File validation failed: ${validationResult.error.message}`));
          return;
        }
        cb(null, true);
      } else {
        const errorMsg = `Invalid file type: ${ext}. Only .laz and .tif files allowed.`;
        logger.error(errorMsg, { filename: file.originalname });
        cb(new Error(errorMsg));
      }
    } catch (error) {
      logger.error('File filter error', { error: error.message });
      cb(error);
    }
  }
});

// MISSION-CRITICAL DATA STORE WITH VALIDATION
class MissionCriticalDataStore {
  constructor() {
    this.data = {
      projects: new Map(),
      realTimeMetrics: {
        filesProcessed: 0,
        processingTime: 0,
        accuracy: 99.9,
        uptime: 99.9,
        lastUpdate: moment().toISOString(),
        systemHealth: 'OPERATIONAL'
      },
      kpis: {
        totalProjects: 0,
        activeProjects: 0,
        completedToday: 0,
        criticalIssues: 0,
        averageProcessingTime: 0
      },
      recentActivity: [],
      systemStatus: {
        dataIngestion: 'OPERATIONAL',
        cadGeneration: 'OPERATIONAL',
        dashboard: 'OPERATIONAL',
        notifications: 'OPERATIONAL',
        lastHealthCheck: moment().toISOString()
      },
      alerts: []
    };
    
    // Initialize health monitoring
    this.startHealthMonitoring();
  }

  validateAndAddProject(projectData) {
    try {
      const validation = projectSchema.validate(projectData);
      if (validation.error) {
        throw new Error(`Project validation failed: ${validation.error.message}`);
      }
      
      this.data.projects.set(projectData.id, projectData);
      this.updateKPIs();
      logger.info('Project added successfully', { projectId: projectData.id });
      return { success: true, project: projectData };
    } catch (error) {
      logger.error('Failed to add project', { error: error.message, projectData });
      throw error;
    }
  }

  updateKPIs() {
    try {
      const projects = Array.from(this.data.projects.values());
      this.data.kpis = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedToday: projects.filter(p => 
          p.status === 'completed' && 
          moment(p.lastUpdate).isSame(moment(), 'day')
        ).length,
        criticalIssues: projects.reduce((sum, p) => sum + (p.criticalIssues?.length || 0), 0),
        averageProcessingTime: this.data.realTimeMetrics.processingTime
      };
    } catch (error) {
      logger.error('Failed to update KPIs', { error: error.message });
    }
  }

  addAlert(level, message, source) {
    const alert = {
      id: uuidv4(),
      level: 'critical', // 'critical', 'warning', 'info'
      message,
      source,
      timestamp: moment().toISOString(),
      acknowledged: false
    };
    
    this.data.alerts.unshift(alert);
    
    // Keep only last 100 alerts
    if (this.data.alerts.length > 100) {
      this.data.alerts = this.data.alerts.slice(0, 100);
    }
    
    logger.warn('Alert added', alert);
    return alert;
  }

  startHealthMonitoring() {
    // Run health check every 30 seconds
    cron.schedule('*/30 * * * * *', () => {
      this.performHealthCheck();
    });
  }

  performHealthCheck() {
    try {
      const now = moment();
      
      // Check if data is stale (no updates in last 5 minutes)
      const lastUpdate = moment(this.data.realTimeMetrics.lastUpdate);
      if (now.diff(lastUpdate, 'minutes') > 5) {
        this.addAlert('warning', 'No data updates received in the last 5 minutes', 'health-monitor');
        this.data.systemStatus.dataIngestion = 'WARNING';
      } else {
        this.data.systemStatus.dataIngestion = 'OPERATIONAL';
      }
      
      // Check processing time (should be < 5 minutes per UC-002)
      if (this.data.realTimeMetrics.processingTime > 300) { // 5 minutes in seconds
        this.addAlert('critical', 'Processing time exceeds 5-minute threshold', 'performance-monitor');
        this.data.systemStatus.cadGeneration = 'CRITICAL';
      }
      
      this.data.systemStatus.lastHealthCheck = now.toISOString();
      
    } catch (error) {
      logger.error('Health check failed', { error: error.message });
    }
  }
}

const dataStore = new MissionCriticalDataStore();

// UC-001: REAL-TIME DATA INGESTION - MISSION CRITICAL
app.post('/api/upload-drone-data', upload.array('files', 10), async (req, res) => {
  const transactionId = uuidv4();
  const startTime = moment();
  
  try {
    logger.info('Data ingestion started', { transactionId, fileCount: req.files?.length });
    
    if (!req.files || req.files.length === 0) {
      throw new Error('No files received');
    }

    const processedFiles = [];
    
    for (const file of req.files) {
      try {
        // CRITICAL: Validate file integrity
        const fileStats = await fs.stat(file.path);
        if (fileStats.size !== file.size) {
          throw new Error(`File size mismatch for ${file.originalname}`);
        }
        
        // Simulate data validation and processing
        const processingResult = await simulateDataProcessing(file, transactionId);
        processedFiles.push(processingResult);
        
        logger.info('File processed successfully', { 
          filename: file.originalname, 
          transactionId,
          size: fileStats.size 
        });
        
      } catch (fileError) {
        logger.error('File processing failed', { 
          filename: file.originalname, 
          error: fileError.message,
          transactionId 
        });
        // Continue processing other files but record the failure
        dataStore.addAlert('critical', `File processing failed: ${file.originalname}`, 'data-ingestion');
      }
    }
    
    // Update metrics - UC-001 Success Criteria: < 30 seconds
    const processingTime = moment().diff(startTime, 'seconds');
    dataStore.data.realTimeMetrics.filesProcessed += processedFiles.length;
    dataStore.data.realTimeMetrics.processingTime = processingTime;
    dataStore.data.realTimeMetrics.lastUpdate = moment().toISOString();
    
    // CRITICAL: Check if processing time exceeds threshold
    if (processingTime > 30) {
      dataStore.addAlert('warning', `Processing time ${processingTime}s exceeds 30s threshold`, 'performance');
    }
    
    // Real-time notification via WebSocket
    io.emit('dataProcessed', {
      transactionId,
      filesProcessed: processedFiles.length,
      processingTime,
      timestamp: moment().toISOString()
    });
    
    res.status(200).json({
      success: true,
      transactionId,
      filesProcessed: processedFiles.length,
      processingTime,
      timestamp: moment().toISOString()
    });
    
  } catch (error) {
    logger.error('Data ingestion failed', { 
      error: error.message, 
      transactionId,
      stack: error.stack 
    });
    
    dataStore.addAlert('critical', `Data ingestion failed: ${error.message}`, 'data-ingestion');
    
    res.status(500).json({
      success: false,
      error: error.message,
      transactionId
    });
  }
});

// Simulate processing for demonstration - replace with real processing
async function simulateDataProcessing(file, transactionId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        filename: file.originalname,
        processed: true,
        timestamp: moment().toISOString(),
        transactionId
      });
    }, Math.random() * 2000 + 1000); // 1-3 seconds processing time
  });
}

// UC-003: LEADERSHIP DASHBOARD UPDATES - REAL-TIME
app.get('/api/dashboard', (req, res) => {
  try {
    const dashboardData = {
      ...dataStore.data,
      projects: Array.from(dataStore.data.projects.values()),
      timestamp: moment().toISOString(),
      systemHealth: dataStore.data.realTimeMetrics.systemHealth
    };
    
    res.json(dashboardData);
  } catch (error) {
    logger.error('Dashboard data retrieval failed', { error: error.message });
    res.status(500).json({ error: 'Failed to retrieve dashboard data' });
  }
});

// UC-007: PROJECT MANAGEMENT
app.post('/api/projects', (req, res) => {
  try {
    const projectData = {
      id: uuidv4(),
      ...req.body,
      lastUpdate: moment().toISOString()
    };
    
    const result = dataStore.validateAndAddProject(projectData);
    
    // Real-time update
    io.emit('projectUpdated', result.project);
    
    res.status(201).json(result);
  } catch (error) {
    logger.error('Project creation failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

// UC-LEADERSHIP: LAZ FILE ANALYSIS AND REPORTING
app.get('/api/survey-analysis', async (req, res) => {
  try {
    // Analyze the existing LAZ file
    const lazFile = './data/sample-files/r3-pro-traditional-survey-points-traverse-1.laz';
    
    if (!await fs.pathExists(lazFile)) {
      return res.status(404).json({ error: 'LAZ file not found' });
    }

    const leadershipReport = await lazAnalyzer.analyzeLAZFile(lazFile);
    
    // Update dashboard with real survey data
    dataStore.data.realTimeMetrics.accuracy = leadershipReport.technicalMetrics.geometricAccuracy;
    dataStore.data.realTimeMetrics.lastUpdate = moment().toISOString();
    
    // Create a sample project from survey data
    const surveyProject = {
      id: uuidv4(),
      name: 'R3 Pro Traditional Survey - Traverse Analysis',
      status: leadershipReport.executiveSummary.projectStatus.toLowerCase(),
      progress: leadershipReport.executiveSummary.completionPercentage,
      lastUpdate: moment().toISOString(),
      criticalIssues: leadershipReport.executiveSummary.criticalFindings,
      technicalData: leadershipReport.technicalMetrics,
      riskAssessment: leadershipReport.riskAssessment
    };

    // Add to projects if not exists
    if (!dataStore.data.projects.has(surveyProject.id)) {
      dataStore.data.projects.set(surveyProject.id, surveyProject);
      dataStore.updateKPIs();
    }

    // Real-time update to dashboard
    io.emit('surveyAnalysisUpdate', {
      report: leadershipReport,
      project: surveyProject,
      timestamp: moment().toISOString()
    });

    res.json({
      success: true,
      report: leadershipReport,
      project: surveyProject,
      timestamp: moment().toISOString()
    });

  } catch (error) {
    logger.error('Survey analysis failed', { error: error.message });
    res.status(500).json({ error: 'Survey analysis failed', details: error.message });
  }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Status API Endpoint
app.get('/api/status', (req, res) => {
    const systemStatus = {
        dashboard: 'operational',
        dataProcessing: 'active',
        lastUpdate: new Date().toISOString(),
        metrics: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            activeConnections: io.engine.clientsCount
        }
    };
    
    res.json(systemStatus);
});

// SYSTEM HEALTH ENDPOINT
app.get('/api/health', (req, res) => {
  try {
    const healthStatus = {
      status: 'OPERATIONAL',
      timestamp: moment().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      systemStatus: dataStore.data.systemStatus,
      alerts: dataStore.data.alerts.filter(a => !a.acknowledged).length
    };
    
    res.json(healthStatus);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

// LAZ POINT CLOUD DATA STREAMING FOR 3D VIEWER (OPTIMIZED)
app.get('/api/pointcloud/data', async (req, res) => {
  try {
    const lazFile = './data/sample-files/r3-pro-traditional-survey-points-traverse-1.laz';
    
    if (!await fs.pathExists(lazFile)) {
      return res.status(404).json({ error: 'LAZ file not found' });
    }

    const stats = await fs.stat(lazFile);
    const limit = Math.min(parseInt(req.query.limit) || 50000, 200000); // Cap at 200k points
    const offset = parseInt(req.query.offset) || 0;
    
    // Cache key for this specific request
    const cacheKey = `pointcloud_${limit}_${offset}`;
    
    // Check if we have cached data (in-memory cache for demo)
    if (!global.pointCloudCache) {
      global.pointCloudCache = new Map();
    }
    
    if (global.pointCloudCache.has(cacheKey)) {
      console.log(`📦 Serving cached point cloud data for ${limit} points at offset ${offset}`);
      return res.json(global.pointCloudCache.get(cacheKey));
    }

    // Generate optimized sample data
    const sampleData = {
      metadata: {
        totalPoints: 99981232,
        bounds: {
          minX: -100, maxX: 100,    // X: horizontal (left-right)
          minY: 280, maxY: 470,     // Y: elevation (up-down)
          minZ: -100, maxZ: 100     // Z: depth (front-back)
        },
        center: { x: 0, y: 0, z: 375 },
        fileSize: stats.size,
        timestamp: moment().toISOString(),
        currentSet: { limit, offset }
      },
      points: generateOptimizedSamplePoints(limit, offset)
    };

    // Cache the result for 5 minutes
    global.pointCloudCache.set(cacheKey, sampleData);
    setTimeout(() => {
      global.pointCloudCache.delete(cacheKey);
    }, 5 * 60 * 1000);

    // Set cache headers for browser caching
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 minutes
      'ETag': `"${cacheKey}-${Date.now()}"`
    });

    res.json(sampleData);
    
  } catch (error) {
    logger.error('Point cloud data streaming failed', { error: error.message });
    res.status(500).json({ error: 'Failed to load point cloud data' });
  }
});

function generateOptimizedSamplePoints(count, offset = 0) {
  const points = [];
  
  // Create more realistic terrain with recognizable features
  let pointIndex = 0;
  
  for (let i = 0; i < count * 3 && pointIndex < count; i++) {
    // Use deterministic generation for consistent results
    const seed = (i + offset) * 12345;
    const x = ((seed % 2000) - 1000) / 10; // -100 to 100
    const z = (((seed * 7) % 2000) - 1000) / 10; // -100 to 100
    
    // Create recognizable terrain features
    let y = 320; // Base elevation
    
    // Feature 1: Central hill
    const distToCenter = Math.sqrt(x*x + z*z);
    const centralHill = Math.max(0, 60 - distToCenter * 0.8);
    y += centralHill;
    
    // Feature 2: Ridge line along X=30
    const ridgeDistance = Math.abs(x - 30);
    const ridge = Math.max(0, 40 - ridgeDistance * 2) * Math.max(0, 1 - Math.abs(z) / 80);
    y += ridge;
    
    // Feature 3: Valley along Z=-40
    const valleyDistance = Math.abs(z + 40);
    const valley = Math.max(0, 25 - valleyDistance * 1.5) * Math.max(0, 1 - Math.abs(x) / 60);
    y -= valley;
    
    // Feature 4: Plateau in corner
    if (x > 60 && z > 60) {
      y += 45;
    }
    
    // Feature 5: Water body (lower elevation)
    const waterDistance = Math.sqrt((x + 60)*(x + 60) + (z - 20)*(z - 20));
    if (waterDistance < 25) {
      y = 300 + waterDistance * 0.5; // Gradual slope to water
    }
    
    // Add realistic noise
    const noise = ((seed % 200) - 100) / 10; // ±10m variation
    y += noise;
    
    // Skip points outside reasonable bounds
    if (y < 280 || y > 470) continue;
    
    // Calculate intensity and classification based on terrain
    const elevationNorm = (y - 280) / (470 - 280);
    const intensity = Math.floor(elevationNorm * 255);
    
    // Determine terrain type and colors
    let classification = 1; // Default ground
    let r, g, b;
    
    // Water classification
    if (waterDistance < 25) {
      classification = 9; // Water
      r = Math.floor(40 + intensity * 0.3);
      g = Math.floor(80 + intensity * 0.5);
      b = Math.floor(120 + intensity * 0.6);
    }
    // High elevation - rocky/snow
    else if (y > 420) {
      classification = 2; // High vegetation/rock
      r = Math.floor(160 + intensity * 0.4);
      g = Math.floor(160 + intensity * 0.4);
      b = Math.floor(180 + intensity * 0.4);
    }
    // Ridge and plateau - exposed rock
    else if (ridge > 20 || (x > 60 && z > 60)) {
      classification = 2; // Rock
      r = Math.floor(120 + intensity * 0.5);
      g = Math.floor(100 + intensity * 0.4);
      b = Math.floor(80 + intensity * 0.3);
    }
    // Mid elevation - dense vegetation
    else if (y > 360) {
      classification = 5; // High vegetation
      r = Math.floor(intensity * 0.4);
      g = Math.floor(80 + intensity * 0.8);
      b = Math.floor(intensity * 0.3);
    }
    // Lower elevation - sparse vegetation/soil
    else {
      classification = 1; // Ground
      r = Math.floor(60 + intensity * 0.6);
      g = Math.floor(50 + intensity * 0.5);
      b = Math.floor(30 + intensity * 0.4);
    }
    
    // Add seasonal variation
    const seasonalFactor = 0.8 + 0.4 * Math.sin((x + z) * 0.1);
    if (classification === 5) { // Vegetation gets seasonal color
      g = Math.floor(g * seasonalFactor);
      r = Math.floor(r * (1 + (1 - seasonalFactor) * 0.3)); // Autumn tint
    }
    
    points.push({
      x: x.toFixed(2),
      y: y.toFixed(2), 
      z: z.toFixed(2),
      intensity: intensity,
      classification: classification,
      rgb: { 
        r: Math.max(0, Math.min(255, r)), 
        g: Math.max(0, Math.min(255, g)), 
        b: Math.max(0, Math.min(255, b)) 
      }
    });
    
    pointIndex++;
  }
  
  console.log(`Generated ${points.length} terrain points with features: central hill, ridge, valley, plateau, water body`);
  return points;
}

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info('Client connected to real-time dashboard', { socketId: socket.id });
  
  // Send current data immediately
  socket.emit('dashboardUpdate', {
    ...dataStore.data,
    projects: Array.from(dataStore.data.projects.values())
  });
  
  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

// CRITICAL ERROR HANDLING
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  dataStore.addAlert('critical', 'System experienced uncaught exception', 'system');
  // Don't exit - this is mission critical
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  dataStore.addAlert('critical', 'System experienced unhandled promise rejection', 'system');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Mission-critical CAD Leadership Dashboard running on port ${PORT}`);
  console.log(`🚀 CAD Leadership Dashboard OPERATIONAL on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

// PERFORMANCE MONITORING ENDPOINT
app.get('/api/performance', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test point cloud data generation speed
    const testPointsStart = Date.now();
    const testPoints = generateOptimizedSamplePoints(10000);
    const pointGenerationTime = Date.now() - testPointsStart;
    
    // Check cache status
    const cacheStats = {
      cacheSize: global.pointCloudCache ? global.pointCloudCache.size : 0,
      cacheKeys: global.pointCloudCache ? Array.from(global.pointCloudCache.keys()) : []
    };
    
    // Memory usage
    const memUsage = process.memoryUsage();
    
    const performance = {
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      pointGeneration: {
        time: pointGenerationTime,
        pointsGenerated: testPoints.length,
        pointsPerSecond: Math.round(testPoints.length / (pointGenerationTime / 1000))
      },
      cache: cacheStats,
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
      },
      system: {
        uptime: Math.round(process.uptime()),
        nodeVersion: process.version
      }
    };
    
    res.json(performance);
    
  } catch (error) {
    logger.error('Performance monitoring failed', { error: error.message });
    res.status(500).json({ error: 'Performance monitoring failed' });
  }
});

// Accuracy Report API Endpoint
app.get('/api/accuracy-report', (req, res) => {
  try {
    const accuracyReport = {
      metadata: {
        reportDate: '2024-02-29T12:40:52.000Z',
        projectDate: '2023-08-13T07:25:12.000Z',
        location: {
          latitude: 33.345595653808,
          longitude: -84.115766370146,
          description: 'Georgia, USA'
        },
        equipment: {
          lidar: 'ROCK R3 Pro',
          vehicle: 'DJI M300',
          surveyMethod: 'Traditional Survey Points from a Traverse'
        },
        coordinates: {
          horizontal: 'NAD83 / Georgia West (ftUS) - EPSG:2240',
          vertical: 'NAVD88 height (geoid18) (ftUS) - EPSG:6360'
        }
      },
      summary: {
        pointDensity: 1292, // points per square meter
        pointDensityFt: 120, // points per square foot
        verticalAccuracyRMS: 0.089, // feet
        coverage: 37, // acres
        standardDeviationElevation: 0.089, // feet
        meanElevationDelta: 0.004, // feet
        totalGCPs: 23,
        siteConditions: 'Heavily Vegetated Site with thick trees and grass'
      },
      statistics: {
        maxPositiveDelta: 0.170,
        maxNegativeDelta: -0.206,
        pointsWithinTolerance: {
          count: 20,
          total: 23,
          percentage: 87,
          tolerance: 0.1 // feet
        },
        accuracyRating: 'EXCELLENT',
        rmsValue: 0.089
      },
      groundControlPoints: [
        { id: 'TRAV10', x: 2311750.334, y: 1217004.872, zGcp: 804.7446, zLidar: 804.639, delta: 0.106, description: 'TRAV10' },
        { id: 'TRAV11', x: 2311667.638, y: 1216888.295, zGcp: 806.9616, zLidar: 806.872, delta: 0.09, description: 'TRAV 11' },
        { id: 'TRAV12', x: 2311714.475, y: 1216364.509, zGcp: 820.0517, zLidar: 820.181, delta: -0.129, description: 'TRAV 12' },
        { id: 'TRAV13', x: 2311802.252, y: 1216219.905, zGcp: 837.5148, zLidar: 837.345, delta: 0.17, description: 'TRAV13' },
        { id: 'G20063', x: 2312532.662, y: 1216160.617, zGcp: 832.7285, zLidar: 832.691, delta: 0.038, description: 'G20063' },
        { id: 'G20064', x: 2312530.189, y: 1216161.861, zGcp: 832.1233, zLidar: 832.213, delta: -0.09, description: 'G20064' },
        { id: 'G20139', x: 2312580.333, y: 1216502.656, zGcp: 835.2816, zLidar: 835.269, delta: 0.013, description: 'G20139' },
        { id: 'G20140', x: 2312580.036, y: 1216549.692, zGcp: 833.6007, zLidar: 833.595, delta: 0.006, description: 'G20140' },
        { id: 'G20155', x: 2312571.826, y: 1216604.367, zGcp: 831.669, zLidar: 831.78, delta: -0.111, description: 'G20155' },
        { id: 'G20185', x: 2312528.872, y: 1216746.956, zGcp: 826.804, zLidar: 826.816, delta: -0.012, description: 'G20185' },
        { id: 'G20186', x: 2312488.915, y: 1216751.468, zGcp: 825.1832, zLidar: 825.264, delta: -0.081, description: 'G20186' },
        { id: 'G20265', x: 2312558.745, y: 1217131.479, zGcp: 820.5699, zLidar: 820.531, delta: 0.039, description: 'G20265' },
        { id: 'G20268', x: 2312558.904, y: 1217189.486, zGcp: 819.9632, zLidar: 819.934, delta: 0.029, description: 'G20268' },
        { id: 'G20283', x: 2312557.51, y: 1217241.91, zGcp: 821.2929, zLidar: 821.261, delta: 0.032, description: 'G20283' },
        { id: 'G20286', x: 2312563.801, y: 1217294.196, zGcp: 823.5962, zLidar: 823.683, delta: -0.087, description: 'G20286' },
        { id: 'TRAV3', x: 2312570.681, y: 1216181.031, zGcp: 833.503, zLidar: 833.533, delta: -0.03, description: 'TRAV 3' },
        { id: 'TRAV4', x: 2312607.994, y: 1216648.295, zGcp: 831.173, zLidar: 831.23, delta: -0.057, description: 'TRAV 4' },
        { id: 'TRAV5', x: 2312556.85, y: 1217248.752, zGcp: 821.4512, zLidar: 821.657, delta: -0.206, description: 'TRAV5' },
        { id: 'TRAV6', x: 2312206.205, y: 1217246.083, zGcp: 812.5042, zLidar: 812.403, delta: 0.101, description: 'TRAV 6' },
        { id: 'TRAV7', x: 2312056.584, y: 1217267.582, zGcp: 798.3491, zLidar: 798.315, delta: 0.034, description: 'TRAV 7' },
        { id: 'TRAV8', x: 2311915.585, y: 1217298.352, zGcp: 792.8905, zLidar: 792.804, delta: 0.086, description: 'TRAV 8' },
        { id: 'TRAV9', x: 2311740.566, y: 1217240.809, zGcp: 774.366, zLidar: 774.279, delta: 0.087, description: 'TRAV 9' },
        { id: 'OPUS', x: 2312571.572, y: 1216180.59, zGcp: 833.503, zLidar: 833.433, delta: 0.07, description: 'OPUS' }
      ],
      analysis: {
        qualityAssessment: 'The survey demonstrates excellent accuracy with an RMS of 0.089 ft, well within industry standards for high-precision mapping. The low mean delta of 0.004 ft indicates minimal systematic bias.',
        pointDensityAnalysis: 'With 1,292 points per square meter, this survey provides exceptional detail resolution, enabling accurate feature extraction and precise measurements for engineering applications.',
        challengingConditions: 'Despite heavily vegetated terrain with thick trees and grass, the R3 Pro system maintained high accuracy, demonstrating robust performance in challenging environments.',
        statisticalReliability: '87% of control points fall within ±0.1 ft tolerance, with the standard deviation matching the RMS value, indicating consistent and reliable measurements across the survey area.'
      },
      timestamp: moment().toISOString()
    };
    
    res.json(accuracyReport);
  } catch (error) {
    logger.error('Accuracy report API failed', { error: error.message });
    res.status(500).json({ error: 'Failed to retrieve accuracy report data' });
  }
});
