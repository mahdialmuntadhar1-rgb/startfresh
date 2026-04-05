const logger = require('./logger');

function safeJsonParse(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  try {
    // Try direct JSON parse first
    return JSON.parse(text);
  } catch (error) {
    // Try to extract JSON array from text
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (extractError) {
      logger.warn('Failed to extract JSON from text', { 
        text: text.substring(0, 200) + '...',
        error: extractError.message 
      });
    }

    // Try to extract JSON object from text
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (extractError) {
      logger.warn('Failed to extract JSON object from text', { 
        text: text.substring(0, 200) + '...',
        error: extractError.message 
      });
    }

    logger.error('Complete JSON parse failure', { 
      text: text.substring(0, 200) + '...',
      originalError: error.message 
    });
    
    return null;
  }
}

function safeJsonParseArray(text) {
  const result = safeJsonParse(text);
  
  if (Array.isArray(result)) {
    return result;
  }
  
  // If result is an object with a businesses array, return that
  if (result && typeof result === 'object' && Array.isArray(result.businesses)) {
    return result.businesses;
  }
  
  logger.warn('JSON parse did not return an array', { 
    result: typeof result,
    isArray: Array.isArray(result)
  });
  
  return [];
}

module.exports = {
  safeJsonParse,
  safeJsonParseArray
};
