const { supabase } = require('./supabase');

async function findDuplicateBusiness(normalizedKey) {
  try {
    // For exact match, check name and phone
    if (normalizedKey.includes('|') && normalizedKey.split('|').length === 3) {
      const [name, city, phone] = normalizedKey.split('|');
      
      let query = supabase.from('businesses').select('*');
      
      if (phone && phone !== 'null') {
        // Prefer phone matching for exact duplicates
        query = query.eq('phone', phone);
      } else {
        // Fall back to name + city matching
        query = query.eq('name', name).eq('city', city);
      }
      
      const { data, error } = await query.limit(1);
      
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    }
    
    return null;
  } catch (error) {
    console.error('Find duplicate business error:', error);
    return null;
  }
}

async function saveBusiness(record, jobId) {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        job_id: jobId,
        name: record.name,
        category: record.category,
        governorate: record.governorate,
        city: record.city,
        phone: record.phone || null,
        source: record.source,
        confidence: record.confidence || 0.5
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Save business error:', error);
    throw error;
  }
}

async function promoteStagingToBusiness(stagingId) {
  try {
    // Get staging business record
    const { data: staging, error: fetchError } = await supabase
      .from('staging_businesses')
      .select('*')
      .eq('id', stagingId)
      .single();

    if (fetchError) throw fetchError;
    if (!staging) throw new Error('Staging business not found');

    // Insert into businesses table
    const { data: business, error: insertError } = await supabase
      .from('businesses')
      .insert({
        job_id: staging.job_id,
        name: staging.name,
        category: staging.category,
        governorate: staging.governorate,
        city: staging.city,
        phone: staging.phone,
        source: staging.source,
        confidence: staging.confidence
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Mark staging as promoted
    const { markStagingBusinessPromoted } = require('./stagingBusinesses');
    await markStagingBusinessPromoted(stagingId);

    return business;
  } catch (error) {
    console.error('Promote staging to business error:', error);
    throw error;
  }
}

async function getBusinessesByJob(jobId) {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get businesses by job error:', error);
    return [];
  }
}

async function getBusinessStats() {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('category, governorate, source', { count: 'exact' });

    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      by_category: {},
      by_governorate: {},
      by_source: {}
    };

    if (data) {
      data.forEach(business => {
        stats.by_category[business.category] = (stats.by_category[business.category] || 0) + 1;
        stats.by_governorate[business.governorate] = (stats.by_governorate[business.governorate] || 0) + 1;
        stats.by_source[business.source] = (stats.by_source[business.source] || 0) + 1;
      });
    }

    return stats;
  } catch (error) {
    console.error('Get business stats error:', error);
    return { total: 0, by_category: {}, by_governorate: {}, by_source: {} };
  }
}

module.exports = {
  findDuplicateBusiness,
  saveBusiness,
  promoteStagingToBusiness,
  getBusinessesByJob,
  getBusinessStats
};
