const { updateJobStatus } = require('../db/jobs');
const CONFIG = require('../config/constants');
const logger = require('../utils/logger');

async function updateProgress(jobId, step, customProgress = null) {
  try {
    const progress = customProgress !== null ? customProgress : CONFIG.PROGRESS_STEPS[step];
    
    const job = await updateJobStatus(jobId, CONFIG.JOB_STATUS.RUNNING, progress, step);
    
    logger.info(`Job ${jobId} progress: ${progress}% - ${step}`);
    
    return job;
  } catch (error) {
    logger.error(`Failed to update progress for job ${jobId}:`, error);
    throw error;
  }
}

async function setProgressFetching(jobId, customProgress = null) {
  return updateProgress(jobId, 'FETCHING', customProgress);
}

async function setProgressCleaning(jobId, customProgress = null) {
  return updateProgress(jobId, 'CLEANING', customProgress);
}

async function setProgressDeduplicating(jobId, customProgress = null) {
  return updateProgress(jobId, 'DEDUPLICATING', customProgress);
}

async function setProgressSaving(jobId, customProgress = null) {
  return updateProgress(jobId, 'SAVING', customProgress);
}

async function setProgressDone(jobId) {
  return updateProgress(jobId, 'DONE', 100);
}

async function updateBusinessCounts(jobId, businessesFound, businessesSaved) {
  try {
    const { updateJobStatus } = require('../db/jobs');
    const job = await updateJobStatus(jobId, CONFIG.JOB_STATUS.RUNNING, null, null, null);
    
    logger.info(`Job ${jobId} counts: ${businessesFound} found, ${businessesSaved} saved`);
    
    return job;
  } catch (error) {
    logger.error(`Failed to update business counts for job ${jobId}:`, error);
    throw error;
  }
}

module.exports = {
  updateProgress,
  setProgressFetching,
  setProgressCleaning,
  setProgressDeduplicating,
  setProgressSaving,
  setProgressDone,
  updateBusinessCounts
};
