const express = require('express');
const { getJobById } = require('../db/jobs');
const { getStagingBusinessesByJob } = require('../db/stagingBusinesses');
const { getBusinessesByJob } = require('../db/businesses');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/job/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Job ID is required'
      });
    }

    // Get job details
    const job = await getJobById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Get staging businesses count
    const stagingBusinesses = await getStagingBusinessesByJob(id);
    const stagingStats = {
      total: stagingBusinesses.length,
      pending: stagingBusinesses.filter(b => b.status === 'pending').length,
      duplicate: stagingBusinesses.filter(b => b.status === 'duplicate').length,
      promoted: stagingBusinesses.filter(b => b.status === 'promoted').length,
      rejected: stagingBusinesses.filter(b => b.status === 'rejected').length
    };

    // Get final businesses count
    const businesses = await getBusinessesByJob(id);

    const response = {
      success: true,
      job: {
        id: job.id,
        governorate: job.governorate,
        category: job.category,
        status: job.status,
        progress: job.progress,
        current_step: job.current_step,
        retry_count: job.retry_count,
        businesses_found: job.businesses_found,
        businesses_saved: job.businesses_saved,
        error_message: job.error_message,
        created_at: job.created_at,
        updated_at: job.updated_at,
        completed_at: job.completed_at
      },
      staging: stagingStats,
      businesses: {
        total: businesses.length
      }
    };

    res.json(response);

  } catch (error) {
    logger.error('Job status route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    // This would need to be implemented in jobs.js
    // For now, return a simple response
    res.json({
      success: true,
      message: 'Jobs listing endpoint - to be implemented',
      filters: { status, limit, offset }
    });

  } catch (error) {
    logger.error('Jobs list route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;
