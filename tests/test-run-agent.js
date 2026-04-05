const http = require('http');

function testRunAgent(governorate, category) {
  const testData = { governorate, category };
  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/run-agent',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log(`🧪 Testing run-agent: ${category} in ${governorate}`);
  console.log('Request:', JSON.stringify(testData, null, 2));

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      try {
        const parsed = JSON.parse(data);
        if (parsed.success) {
          console.log('\n✅ Test passed! Agent started successfully');
          console.log('📝 Check server logs for progress');
          console.log('🔍 Check job status with: curl http://localhost:3000/api/job/:id');
        } else {
          console.log('\n❌ Test failed:', parsed.error);
        }
      } catch (e) {
        console.log('\n❌ Response parsing failed:', e.message);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request failed:', e.message);
  });

  req.write(postData);
  req.end();
}

// Get command line arguments
const args = process.argv.slice(2);
const governorate = args[0];
const category = args[1];

if (!governorate || !category) {
  console.log('Usage: node test-run-agent.js <governorate> <category>');
  console.log('');
  console.log('Examples:');
  console.log('  node test-run-agent.js Baghdad restaurants');
  console.log('  node test-run-agent.js Basra hotels');
  console.log('  node test-run-agent.js Najaf pharmacies');
  console.log('');
  console.log('💡 Make sure the server is running: npm start');
} else {
  testRunAgent(governorate, category);
}
