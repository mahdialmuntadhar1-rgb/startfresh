const { supabase } = require('./supabase');
const CONFIG = require('../config/constants');

async function saveStagingBusiness(record, jobId) {
  try {
    const { data, error } = await supabase
      .from('staging_businesses')
      .insert({
        job_id: jobId,
        name: record.name,
        category: record.category,
        governorate: record.governorate,
        city: record.city,
        phone: record.phone || null,
        source: record.source,
        confidence: record.confidence || 0.5,
        status: CONFIG.STAGING_STATUS.PENDING
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Save staging business error:', error);
    throw error;
  }
}

async function markStagingBusinessDuplicate(id, reason) {
  try {
    const { data, error } = await supabase
      .from('staging_businesses')
      .update({
        status: CONFIG.STAGING_STATUS.DUPLICATE,
        duplicate_reason: reason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Mark staging business duplicate error:', error);
    throw error;
  }
}

async function markStagingBusinessRejected(id, reason) {
  try {
    const { data, error } = await supabase
      .from('staging_businesses')
      .update({
        status: CONFIG.STAGING_STATUS.REJECTED,
        duplicate_reason: reason
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Mark staging business rejected error:', error);
    throw error;
  }
}

async function markStagingBusinessPromoted(id) {
  try {
    const { data, error } = await supabase
      .from('staging_businesses')
      .update({
        status: CONFIG.STAGING_STATUS.PROMOTED
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Mark staging business promoted error:', error);
    throw error;
  }
}

async function getStagingBusinessesByJob(jobId) {
  try {
    const { data, error } = await supabase
      .from('staging_businesses')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get staging businesses by job error:', error);
    return [];
  }
}

module.exports = {
  saveStagingBusiness,
  markStagingBusinessDuplicate,
  markStagingBusinessRejected,
  markStagingBusinessPromoted,
  getStagingBusinessesByJob
};
