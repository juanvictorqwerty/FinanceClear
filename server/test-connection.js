import dotenv from 'dotenv';
import googleSheetsService from './source/services/sheetsService.js';

// Load environment variables
dotenv.config({ path: './source/.env' });

const SPREADSHEET_ID = '1djogVeb0vT2Klqnx7HZfON-g1B3i4KV_5426ACNbHJs';

async function testConnection() {
    console.log('🚀 Testing connection to your Google Sheet...');
    console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
    console.log(`🔗 URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit\n`);

    try {
        // Test 1: Get spreadsheet info
        console.log('1️⃣ Getting spreadsheet information...');
        const infoResult = await googleSheetsService.getSpreadsheetInfo(SPREADSHEET_ID);
        
        if (infoResult.success) {
            console.log('✅ Successfully connected to spreadsheet!');
            console.log(`   Title: ${infoResult.data.title}`);
            console.log(`   Sheets: ${infoResult.data.sheets.map(s => s.title).join(', ')}`);
        } else {
            console.error('❌ Failed to get spreadsheet info:', infoResult.message);
            return;
        }

        // Test 2: Read some data
        console.log('\n2️⃣ Reading data from Sheet1 (A1:E5)...');
        const readResult = await googleSheetsService.readSheet(SPREADSHEET_ID, 'Sheet1!A1:E5');
        
        if (readResult.success) {
            console.log('✅ Successfully read data!');
            if (readResult.data.length > 0) {
                console.log('   Data preview:');
                readResult.data.slice(0, 3).forEach((row, index) => {
                    console.log(`   Row ${index + 1}: [${row.join(', ')}]`);
                });
                if (readResult.data.length > 3) {
                    console.log(`   ... and ${readResult.data.length - 3} more rows`);
                }
            } else {
                console.log('   No data found in the specified range');
            }
        } else {
            console.error('❌ Failed to read data:', readResult.message);
        }

        // Test 3: Write a test value (optional - uncomment if you want to test writing)
        /*
        console.log('\n3️⃣ Testing write operation...');
        const testData = [['Test from FiClear', new Date().toISOString()]];
        const writeResult = await googleSheetsService.writeSheet(SPREADSHEET_ID, 'Sheet1!A1', testData);
        
        if (writeResult.success) {
            console.log('✅ Successfully wrote test data!');
        } else {
            console.error('❌ Failed to write data:', writeResult.message);
        }
        */

        console.log('\n🎉 Connection test completed successfully!');
        console.log('Your Google Sheets integration is ready to use.');

    } catch (error) {
        console.error('💥 Connection test failed:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Make sure the google-credentials.json file exists in server/source/');
        console.log('2. Verify you\'ve shared the spreadsheet with your service account email');
        console.log('3. Check that the service account has Editor permissions');
        console.log('4. Ensure the spreadsheet ID is correct');
    }
}

// Run the test
testConnection();
