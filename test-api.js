import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function testAPI() {
    console.log('🔧 Testing API Connection...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Endpoint...');
        const healthResponse = await fetch(`${API_BASE}/health`);
        const healthData = await healthResponse.json();
        
        if (healthResponse.ok) {
            console.log('✅ Health check successful!');
            console.log(`   Status: ${healthData.status}`);
            console.log(`   Database: ${healthData.database}`);
            console.log(`   Uptime: ${Math.floor(healthData.uptime / 1000)}s\n`);
        } else {
            console.log('❌ Health check failed!\n');
        }

        // Test 2: User Routes
        console.log('2️⃣ Testing User Routes...');
        const userResponse = await fetch(`${API_BASE}/api/users`);
        const userData = await userResponse.json();
        
        if (userResponse.ok) {
            console.log('✅ User routes working!');
            console.log(`   Message: ${userData.message}\n`);
        } else {
            console.log('❌ User routes failed!\n');
        }

        // Test 3: Login
        console.log('3️⃣ Testing Login...');
        const loginResponse = await fetch(`${API_BASE}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
                    body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpass123'
        })
        });
        
        const loginData = await loginResponse.json();
        
        if (loginResponse.ok) {
            console.log('✅ Login successful!');
            console.log(`   User: ${loginData.name}`);
            console.log(`   Token: ${loginData.token ? 'Present' : 'Missing'}\n`);
            
            // Test 4: Documents with token
            console.log('4️⃣ Testing Documents API...');
            const docsResponse = await fetch(`${API_BASE}/api/documents`, {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });
            
            const docsData = await docsResponse.json();
            
            if (docsResponse.ok) {
                console.log('✅ Documents API working!');
                console.log(`   Documents found: ${docsData.length || 0}\n`);
            } else {
                console.log('❌ Documents API failed!\n');
            }
            
        } else {
            console.log('❌ Login failed!');
            console.log(`   Error: ${loginData.message || 'Unknown error'}\n`);
        }

        console.log('🎯 API Test Complete!');

    } catch (error) {
        console.error('💥 Test failed with error:', error.message);
    }
}

testAPI();
