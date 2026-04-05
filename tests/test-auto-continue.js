const http = require('http');

function testAutoContinue(governorate) {
  const testData = { governorate };
  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auto-continue',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log(`🧪 Testing auto-continue for ${governorate}`);
  console.log('Request:', JSON.stringify(testData, null, 2));
  console.log('⏱️ This will run through all categories sequentially');

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
          console.log('\n✅ Test passed! Auto-continue started successfully');
          console.log('📝 Check server logs for detailed progress');
          console.log('⏱️ This will take several minutes to complete all categories');
          console.log('🔍 Check job statuses with: curl http://localhost:3000/api/job/:id');
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

if (!governorate) {
  console.log('Usage: node test-auto-continue.js <governorate>');
  console.log('');
  console.log('Examples:');
  console.log('  node test-auto-continue.js Baghdad');
  console.log('  node test-auto-continue.js Basra');
  console.log('  node test-auto-continue.js Najaf');
  console.log('');
  console.log('💡 Make sure the server is running: npm start');
  console.log('⚠️  This test will run all 15 categories for the specified governorate');
} else {
  testAutoContinue(governorate);
}
