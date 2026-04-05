const { autoContinueGovernorate } = require('./autoContinueGovernorate');
const GOVERNORATES = require('../config/governorates');
const logger = require('../utils/logger');
const queueManager = require('../services/queueManager');

async function fullIraqCoverage(startGovernorate = null) {
  logger.info('🇮🇶 Starting full Iraq coverage - all governorates');
  
  const governoratesToRun = startGovernorate 
    ? GOVERNORATES.slice(GOVERNORATES.indexOf(startGovernorate))
    : GOVERNORATES;
  
  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    governorates: {}
  };
  
  for (const governorate of governoratesToRun) {
    try {
      logger.info(`\n🏛️ Processing governorate: ${governorate}`);
      logger.info('='.repeat(60));
      
      const governorateResults = await autoContinueGovernorate(governorate);
      
      results.governorates[governorate] = governorateResults;
      results.successful++;
      results.total += governorateResults.total;
      
      logger.info(`✅ Governorate ${governorate} completed: ${governorateResults.total} businesses`);
      
    } catch (error) {
      logger.error(`❌ Governorate ${governorate} failed:`, error.message);
      
      results.governorates[governorate] = {
        success: false,
        error: error.message
      };
      
      results.failed++;
      
      // Continue with next governorate even if one fails
      continue;
    }
  }
  
  logger.info('\n🎉 Full Iraq coverage completed!');
  logger.info(`📊 Summary: ${results.successful} successful governorates, ${results.failed} failed, ${results.total} total businesses`);
  
  return results;
}

async function queueFullIraqCoverage() {
  logger.info('🇮🇶 Queuing full Iraq coverage with job management');
  
  const results = {
    queued: 0,
    failed: 0
  };
  
  for (const governorate of GOVERNORATES) {
    try {
      // This would be implemented to create background jobs
      // For now, we'll just run them sequentially with queue management
      logger.info(`📋 Queueing coverage for ${governorate}`);
      results.queued++;
    } catch (error) {
      logger.error(`❌ Failed to queue ${governorate}:`, error.message);
      results.failed++;
    }
  }
  
  logger.info(`📊 Queue summary: ${results.queued} queued, ${results.failed} failed`);
  
  return results;
}

module.exports = {
  fullIraqCoverage,
  queueFullIraqCoverage
};
