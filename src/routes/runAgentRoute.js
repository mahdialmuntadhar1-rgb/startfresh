const express = require('express');
const { runAgent } = require('../agents/runAgent');
const { getJobById } = require('../db/jobs');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/run-agent', async (req, res) => {
  try {
    const { governorate, category } = req.body;

    // Validate input
    if (!governorate || !category) {
      return res.status(400).json({
        success: false,
        error: 'Both governorate and category are required'
      });
    }

    if (typeof governorate !== 'string' || typeof category !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Governorate and category must be strings'
      });
    }

    logger.info(`📥 Received agent request: ${category} in ${governorate}`);
    
    // Run agent in background (fire and forget)
    runAgent(governorate, category)
      .then(result => {
        logger.info(`✅ Agent completed: ${category} in ${governorate}, ${result.length} businesses`);
      })
      .catch(error => {
        logger.error(`❌ Agent failed: ${category} in ${governorate}:`, error);
      });

    // Return immediate response
    res.json({
      success: true,
      message: `Agent started for ${category} in ${governorate}`,
      status: 'running',
      note: 'Check job status using /api/job/:id endpoint'
    });

  } catch (error) {
    logger.error('Run agent route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
