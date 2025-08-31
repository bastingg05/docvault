import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function createDocuments() {
    console.log('🔧 Creating sample documents...\n');

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

        console.log('✅ Login successful, creating documents...');
        const token = loginData.token;

        // Sample documents to create
        const sampleDocuments = [
            {
                title: 'Project Proposal',
                category: 'Business',
                description: 'Business proposal for Q4 2024 project',
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                fileUrl: '/uploads/sample-proposal.pdf',
                fileName: 'project-proposal.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf'
            },
            {
                title: 'Team Photo',
                category: 'Images',
                description: 'Team building event photo from last month',
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                fileUrl: '/uploads/team-photo.jpg',
                fileName: 'team-photo.jpg',
                fileSize: 2048000,
                fileType: 'image/jpeg'
            },
            {
                title: 'Meeting Notes',
                category: 'Documents',
                description: 'Notes from the weekly team meeting',
                expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
                fileUrl: '/uploads/meeting-notes.docx',
                fileName: 'meeting-notes.docx',
                fileSize: 512000,
                fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            },
            {
                title: 'Budget Spreadsheet',
                category: 'Finance',
                description: 'Annual budget planning spreadsheet',
                expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
                fileUrl: '/uploads/budget.xlsx',
                fileName: 'budget.xlsx',
                fileSize: 1536000,
                fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            {
                title: 'Product Screenshot',
                category: 'Design',
                description: 'Latest product interface screenshot',
                expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                fileUrl: '/uploads/product-screenshot.png',
                fileName: 'product-screenshot.png',
                fileSize: 3072000,
                fileType: 'image/png'
            }
        ];

        let createdCount = 0;

        for (const doc of sampleDocuments) {
            try {
                const response = await fetch(`${API_BASE}/api/documents`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(doc)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    console.log(`✅ Created: ${doc.title}`);
                    createdCount++;
                } else {
                    console.log(`❌ Failed to create ${doc.title}: ${data.message}`);
                }
            } catch (error) {
                console.log(`❌ Error creating ${doc.title}: ${error.message}`);
            }
        }

        console.log(`\n🎯 Created ${createdCount} out of ${sampleDocuments.length} documents`);
        console.log('📋 You can now login to the frontend and see these documents!');

    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

createDocuments();
