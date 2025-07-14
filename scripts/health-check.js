#!/usr/bin/env node

/**
 * MISSION-CRITICAL HEALTH CHECK SCRIPT
 * This script performs comprehensive system health checks
 * for the CAD Leadership Dashboard
 */

const http = require('http');
const fs = require('fs-extra');
const path = require('path');

const HEALTH_CHECK_URL = 'http://localhost:3000/api/health';
const CRITICAL_THRESHOLDS = {
    responseTime: 5000, // 5 seconds max response time
    memoryUsage: 512 * 1024 * 1024, // 512MB max memory usage
    diskSpace: 1024 * 1024 * 1024, // 1GB min free disk space
};

async function performHealthCheck() {
    console.log('🔍 Starting mission-critical health check...');
    const results = {
        timestamp: new Date().toISOString(),
        status: 'HEALTHY',
        checks: {},
        errors: []
    };

    try {
        // 1. API Endpoint Health Check
        console.log('📡 Checking API endpoint...');
        const apiHealth = await checkAPIHealth();
        results.checks.api = apiHealth;
        
        if (!apiHealth.healthy) {
            results.status = 'CRITICAL';
            results.errors.push('API endpoint not responding');
        }

        // 2. File System Check
        console.log('💾 Checking file system...');
        const fsHealth = await checkFileSystem();
        results.checks.fileSystem = fsHealth;
        
        if (!fsHealth.healthy) {
            results.status = 'WARNING';
            results.errors.push('File system issues detected');
        }

        // 3. Dependencies Check
        console.log('📦 Checking dependencies...');
        const depsHealth = checkDependencies();
        results.checks.dependencies = depsHealth;
        
        if (!depsHealth.healthy) {
            results.status = 'CRITICAL';
            results.errors.push('Missing critical dependencies');
        }

        // 4. Log Analysis
        console.log('📄 Analyzing logs...');
        const logHealth = await analyzeLogs();
        results.checks.logs = logHealth;
        
        if (logHealth.criticalErrors > 0) {
            results.status = 'CRITICAL';
            results.errors.push(`${logHealth.criticalErrors} critical errors in logs`);
        }

    } catch (error) {
        results.status = 'CRITICAL';
        results.errors.push(`Health check failed: ${error.message}`);
        console.error('❌ Health check failed:', error);
    }

    // Output results
    console.log('\n📊 HEALTH CHECK RESULTS:');
    console.log('========================');
    console.log(`Status: ${getStatusIcon(results.status)} ${results.status}`);
    console.log(`Timestamp: ${results.timestamp}`);
    
    if (results.errors.length > 0) {
        console.log('\n❌ ERRORS:');
        results.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('\n📋 DETAILED CHECKS:');
    Object.entries(results.checks).forEach(([check, result]) => {
        const icon = result.healthy ? '✅' : '❌';
        console.log(`  ${icon} ${check}: ${result.healthy ? 'HEALTHY' : 'UNHEALTHY'}`);
        if (result.details) {
            console.log(`     Details: ${result.details}`);
        }
    });

    // Exit with appropriate code
    const exitCode = results.status === 'CRITICAL' ? 1 : 0;
    process.exit(exitCode);
}

async function checkAPIHealth() {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const req = http.get(HEALTH_CHECK_URL, (res) => {
            const responseTime = Date.now() - startTime;
            let data = '';
            
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const healthData = JSON.parse(data);
                    resolve({
                        healthy: res.statusCode === 200 && responseTime < CRITICAL_THRESHOLDS.responseTime,
                        responseTime,
                        status: healthData.status,
                        details: `Response time: ${responseTime}ms`
                    });
                } catch (error) {
                    resolve({
                        healthy: false,
                        details: `Invalid response: ${error.message}`
                    });
                }
            });
        });

        req.on('error', (error) => {
            resolve({
                healthy: false,
                details: `Connection failed: ${error.message}`
            });
        });

        req.setTimeout(CRITICAL_THRESHOLDS.responseTime, () => {
            req.abort();
            resolve({
                healthy: false,
                details: 'Request timeout'
            });
        });
    });
}

async function checkFileSystem() {
    try {
        const requiredDirs = ['./logs', './uploads', './public'];
        const missingDirs = [];
        
        for (const dir of requiredDirs) {
            if (!await fs.pathExists(dir)) {
                missingDirs.push(dir);
            }
        }

        // Check disk space
        const stats = await fs.stat('./');
        const diskSpace = stats.size || 0;
        
        return {
            healthy: missingDirs.length === 0 && diskSpace > CRITICAL_THRESHOLDS.diskSpace,
            details: missingDirs.length > 0 ? `Missing directories: ${missingDirs.join(', ')}` : 'All directories present'
        };
    } catch (error) {
        return {
            healthy: false,
            details: `File system check failed: ${error.message}`
        };
    }
}

function checkDependencies() {
    try {
        const packageJson = require('../package.json');
        const requiredDeps = ['express', 'socket.io', 'winston', 'helmet'];
        const missingDeps = [];
        
        for (const dep of requiredDeps) {
            try {
                require.resolve(dep);
            } catch (error) {
                missingDeps.push(dep);
            }
        }
        
        return {
            healthy: missingDeps.length === 0,
            details: missingDeps.length > 0 ? `Missing: ${missingDeps.join(', ')}` : 'All dependencies available'
        };
    } catch (error) {
        return {
            healthy: false,
            details: `Dependency check failed: ${error.message}`
        };
    }
}

async function analyzeLogs() {
    try {
        const logFiles = ['./logs/error.log', './logs/combined.log'];
        let criticalErrors = 0;
        let warnings = 0;
        
        for (const logFile of logFiles) {
            if (await fs.pathExists(logFile)) {
                const content = await fs.readFile(logFile, 'utf8');
                const lines = content.split('\n');
                
                // Analyze last 100 lines for recent issues
                const recentLines = lines.slice(-100);
                
                recentLines.forEach(line => {
                    if (line.includes('"level":"error"') || line.includes('CRITICAL')) {
                        criticalErrors++;
                    } else if (line.includes('"level":"warn"') || line.includes('WARNING')) {
                        warnings++;
                    }
                });
            }
        }
        
        return {
            healthy: criticalErrors === 0,
            criticalErrors,
            warnings,
            details: `${criticalErrors} critical errors, ${warnings} warnings in recent logs`
        };
    } catch (error) {
        return {
            healthy: false,
            details: `Log analysis failed: ${error.message}`
        };
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'HEALTHY': return '🟢';
        case 'WARNING': return '🟡';
        case 'CRITICAL': return '🔴';
        default: return '⚪';
    }
}

// Run health check if called directly
if (require.main === module) {
    performHealthCheck().catch(error => {
        console.error('❌ Health check script failed:', error);
        process.exit(1);
    });
}

module.exports = { performHealthCheck };
