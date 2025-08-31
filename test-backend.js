// Simple backend test script
import fetch from 'node-fetch';

const testBackend = async () => {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🧪 Testing Backend API...\n');
  
  try {
    // Test root endpoint
    console.log('1. Testing root endpoint...');
    const rootResponse = await fetch(`${baseUrl}/`);
    const rootData = await rootResponse.json();
    console.log(`✅ Root: ${rootResponse.status} - ${rootData.message}`);
    
    // Test health endpoint
    console.log('\n2. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Health: ${healthResponse.status} - ${healthData.status}`);
    
    // Test API users endpoint
    console.log('\n3. Testing API users endpoint...');
    const usersResponse = await fetch(`${baseUrl}/api/users`);
    const usersData = await usersResponse.json();
    console.log(`✅ Users: ${usersResponse.status} - ${usersData.message}`);
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure backend is running: cd backend && npm start');
    console.log('2. Check if port 5000 is available');
    console.log('3. Verify MongoDB connection');
    console.log('4. Check console for error messages');
  }
};

// Run the test
testBackend();
