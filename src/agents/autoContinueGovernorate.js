const { runAgent } = require('./runAgent');
const CATEGORIES = require('../config/categories');
const logger = require('../utils/logger');
const { sleep } = require('../utils/sleep');

async function autoContinueGovernorate(governorate, startCategory = null) {
  logger.info(`📍 Starting auto-continue for ${governorate}`);
  
  const categoriesToRun = startCategory 
    ? CATEGORIES.slice(CATEGORIES.indexOf(startCategory))
    : CATEGORIES;
  
  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    categories: {}
  };
  
  for (const category of categoriesToRun) {
    try {
      logger.info(`\n📍 ${governorate} → ${category}`);
      logger.info('='.repeat(50));
      
      const businesses = await runAgent(governorate, category);
      
      results.categories[category] = {
        success: true,
        count: businesses.length
      };
      
      results.successful++;
      results.total += businesses.length;
      
      logger.info(`✅ Completed ${category}: ${businesses.length} businesses saved`);
      
      // Small delay between categories to avoid rate limiting
      await sleep(2000);
      
    } catch (error) {
      logger.error(`❌ Failed ${category}:`, error.message);
      
      results.categories[category] = {
        success: false,
        error: error.message
      };
      
      results.failed++;
      
      // Continue with next category even if one fails
      continue;
    }
  }
  
  logger.info(`\n🎉 Auto-continue completed for ${governorate}`);
  logger.info(`📊 Summary: ${results.successful} successful, ${results.failed} failed, ${results.total} total businesses`);
  
  return results;
}

module.exports = {
  autoContinueGovernorate
};
