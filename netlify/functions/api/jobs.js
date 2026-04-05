// Netlify Function for /api/jobs
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify([
      {
        id: "job-1",
        governorate: "Baghdad",
        city: "Karrada",
        category: "Restaurants",
        savedCount: 45,
        targetCount: 100,
        status: "running",
        currentStep: "Scraping Google Maps",
        progress: 45,
        updatedAt: new Date().toISOString()
      }
    ])
  };
};
