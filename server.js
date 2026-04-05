require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { resumeInterruptedJobs } = require('./src/agents/resumeInterruptedJobs');
const { testConnection } = require('./src/db/supabase');
const queueManager = require('./src/services/queueManager');
const logger = require('./src/utils/logger');

// Import routes
const runAgentRoute = require('./src/routes/runAgentRoute');
const autoContinueRoute = require('./src/routes/autoContinueRoute');
const fullIraqCoverageRoute = require('./src/routes/fullIraqCoverageRoute');
const jobStatusRoute = require('./src/routes/jobStatusRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Register API routes
app.use('/api', runAgentRoute);
app.use('/api', autoContinueRoute);
app.use('/api', fullIraqCoverageRoute);
app.use('/api', jobStatusRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    queue: queueManager.getQueueStatus()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Qahbaxana AI Agent System',
    version: '1.0.0',
    description: 'Production-ready backend AI Governor Agent system for Iraqi business data collection',
    endpoints: {
      'POST /api/run-agent': 'Run single agent for governorate + category',
      'POST /api/auto-continue': 'Run all categories for one governorate',
      'POST /api/full-iraq-coverage': 'Run all governorates and categories',
      'GET /api/job/:id': 'Get job status and progress',
      'GET /health': 'Health check and queue status'
    }
  });
});

// Initialize server
async function initializeServer() {
  try {
    logger.info('🚀 Initializing Qahbaxana AI Agent System...');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    
    // Initialize queue manager
    await queueManager.initialize();
    
    // Resume interrupted jobs
    logger.info('🔄 Checking for interrupted jobs...');
    const resumeResults = await resumeInterruptedJobs();
    
    if (resumeResults.resumed > 0) {
      logger.info(`✅ Resumed ${resumeResults.resumed} interrupted jobs`);
    } else {
      logger.info('✅ No interrupted jobs to resume');
    }
    
    logger.info('✅ Server initialization completed');
    
  } catch (error) {
    logger.error('❌ Server initialization failed:', error);
    // Don't exit the process, just log the error
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🤖 Qahbaxana AI Agent System running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API docs: http://localhost:${PORT}/`);
  console.log(`\n🚀 Available endpoints:`);
  console.log(`  POST /api/run-agent - Run single agent`);
  console.log(`  POST /api/auto-continue - Run all categories for a governorate`);
  console.log(`  POST /api/full-iraq-coverage - Run all governorates and categories`);
  console.log(`  GET /api/job/:id - Get job status`);
  console.log(`  GET /health - Health check`);
  
  // Initialize server components
  await initializeServer();
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
