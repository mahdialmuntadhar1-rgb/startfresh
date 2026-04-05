const logger = require('../utils/logger');

function normalizeBusinessName(name) {
  if (!name || typeof name !== 'string') return '';
  
  return name
    .trim()
    .replace(/\s+/g, ' ') // Compress multiple spaces
    .replace(/[^\w\s\u0600-\u06FF]/g, '') // Keep Arabic characters and basic alphanumerics
    .toLowerCase();
}

function normalizeBusiness(business) {
  try {
    const normalized = {
      ...business,
      name: normalizeBusinessName(business.name),
      category: normalizeBusinessName(business.category),
      governorate: normalizeBusinessName(business.governorate),
      city: normalizeBusinessName(business.city),
      phone: business.phone ? business.phone.trim().replace(/[^\d+]/g, '') : null
    };
    
    logger.debug(`Normalized business: ${business.name} → ${normalized.name}`);
    return normalized;
  } catch (error) {
    logger.error('Business normalization error:', error);
    return business;
  }
}

function createDeduplicationKey(normalizedBusiness) {
  const key = [
    normalizedBusiness.name || '',
    normalizedBusiness.city || '',
    normalizedBusiness.phone || 'null'
  ].join('|');
  
  return key.toLowerCase();
}

function normalizeBatch(businesses) {
  const normalized = businesses.map(business => normalizeBusiness(business));
  logger.info(`Normalized ${normalized.length} businesses`);
  return normalized;
}

module.exports = {
  normalizeBusinessName,
  normalizeBusiness,
  createDeduplicationKey,
  normalizeBatch
};
