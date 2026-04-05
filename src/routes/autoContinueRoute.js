const express = require('express');
const { autoContinueGovernorate } = require('../agents/autoContinueGovernorate');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/auto-continue', async (req, res) => {
  try {
    const { governorate, startCategory } = req.body;

    if (!governorate) {
      return res.status(400).json({
        success: false,
        error: 'Governorate is required'
      });
    }

    if (typeof governorate !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Governorate must be a string'
      });
    }

    logger.info(`📥 Received auto-continue request for ${governorate}`);
    
    // Run auto-continue in background (fire and forget)
    autoContinueGovernorate(governorate, startCategory)
      .then(result => {
        logger.info(`✅ Auto-continue completed for ${governorate}: ${result.total} businesses`);
      })
      .catch(error => {
        logger.error(`❌ Auto-continue failed for ${governorate}:`, error);
      });

    res.json({
      success: true,
      message: `Auto-continue started for ${governorate}`,
      status: 'running',
      governorate,
      startCategory: startCategory || null,
      note: 'This will run through all categories sequentially in the background'
    });

  } catch (error) {
    logger.error('Auto-continue route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
