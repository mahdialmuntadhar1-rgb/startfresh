// Netlify Function for /api/failures
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify([
      {
        id: "fail-1",
        governorate: "Kirkuk",
        city: "Central",
        category: "Schools",
        errorMessage: "Connection Timeout",
        retryCount: 2,
        updatedAt: new Date().toISOString()
      }
    ])
  };
};
