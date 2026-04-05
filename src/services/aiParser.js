const { GoogleGenerativeAI } = require('@googleapis/generativeai');
const { safeJsonParse } = require('../utils/safeJsonParse');
const CONFIG = require('../config/constants');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function queryGemini(governorate, category) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a business data extractor for Iraqi businesses. Search for businesses in the category "${category}" in ${governorate}, Iraq.
    
CRITICAL: Return ONLY a valid JSON array. No explanations, no markdown, no text outside the JSON.

Required format:
[
  {
    "name": "Business Name",
    "category": "Business Category", 
    "governorate": "Governorate Name",
    "city": "City Name",
    "phone": "Phone Number or null"
  }
]

Requirements:
- Each business MUST have name, category, governorate, city
- Phone can be null or valid phone number
- Maximum ${CONFIG.MAX_BUSINESSES_PER_RUN} businesses
- Focus on real businesses in ${governorate}
- Category must be "${category}" or closely related
- Iraqi phone format preferred: +964XXXXXXXXXX
- ${governorate} location focus

NO MARKDOWN. NO EXPLANATIONS. ONLY JSON ARRAY.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse safely
    const businesses = safeJsonParse(text);
    
    if (!Array.isArray(businesses)) {
      throw new Error('AI response is not an array');
    }
    
    // Validate structure and add source
    const validBusinesses = businesses
      .filter(business => {
        return business.name && 
               business.category && 
               business.governorate && 
               business.city;
      })
      .map(business => ({
        ...business,
        source: 'gemini',
        confidence: 0.7 // Default confidence for AI-generated data
      }))
      .slice(0, CONFIG.MAX_BUSINESSES_PER_RUN);
    
    console.log(`🤖 Gemini returned ${validBusinesses.length} valid businesses`);
    return validBusinesses;
    
  } catch (error) {
    console.error('Gemini query error:', error);
    throw new Error(`Gemini search failed: ${error.message}`);
  }
}

module.exports = {
  queryGemini
};
