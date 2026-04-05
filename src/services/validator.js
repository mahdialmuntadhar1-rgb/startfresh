const logger = require('../utils/logger');

function validateBusiness(business) {
  const errors = [];
  
  // Name validation
  if (!business.name) {
    errors.push('Name is required');
  } else if (typeof business.name !== 'string' || business.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  // Category validation
  if (!business.category) {
    errors.push('Category is required');
  } else if (typeof business.category !== 'string' || business.category.trim().length < 2) {
    errors.push('Category must be at least 2 characters');
  }
  
  // Governorate validation
  if (!business.governorate) {
    errors.push('Governorate is required');
  } else if (typeof business.governorate !== 'string' || business.governorate.trim().length < 2) {
    errors.push('Governorate must be at least 2 characters');
  }
  
  // City validation
  if (!business.city) {
    errors.push('City is required');
  } else if (typeof business.city !== 'string' || business.city.trim().length < 2) {
    errors.push('City must be at least 2 characters');
  }
  
  // Phone validation (optional)
  if (business.phone && typeof business.phone === 'string') {
    const cleanPhone = business.phone.trim();
    if (cleanPhone.length < 5) {
      errors.push('Phone must be at least 5 characters if provided');
    }
  }
  
  // Confidence validation
  if (business.confidence !== undefined) {
    const conf = parseFloat(business.confidence);
    if (isNaN(conf) || conf < 0 || conf > 1) {
      errors.push('Confidence must be between 0 and 1');
    }
  }
  
  const isValid = errors.length === 0;
  
  if (!isValid) {
    logger.warn(`Business validation failed: ${business.name || 'unnamed'}`, { errors, business });
  }
  
  return {
    isValid,
    errors,
    business: isValid ? {
      ...business,
      name: business.name.trim(),
      category: business.category.trim(),
      governorate: business.governorate.trim(),
      city: business.city.trim(),
      phone: business.phone ? business.phone.trim() : null,
      confidence: business.confidence !== undefined ? parseFloat(business.confidence) : 0.5
    } : null
  };
}

function validateBatch(businesses) {
  const results = {
    valid: [],
    invalid: [],
    total: businesses.length
  };
  
  businesses.forEach(business => {
    const validation = validateBusiness(business);
    if (validation.isValid) {
      results.valid.push(validation.business);
    } else {
      results.invalid.push({
        business,
        errors: validation.errors
      });
    }
  });
  
  logger.info(`Batch validation: ${results.valid.length} valid, ${results.invalid.length} invalid out of ${results.total}`);
  
  return results;
}

module.exports = {
  validateBusiness,
  validateBatch
};
