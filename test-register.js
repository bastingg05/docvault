import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function registerTestUser() {
    console.log('🔧 Registering test user...\n');

    try {
        const response = await fetch(`${API_BASE}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'testpass123'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Test user registered successfully!');
            console.log(`   Name: ${data.name}`);
            console.log(`   Email: ${data.email}`);
            console.log(`   Token: ${data.token ? 'Present' : 'Missing'}`);
            console.log('\n🎯 You can now login with:');
            console.log('   Email: test@example.com');
            console.log('   Password: testpass123');
        } else {
            console.log('❌ Registration failed:');
            console.log(`   Status: ${response.status}`);
            console.log(`   Error: ${data.message || 'Unknown error'}`);
        }

    } catch (error) {
        console.error('💥 Registration failed with error:', error.message);
    }
}

registerTestUser();
