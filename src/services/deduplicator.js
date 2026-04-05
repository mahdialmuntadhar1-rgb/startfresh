const { findDuplicateBusiness } = require('../db/businesses');
const { createDeduplicationKey } = require('./normalizer');
const { saveStagingBusiness, markStagingBusinessDuplicate, markStagingBusinessPromoted } = require('../db/stagingBusinesses');
const { promoteStagingToBusiness } = require('../db/businesses');
const logger = require('../utils/logger');

async function checkAndProcessDuplicate(business, jobId) {
  try {
    // Create deduplication key
    const deduplicationKey = createDeduplicationKey(business);
    
    // Check for existing duplicate
    const existing = await findDuplicateBusiness(deduplicationKey);
    
    if (existing) {
      logger.info(`Duplicate found: ${business.name} (matches existing ID: ${existing.id})`);
      return { isDuplicate: true, existingBusiness: existing };
    }
    
    return { isDuplicate: false, existingBusiness: null };
  } catch (error) {
    logger.error('Duplicate check error:', error);
    // If duplicate check fails, assume it's not a duplicate to avoid data loss
    return { isDuplicate: false, existingBusiness: null };
  }
}

async function processBusinessWithDeduplication(business, jobId) {
  try {
    // Save to staging immediately
    const staging = await saveStagingBusiness(business, jobId);
    logger.debug(`Saved to staging: ${business.name} (ID: ${staging.id})`);
    
    // Check for duplicates
    const { isDuplicate, existingBusiness } = await checkAndProcessDuplicate(business, jobId);
    
    if (isDuplicate) {
      // Mark as duplicate
      await markStagingBusinessDuplicate(staging.id, `Matches existing business: ${existingBusiness.id}`);
      logger.info(`Marked as duplicate: ${business.name}`);
      return { status: 'duplicate', staging, existing: existingBusiness };
    } else {
      // Promote to final businesses table
      const finalBusiness = await promoteStagingToBusiness(staging.id);
      logger.info(`Promoted to businesses: ${business.name} (ID: ${finalBusiness.id})`);
      return { status: 'promoted', staging, business: finalBusiness };
    }
  } catch (error) {
    logger.error(`Failed to process business ${business.name}:`, error);
    return { status: 'error', business, error: error.message };
  }
}

async function deduplicateBatch(businesses, jobId) {
  const results = {
    processed: [],
    duplicates: [],
    errors: [],
    total: businesses.length
  };
  
  logger.info(`Starting deduplication for ${businesses.length} businesses`);
  
  for (const business of businesses) {
    try {
      const result = await processBusinessWithDeduplication(business, jobId);
      
      if (result.status === 'promoted') {
        results.processed.push(result.business);
      } else if (result.status === 'duplicate') {
        results.duplicates.push(result);
      } else {
        results.errors.push(result);
      }
    } catch (error) {
      logger.error(`Critical error processing ${business.name}:`, error);
      results.errors.push({ business, error: error.message });
    }
  }
  
  logger.info(`Deduplication complete: ${results.processed.length} promoted, ${results.duplicates.length} duplicates, ${results.errors.length} errors`);
  
  return results;
}

module.exports = {
  checkAndProcessDuplicate,
  processBusinessWithDeduplication,
  deduplicateBatch
};
