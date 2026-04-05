const http = require('http');

function testFullIraqCoverage(startGovernorate = null) {
  const testData = startGovernorate ? { startGovernorate } : {};
  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/full-iraq-coverage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log(`🧪 Testing full Iraq coverage${startGovernorate ? ` starting from ${startGovernorate}` : ''}`);
  console.log('Request:', JSON.stringify(testData, null, 2));
  console.log('⚠️  This will run through all governorates and categories');
  console.log('⏱️ This will take HOURS to complete!');

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
          console.log('\n✅ Test passed! Full Iraq coverage started');
          console.log('📝 Check server logs for detailed progress');
          console.log('⏱️ This will take several hours to complete all 18 governorates × 15 categories');
          console.log('🔍 Check job statuses with: curl http://localhost:3000/api/job/:id');
          console.log('📊 Expected total: 270 agent runs (18 × 15)');
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
const startGovernorate = args[0];

if (startGovernorate === '--help' || startGovernorate === '-h') {
  console.log('Usage: node test-full-iraq.js [start-governorate]');
  console.log('');
  console.log('Examples:');
  console.log('  node test-full-iraq.js                    # Start from first governorate');
  console.log('  node test-full-iraq.js Baghdad            # Start from Baghdad');
  console.log('  node test-full-iraq.js Basra              # Start from Basra');
  console.log('');
  console.log('💡 Make sure the server is running: npm start');
  console.log('⚠️  WARNING: This will run 270 agent jobs total!');
  console.log('⏱️  Expected duration: Several hours to complete');
} else {
  testFullIraqCoverage(startGovernorate);
}
