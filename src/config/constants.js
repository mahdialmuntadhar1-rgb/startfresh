// System configuration constants
const CONFIG = {
  MAX_CONCURRENT_JOBS: 2,
  MAX_RETRIES: 3,
  SOURCE_DELAY_MS: 3000,
  MAX_BUSINESSES_PER_RUN: 30,
  
  // Progress tracking steps
  PROGRESS_STEPS: {
    CREATED: 10,
    FETCHING: 30,
    CLEANING: 50,
    DEDUPLICATING: 70,
    SAVING: 90,
    DONE: 100
  },
  
  // Job statuses
  JOB_STATUS: {
    PENDING: 'pending',
    RUNNING: 'running',
    DONE: 'done',
    FAILED: 'failed'
  },
  
  // Staging business statuses
  STAGING_STATUS: {
    PENDING: 'pending',
    DUPLICATE: 'duplicate',
    PROMOTED: 'promoted',
    REJECTED: 'rejected'
  }
};

module.exports = CONFIG;
