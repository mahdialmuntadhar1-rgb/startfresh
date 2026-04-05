const { queryGemini } = require('../services/aiParser');
const logger = require('../utils/logger');
const { sleep } = require('../utils/sleep');

async function fetchFromGemini(governorate, category) {
  try {
    logger.info(`🤖 Fetching from Gemini: ${category} in ${governorate}`);
    
    const businesses = await queryGemini(governorate, category);
    
    logger.info(`✅ Gemini returned ${businesses.length} businesses`);
    
    return businesses;
  } catch (error) {
    logger.error(`❌ Gemini fetch failed for ${category} in ${governorate}:`, error);
    throw error;
  }
}

module.exports = {
  fetchFromGemini
};
