const CONFIG = require('../config/constants');
const { getRunningJobs, getPendingJobs } = require('../db/jobs');
const logger = require('../utils/logger');

class QueueManager {
  constructor() {
    this.runningJobs = new Set();
    this.queuedJobs = [];
    this.maxConcurrentJobs = CONFIG.MAX_CONCURRENT_JOBS;
  }

  async initialize() {
    // Load existing running jobs from database
    const runningJobs = await getRunningJobs();
    this.runningJobs = new Set(runningJobs.map(job => job.id));
    
    logger.info(`Queue manager initialized: ${this.runningJobs.size} running jobs`);
  }

  canStartNewJob() {
    return this.runningJobs.size < this.maxConcurrentJobs;
  }

  addJobToQueue(job) {
    this.queuedJobs.push(job);
    logger.info(`Job ${job.id} added to queue. Queue length: ${this.queuedJobs.length}`);
  }

  markJobStarted(jobId) {
    this.runningJobs.add(jobId);
    logger.info(`Job ${jobId} started. Running jobs: ${this.runningJobs.size}/${this.maxConcurrentJobs}`);
  }

  markJobCompleted(jobId) {
    this.runningJobs.delete(jobId);
    logger.info(`Job ${jobId} completed. Running jobs: ${this.runningJobs.size}/${this.maxConcurrentJobs}`);
    
    // Process next job in queue
    this.processNextJob();
  }

  async processNextJob() {
    if (!this.canStartNewJob() || this.queuedJobs.length === 0) {
      return null;
    }

    const nextJob = this.queuedJobs.shift();
    this.markJobStarted(nextJob.id);
    
    logger.info(`Processing next job from queue: ${nextJob.id}`);
    return nextJob;
  }

  getQueueStatus() {
    return {
      running: this.runningJobs.size,
      maxConcurrent: this.maxConcurrentJobs,
      queued: this.queuedJobs.length,
      canStartNew: this.canStartNewJob()
    };
  }

  async waitForSlot() {
    const maxWaitTime = 30000; // 30 seconds max wait
    const checkInterval = 1000; // Check every second
    let waitTime = 0;

    while (!this.canStartNewJob() && waitTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      waitTime += checkInterval;
    }

    if (!this.canStartNewJob()) {
      throw new Error('Queue full: Could not start job within timeout period');
    }
  }

  async executeWithQueue(jobId, jobFunction) {
    try {
      await this.waitForSlot();
      this.markJobStarted(jobId);
      
      const result = await jobFunction();
      
      this.markJobCompleted(jobId);
      return result;
    } catch (error) {
      this.markJobCompleted(jobId);
      throw error;
    }
  }
}

// Singleton instance
const queueManager = new QueueManager();

module.exports = queueManager;
