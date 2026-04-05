// Netlify Function for /api/results
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify([
      {
        id: "res-1",
        name: "Al-Zaitoon Restaurant",
        governorate: "Baghdad",
        city: "Mansour",
        category: "Restaurants",
        phone: "+964 770 123 4567",
        source: "Google Maps",
        confidence: 0.98,
        verificationStatus: "verified",
        savedAt: new Date().toISOString()
      }
    ])
  };
};
