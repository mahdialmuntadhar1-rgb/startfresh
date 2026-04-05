const { createJob, completeJob, failJob } = require('../db/jobs');
const { fetchFromAllSources, removeObviousDuplicates } = require('../sources/mergeSources');
const { validateBatch } = require('../services/validator');
const { normalizeBatch } = require('../services/normalizer');
const { deduplicateBatch } = require('../services/deduplicator');
const { setProgressFetching, setProgressCleaning, setProgressDeduplicating, setProgressSaving, setProgressDone } = require('../services/progressTracker');
const queueManager = require('../services/queueManager');
const logger = require('../utils/logger');

async function runAgent(governorate, category) {
  let job = null;
  
  try {
    // Step 1: Create job
    logger.info(`🚀 Starting agent: ${category} in ${governorate}`);
    job = await createJob(governorate, category);
    
    // Execute with queue management
    return await queueManager.executeWithQueue(job.id, async () => {
      
      // Step 2: Fetch from all sources
      await setProgressFetching(job.id);
      const sourceResults = await fetchFromAllSources(governorate, category);
      
      // Step 3: Remove obvious duplicates
      const deduplicatedSources = removeObviousDuplicates(sourceResults.all);
      
      // Step 4: Validate data
      await setProgressCleaning(job.id);
      const validationResults = validateBatch(deduplicatedSources);
      
      if (validationResults.valid.length === 0) {
        logger.warn('No valid businesses after validation');
        await completeJob(job.id, sourceResults.total, 0);
        return [];
      }
      
      // Step 5: Normalize data
      const normalizedBusinesses = normalizeBatch(validationResults.valid);
      
      // Step 6: Deduplicate and save to database
      await setProgressDeduplicating(job.id);
      const deduplicationResults = await deduplicateBatch(normalizedBusinesses, job.id);
      
      await setProgressSaving(job.id);
      
      // Step 7: Complete job
      await setProgressDone(job.id);
      await completeJob(job.id, sourceResults.total, deduplicationResults.processed.length);
      
      logger.info(`✅ Agent completed: ${deduplicationResults.processed.length} new businesses saved`);
      
      return deduplicationResults.processed;
    });
    
  } catch (error) {
    logger.error(`❌ Agent execution failed for ${category} in ${governorate}:`, error);
    
    if (job) {
      await failJob(job.id, error.message);
    }
    
    throw error;
  }
}

module.exports = {
  runAgent
};
