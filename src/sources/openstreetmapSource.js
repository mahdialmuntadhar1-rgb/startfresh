const axios = require('axios');
const logger = require('../utils/logger');
const { sleep } = require('../utils/sleep');
const CONFIG = require('../config/constants');

async function fetchFromOpenStreetMap(governorate, category) {
  try {
    logger.info(`🗺️ Fetching from OpenStreetMap: ${category} in ${governorate}`);
    
    // Map categories to OSM tags
    const categoryToTag = {
      'restaurants': 'amenity=restaurant',
      'hotels': 'tourism=hotel',
      'pharmacies': 'amenity=pharmacy',
      'supermarkets': 'shop=supermarket',
      'gas stations': 'amenity=fuel',
      'hospitals': 'amenity=hospital',
      'schools': 'amenity=school',
      'banks': 'amenity=bank',
      'clothing stores': 'shop=clothes',
      'electronics stores': 'shop=electronics',
      'car repair': 'shop=car_repair',
      'beauty salons': 'shop=beauty',
      'cafes': 'amenity=cafe',
      'bakeries': 'shop=bakery',
      'bookstores': 'shop=books'
    };
    
    const tag = categoryToTag[category.toLowerCase()];
    if (!tag) {
      logger.warn(`No OSM tag mapping for category: ${category}`);
      return [];
    }
    
    // Overpass API query
    const query = `
      [out:json][timeout:25];
      (
        area["name"="${governorate}"]->.searchArea;
        node[${tag}](area.searchArea);
        way[${tag}](area.searchArea);
        relation[${tag}](area.searchArea);
      );
      out geom;
    `;
    
    const url = 'https://overpass-api.de/api/interpreter';
    const response = await axios.post(url, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: 30000
    });
    
    if (!response.data || !response.data.elements) {
      logger.warn(`No OSM data found for ${category} in ${governorate}`);
      return [];
    }
    
    const businesses = response.data.elements
      .filter(element => element.tags && element.tags.name)
      .map(element => ({
        name: element.tags.name,
        category: category,
        governorate: governorate,
        city: element.tags['addr:city'] || governorate,
        phone: element.tags.phone || null,
        source: 'openstreetmap',
        confidence: 0.6 // OSM data confidence
      }))
      .slice(0, CONFIG.MAX_BUSINESSES_PER_RUN);
    
    logger.info(`✅ OpenStreetMap returned ${businesses.length} businesses`);
    
    // Rate limiting
    await sleep(CONFIG.SOURCE_DELAY_MS);
    
    return businesses;
  } catch (error) {
    logger.error(`❌ OpenStreetMap fetch failed for ${category} in ${governorate}:`, error);
    return []; // Return empty array instead of throwing to avoid breaking the flow
  }
}

module.exports = {
  fetchFromOpenStreetMap
};
