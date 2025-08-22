import googleSheetsService from '../services/sheetsService.js';
import { extractSpreadsheetId } from '../config/googleSheets.js';

/**
 * Test Google Sheets integration
 * This file contains utility functions to test your Google Sheets setup
 */

/**
 * Test basic connectivity to Google Sheets API
 */
export const testConnection = async () => {
    console.log('🧪 Testing Google Sheets API connection...');
    
    try {
        // Try to initialize the service
        await googleSheetsService.ensureInitialized();
        console.log('✅ Google Sheets API connection successful');
        return true;
    } catch (error) {
        console.error('❌ Google Sheets API connection failed:', error.message);
        return false;
    }
};

/**
 * Test reading from a spreadsheet
 * @param {string} spreadsheetId - The spreadsheet ID to test with
 * @param {string} range - The range to read (default: 'Sheet1!A1:C3')
 */
export const testRead = async (spreadsheetId, range = 'Sheet1!A1:C3') => {
    console.log(`🧪 Testing read operation on spreadsheet: ${spreadsheetId}`);
    console.log(`   Range: ${range}`);
    
    try {
        const result = await googleSheetsService.readSheet(spreadsheetId, range);
        
        if (result.success) {
            console.log('✅ Read operation successful');
            console.log('   Data:', result.data);
            return result;
        } else {
            console.error('❌ Read operation failed:', result.message);
            return result;
        }
    } catch (error) {
        console.error('❌ Read operation error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Test writing to a spreadsheet
 * @param {string} spreadsheetId - The spreadsheet ID to test with
 * @param {string} range - The range to write to (default: 'Sheet1!A1')
 * @param {Array} values - The values to write
 */
export const testWrite = async (spreadsheetId, range = 'Sheet1!A1', values = [['Test', 'Data', new Date().toISOString()]]) => {
    console.log(`🧪 Testing write operation on spreadsheet: ${spreadsheetId}`);
    console.log(`   Range: ${range}`);
    console.log(`   Values:`, values);
    
    try {
        const result = await googleSheetsService.writeSheet(spreadsheetId, range, values);
        
        if (result.success) {
            console.log('✅ Write operation successful');
            console.log('   Updated cells:', result.data.updatedCells);
            return result;
        } else {
            console.error('❌ Write operation failed:', result.message);
            return result;
        }
    } catch (error) {
        console.error('❌ Write operation error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Test appending to a spreadsheet
 * @param {string} spreadsheetId - The spreadsheet ID to test with
 * @param {string} range - The range to append to (default: 'Sheet1!A:C')
 * @param {Array} values - The values to append
 */
export const testAppend = async (spreadsheetId, range = 'Sheet1!A:C', values = [['Appended', 'Row', new Date().toISOString()]]) => {
    console.log(`🧪 Testing append operation on spreadsheet: ${spreadsheetId}`);
    console.log(`   Range: ${range}`);
    console.log(`   Values:`, values);
    
    try {
        const result = await googleSheetsService.appendSheet(spreadsheetId, range, values);
        
        if (result.success) {
            console.log('✅ Append operation successful');
            console.log('   Updated range:', result.data.updates.updatedRange);
            return result;
        } else {
            console.error('❌ Append operation failed:', result.message);
            return result;
        }
    } catch (error) {
        console.error('❌ Append operation error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Test getting spreadsheet info
 * @param {string} spreadsheetId - The spreadsheet ID to test with
 */
export const testGetInfo = async (spreadsheetId) => {
    console.log(`🧪 Testing get info operation on spreadsheet: ${spreadsheetId}`);
    
    try {
        const result = await googleSheetsService.getSpreadsheetInfo(spreadsheetId);
        
        if (result.success) {
            console.log('✅ Get info operation successful');
            console.log('   Title:', result.data.title);
            console.log('   Sheets:', result.data.sheets.map(s => s.title).join(', '));
            return result;
        } else {
            console.error('❌ Get info operation failed:', result.message);
            return result;
        }
    } catch (error) {
        console.error('❌ Get info operation error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Test creating a new spreadsheet
 * @param {string} title - Title for the new spreadsheet
 */
export const testCreate = async (title = `Test Spreadsheet ${new Date().toISOString()}`) => {
    console.log(`🧪 Testing create operation with title: ${title}`);
    
    try {
        const result = await googleSheetsService.createSpreadsheet(title, ['Sheet1', 'Data']);
        
        if (result.success) {
            console.log('✅ Create operation successful');
            console.log('   Spreadsheet ID:', result.data.spreadsheetId);
            console.log('   URL:', result.data.spreadsheetUrl);
            return result;
        } else {
            console.error('❌ Create operation failed:', result.message);
            return result;
        }
    } catch (error) {
        console.error('❌ Create operation error:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Run all tests
 * @param {string} spreadsheetId - Optional spreadsheet ID to test with
 */
export const runAllTests = async (spreadsheetId = null) => {
    console.log('🚀 Starting Google Sheets API tests...\n');
    
    const results = {
        connection: false,
        info: false,
        read: false,
        write: false,
        append: false,
        create: false
    };
    
    // Test connection
    results.connection = await testConnection();
    console.log('');
    
    if (!results.connection) {
        console.log('❌ Connection test failed. Skipping other tests.');
        return results;
    }
    
    // Test create (if no spreadsheet ID provided)
    if (!spreadsheetId) {
        console.log('No spreadsheet ID provided. Testing create operation...');
        const createResult = await testCreate();
        console.log('');
        
        if (createResult.success) {
            results.create = true;
            spreadsheetId = createResult.data.spreadsheetId;
            console.log(`✅ Using newly created spreadsheet: ${spreadsheetId}\n`);
        } else {
            console.log('❌ Create test failed. Please provide a spreadsheet ID to continue with other tests.');
            return results;
        }
    }
    
    // Test info
    if (spreadsheetId) {
        results.info = (await testGetInfo(spreadsheetId)).success;
        console.log('');
    }
    
    // Test read
    if (spreadsheetId) {
        results.read = (await testRead(spreadsheetId)).success;
        console.log('');
    }
    
    // Test write
    if (spreadsheetId) {
        results.write = (await testWrite(spreadsheetId)).success;
        console.log('');
    }
    
    // Test append
    if (spreadsheetId) {
        results.append = (await testAppend(spreadsheetId)).success;
        console.log('');
    }
    
    // Summary
    console.log('📊 Test Results Summary:');
    console.log('========================');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });
    
    const passedCount = Object.values(results).filter(Boolean).length;
    const totalCount = Object.keys(results).length;
    console.log(`\n🎯 Overall: ${passedCount}/${totalCount} tests passed`);
    
    return results;
};

/**
 * Quick test with a spreadsheet URL
 * @param {string} url - Google Sheets URL
 */
export const testWithUrl = async (url) => {
    const spreadsheetId = extractSpreadsheetId(url);
    
    if (!spreadsheetId) {
        console.error('❌ Invalid Google Sheets URL provided');
        return false;
    }
    
    console.log(`🔗 Extracted spreadsheet ID: ${spreadsheetId}`);
    return await runAllTests(spreadsheetId);
};

// Export for direct usage
export default {
    testConnection,
    testRead,
    testWrite,
    testAppend,
    testGetInfo,
    testCreate,
    runAllTests,
    testWithUrl
};
