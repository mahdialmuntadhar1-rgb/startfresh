// Netlify Function for /api/dashboard
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      totalGovernorates: 18,
      totalCategories: 20,
      runningJobs: 3,
      completedJobs: 145,
      failedJobs: 12,
      totalBusinessesToday: 1240,
      overallProgress: 68,
      systemHealth: {
        database: "online",
        queue: "active",
        backend: "online",
        lastSync: new Date().toISOString()
      }
    })
  };
};
