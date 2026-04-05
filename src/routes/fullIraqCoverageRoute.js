const express = require('express');
const { fullIraqCoverage } = require('../agents/fullIraqCoverage');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/full-iraq-coverage', async (req, res) => {
  try {
    const { startGovernorate } = req.body;

    logger.info(`📥 Received full Iraq coverage request`);
    
    // Run full coverage in background (fire and forget)
    fullIraqCoverage(startGovernorate)
      .then(result => {
        logger.info(`✅ Full Iraq coverage completed: ${result.total} businesses`);
      })
      .catch(error => {
        logger.error(`❌ Full Iraq coverage failed:`, error);
      });

    res.json({
      success: true,
      message: 'Full Iraq coverage started',
      status: 'running',
      startGovernorate: startGovernorate || null,
      note: 'This will run through all governorates and categories sequentially in the background'
    });

  } catch (error) {
    logger.error('Full Iraq coverage route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
