import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000';

async function testUpload() {
    console.log('🔧 Testing file upload functionality...\n');

    try {
        // First login to get token
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
        
        if (!loginResponse.ok) {
            console.log('❌ Login failed:', loginData.message);
            return;
        }

        console.log('✅ Login successful, testing upload...');
        const token = loginData.token;

        // Create a test file
        const testContent = 'This is a test file for upload functionality.';
        const testFilePath = path.join(process.cwd(), 'test-upload.txt');
        fs.writeFileSync(testFilePath, testContent);

        // Create form data for upload
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('file', fs.createReadStream(testFilePath));
        form.append('title', 'Test Upload File');
        form.append('description', 'This is a test upload to verify functionality');

        // Test upload
        const uploadResponse = await fetch(`${API_BASE}/api/documents/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                ...form.getHeaders()
            },
            body: form
        });
        
        const uploadData = await uploadResponse.json();
        
        if (uploadResponse.ok) {
            console.log('✅ Upload successful!');
            console.log(`   Title: ${uploadData.title}`);
            console.log(`   File: ${uploadData.fileName}`);
            console.log(`   Size: ${uploadData.fileSize} bytes`);
            console.log(`   URL: ${uploadData.fileUrl}`);
            
            // Clean up test file
            fs.unlinkSync(testFilePath);
            
            // Test fetching documents to see if the new one appears
            console.log('\n📋 Testing document fetch...');
            const docsResponse = await fetch(`${API_BASE}/api/documents`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const docsData = await docsResponse.json();
            
            if (docsResponse.ok) {
                console.log(`✅ Documents API working!`);
                console.log(`   Total documents: ${docsData.length}`);
                console.log(`   Latest document: ${docsData[0]?.title}`);
            } else {
                console.log('❌ Failed to fetch documents');
            }
            
        } else {
            console.log('❌ Upload failed:');
            console.log(`   Status: ${uploadResponse.status}`);
            console.log(`   Error: ${uploadData.message || 'Unknown error'}`);
            
            // Clean up test file
            fs.unlinkSync(testFilePath);
        }

    } catch (error) {
        console.error('💥 Upload test failed with error:', error.message);
    }
}

testUpload();
