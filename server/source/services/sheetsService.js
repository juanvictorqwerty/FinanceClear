import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

class GoogleSheetsService {
    constructor() {
        this.auth = null;
        this.sheets = null;
        this.initializeAuth();
    }

    async initializeAuth() {
        try {
            // Initialize Google Auth using service account credentials
            this.auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, // Path to service account JSON file
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            // Alternative: Use credentials from environment variables
            if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE && process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
                const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
                this.auth = new google.auth.GoogleAuth({
                    credentials: credentials,
                    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                });
            }

            this.sheets = google.sheets({ version: 'v4', auth: this.auth });
            console.log('Google Sheets API initialized successfully');
        } catch (error) {
            console.error('Error initializing Google Sheets API:', error);
            throw error;
        }
    }

    async ensureInitialized() {
        if (!this.sheets) {
            await this.initializeAuth();
        }
    }

    /**
     * Read data from a Google Sheet
     * @param {string} spreadsheetId - The ID of the spreadsheet
     * @param {string} range - The range to read (e.g., 'Sheet1!A1:D10')
     * @returns {Promise<Array>} Array of rows
     */
    async readSheet(spreadsheetId, range) {
        try {
            await this.ensureInitialized();
            
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });

            return {
                success: true,
                data: response.data.values || [],
                message: 'Data retrieved successfully'
            };
        } catch (error) {
            console.error('Error reading sheet:', error);
            return {
                success: false,
                message: 'Failed to read sheet data',
                error: error.message
            };
        }
    }

    /**
     * Write data to a Google Sheet
     * @param {string} spreadsheetId - The ID of the spreadsheet
     * @param {string} range - The range to write to (e.g., 'Sheet1!A1')
     * @param {Array} values - 2D array of values to write
     * @param {string} valueInputOption - How to interpret input ('RAW' or 'USER_ENTERED')
     * @returns {Promise<Object>} Result object
     */
    async writeSheet(spreadsheetId, range, values, valueInputOption = 'USER_ENTERED') {
        try {
            await this.ensureInitialized();

            const response = await this.sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption,
                resource: {
                    values,
                },
            });

            return {
                success: true,
                data: response.data,
                message: 'Data written successfully'
            };
        } catch (error) {
            console.error('Error writing to sheet:', error);
            return {
                success: false,
                message: 'Failed to write data to sheet',
                error: error.message
            };
        }
    }

    /**
     * Append data to a Google Sheet
     * @param {string} spreadsheetId - The ID of the spreadsheet
     * @param {string} range - The range to append to (e.g., 'Sheet1!A:D')
     * @param {Array} values - 2D array of values to append
     * @param {string} valueInputOption - How to interpret input ('RAW' or 'USER_ENTERED')
     * @returns {Promise<Object>} Result object
     */
    async appendSheet(spreadsheetId, range, values, valueInputOption = 'USER_ENTERED') {
        try {
            await this.ensureInitialized();

            const response = await this.sheets.spreadsheets.values.append({
                spreadsheetId,
                range,
                valueInputOption,
                resource: {
                    values,
                },
            });

            return {
                success: true,
                data: response.data,
                message: 'Data appended successfully'
            };
        } catch (error) {
            console.error('Error appending to sheet:', error);
            return {
                success: false,
                message: 'Failed to append data to sheet',
                error: error.message
            };
        }
    }

    /**
     * Clear data from a Google Sheet range
     * @param {string} spreadsheetId - The ID of the spreadsheet
     * @param {string} range - The range to clear (e.g., 'Sheet1!A1:D10')
     * @returns {Promise<Object>} Result object
     */
    async clearSheet(spreadsheetId, range) {
        try {
            await this.ensureInitialized();

            const response = await this.sheets.spreadsheets.values.clear({
                spreadsheetId,
                range,
            });

            return {
                success: true,
                data: response.data,
                message: 'Range cleared successfully'
            };
        } catch (error) {
            console.error('Error clearing sheet:', error);
            return {
                success: false,
                message: 'Failed to clear sheet range',
                error: error.message
            };
        }
    }

    /**
     * Get spreadsheet metadata
     * @param {string} spreadsheetId - The ID of the spreadsheet
     * @returns {Promise<Object>} Result object with spreadsheet info
     */
    async getSpreadsheetInfo(spreadsheetId) {
        try {
            await this.ensureInitialized();

            const response = await this.sheets.spreadsheets.get({
                spreadsheetId,
            });

            return {
                success: true,
                data: {
                    title: response.data.properties.title,
                    sheets: response.data.sheets.map(sheet => ({
                        title: sheet.properties.title,
                        sheetId: sheet.properties.sheetId,
                        gridProperties: sheet.properties.gridProperties
                    }))
                },
                message: 'Spreadsheet info retrieved successfully'
            };
        } catch (error) {
            console.error('Error getting spreadsheet info:', error);
            return {
                success: false,
                message: 'Failed to get spreadsheet information',
                error: error.message
            };
        }
    }

    /**
     * Create a new spreadsheet
     * @param {string} title - Title for the new spreadsheet
     * @param {Array} sheetTitles - Array of sheet titles to create
     * @returns {Promise<Object>} Result object with new spreadsheet info
     */
    async createSpreadsheet(title, sheetTitles = ['Sheet1']) {
        try {
            await this.ensureInitialized();

            const sheets = sheetTitles.map(sheetTitle => ({
                properties: {
                    title: sheetTitle
                }
            }));

            const response = await this.sheets.spreadsheets.create({
                resource: {
                    properties: {
                        title
                    },
                    sheets
                }
            });

            return {
                success: true,
                data: {
                    spreadsheetId: response.data.spreadsheetId,
                    spreadsheetUrl: response.data.spreadsheetUrl,
                    title: response.data.properties.title
                },
                message: 'Spreadsheet created successfully'
            };
        } catch (error) {
            console.error('Error creating spreadsheet:', error);
            return {
                success: false,
                message: 'Failed to create spreadsheet',
                error: error.message
            };
        }
    }
}

// Export a singleton instance
const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
