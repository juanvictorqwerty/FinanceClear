import dotenv from 'dotenv';

dotenv.config();

/**
 * Google Sheets API Configuration
 * 
 * To use this service, you need to set up Google Sheets API credentials:
 * 
 * Method 1: Service Account Key File
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create a new project or select existing one
 * 3. Enable Google Sheets API
 * 4. Create a Service Account
 * 5. Download the JSON key file
 * 6. Set GOOGLE_SERVICE_ACCOUNT_KEY_FILE environment variable to the file path
 * 
 * Method 2: Service Account Credentials as Environment Variable
 * 1. Follow steps 1-4 above
 * 2. Copy the entire JSON content
 * 3. Set GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable to the JSON string
 * 
 * Required Environment Variables:
 * - GOOGLE_SERVICE_ACCOUNT_KEY_FILE (path to JSON file) OR
 * - GOOGLE_SERVICE_ACCOUNT_CREDENTIALS (JSON string)
 * 
 * Optional Environment Variables:
 * - GOOGLE_SHEETS_DEFAULT_SPREADSHEET_ID (default spreadsheet to use)
 */

export const googleSheetsConfig = {
    // Service account key file path
    serviceAccountKeyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
    
    // Service account credentials as JSON string
    serviceAccountCredentials: process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS,
    
    // Default spreadsheet ID (optional)
    defaultSpreadsheetId: process.env.GOOGLE_SHEETS_DEFAULT_SPREADSHEET_ID,
    
    // API scopes - only spreadsheets scope needed for existing sheets
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets'
    ],
    
    // Validate configuration
    isValid() {
        return !!(this.serviceAccountKeyFile || this.serviceAccountCredentials);
    },
    
    // Get authentication method being used
    getAuthMethod() {
        if (this.serviceAccountKeyFile) {
            return 'key_file';
        } else if (this.serviceAccountCredentials) {
            return 'credentials_string';
        }
        return 'none';
    }
};

/**
 * Utility function to validate Google Sheets configuration
 */
export const validateGoogleSheetsConfig = () => {
    const config = googleSheetsConfig;
    
    if (!config.isValid()) {
        console.warn('⚠️  Google Sheets API not configured properly!');
        console.warn('Please set one of the following environment variables:');
        console.warn('- GOOGLE_SERVICE_ACCOUNT_KEY_FILE (path to service account JSON file)');
        console.warn('- GOOGLE_SERVICE_ACCOUNT_CREDENTIALS (service account JSON as string)');
        return false;
    }
    
    console.log('✅ Google Sheets API configuration found');
    console.log(`   Authentication method: ${config.getAuthMethod()}`);
    
    if (config.defaultSpreadsheetId) {
        console.log(`   Default spreadsheet ID: ${config.defaultSpreadsheetId}`);
    }
    
    return true;
};

/**
 * Helper function to extract spreadsheet ID from Google Sheets URL
 * @param {string} url - Google Sheets URL
 * @returns {string|null} Spreadsheet ID or null if invalid
 */
export const extractSpreadsheetId = (url) => {
    if (!url || typeof url !== 'string') {
        return null;
    }
    
    // Match pattern: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit...
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
};

/**
 * Helper function to build Google Sheets URL from spreadsheet ID
 * @param {string} spreadsheetId - Spreadsheet ID
 * @param {string} sheetName - Optional sheet name
 * @returns {string} Google Sheets URL
 */
export const buildSheetsUrl = (spreadsheetId, sheetName = null) => {
    let url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    if (sheetName) {
        url += `#gid=${sheetName}`;
    }
    return url;
};

/**
 * Helper function to parse range string
 * @param {string} range - Range string (e.g., 'Sheet1!A1:D10')
 * @returns {Object} Parsed range object
 */
export const parseRange = (range) => {
    if (!range || typeof range !== 'string') {
        return null;
    }
    
    const parts = range.split('!');
    if (parts.length === 1) {
        return {
            sheetName: null,
            range: parts[0]
        };
    } else if (parts.length === 2) {
        return {
            sheetName: parts[0],
            range: parts[1]
        };
    }
    
    return null;
};

export default googleSheetsConfig;
