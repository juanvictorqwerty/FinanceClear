import { google } from 'googleapis';

class GoogleSheetsServiceClass {
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

            this.sheets = google.sheets({ version: 'v4', auth: this.auth, timeout: 30000 });
            console.log('Google Sheets API initialized successfully');
        } catch (error) {
            console.error('Error initializing Google Sheets API:', error);
            throw new Error(`Failed to initialize Google Sheets API: ${error.message}`);
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
            console.error(`Error reading sheet with ID '${spreadsheetId}' and range '${range}':`, error);
            return {
                success: false,
                message: `Failed to read sheet data from spreadsheet '${spreadsheetId}' and range '${range}'.`,
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
            console.error(`Error writing to sheet with ID '${spreadsheetId}' and range '${range}':`, error);
            return {
                success: false,
                message: `Failed to write data to sheet '${spreadsheetId}' and range '${range}'.`,
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
            console.error(`Error appending to sheet with ID '${spreadsheetId}' and range '${range}':`, error);
            return {
                success: false,
                message: `Failed to append data to sheet '${spreadsheetId}' and range '${range}'.`,
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
            console.error(`Error clearing sheet with ID '${spreadsheetId}' and range '${range}':`, error);
            return {
                success: false,
                message: `Failed to clear sheet range '${range}' in spreadsheet '${spreadsheetId}'.`,
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
            console.error(`Error getting spreadsheet info for ID '${spreadsheetId}':`, error);
            return {
                success: false,
                message: `Failed to get spreadsheet information for ID '${spreadsheetId}'.`,
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
            console.error(`Error creating spreadsheet with title '${title}':`, error);
            return {
                success: false,
                message: `Failed to create spreadsheet with title '${title}'.`,
                error: error.message
            };
        }
    }

    /**
     * Search for a value in a specific column (by index) in a Google Sheet
     * @param {string} spreadsheetId - The ID of the spreadsheet
     * @param {string} sheetName - The name of the sheet to search
     * @param {string} query - The value to search for
     * @param {number} columnIndex - The zero-based index of the column to search in
     * @returns {Promise<Object>} Result object with search result
     */
    async searchSheet(spreadsheetId, sheetName, query, columnIndex) {
        try {
            await this.ensureInitialized();

            // Get spreadsheet info to determine the actual range
            const infoResult = await this.getSpreadsheetInfo(spreadsheetId);
            if (!infoResult.success) {
                return infoResult; // Propagate error
            }

            const sheetInfo = infoResult.data.sheets.find(s => s.title === sheetName);
            if (!sheetInfo) {
                return {
                    success: false,
                    message: `Sheet with name '${sheetName}' not found.`
                };
            }

            const columnCount = sheetInfo.gridProperties.columnCount;
            const columnLetter = this._toColumnName(columnCount);
            const range = `${sheetName}!A:${columnLetter}`;

            // Read the entire sheet
            const readResult = await this.readSheet(spreadsheetId, range);

            if (!readResult.success) {
                return readResult; // Propagate the error from readSheet
            }

            const rows = readResult.data;
            if (!rows || rows.length === 0) {
                return {
                    success: true,
                    found: false,
                    message: 'Sheet is empty or no data found'
                };
            }

            const queryLower = query.toLowerCase(); // Case-insensitive search

            // Search for the query in the specified column only
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row[columnIndex] && row[columnIndex].toLowerCase().includes(queryLower)) {
                    // Found a match
                    return {
                        success: true,
                        found: true,
                        data: row,
                        message: 'Data found successfully'
                    };
                }
            }

            // If no match is found after checking all rows
            return {
                success: true,
                found: false,
                message: 'No matching data found'
            };
        } catch (error) {
            console.error(`Error searching for '${query}' in sheet '${sheetName}' of spreadsheet '${spreadsheetId}':`, error);
            return {
                success: false,
                message: `Failed to search for '${query}' in sheet '${sheetName}'.`,
                error: error.message
            };
        }
    }

    _toColumnName(num) {
        let columnName = '';
        while (num > 0) {
            const remainder = (num - 1) % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            num = Math.floor((num - 1) / 26);
        }
        return columnName;
    }

    /**
    * Check multiple receipt IDs against a username in a Google Sheet.
    * Assumes Receipt ID is in column 0 and Username is in column 1.
    * @param {string} spreadsheetId - The ID of the spreadsheet
    * @param {Array<string>} receiptIds - Array of receipt IDs to check
    * @param {string} userName - The username to match against
    * @returns {Promise<Object>} Result object with success status and details for each receipt
    */
    async checkReceiptsAndUser(spreadsheetId, receiptIds, userName) {
        try {
            await this.ensureInitialized();

            const sheetName = 'Sheet1'; // Assuming the relevant sheet is 'Sheet1'
            const infoResult = await this.getSpreadsheetInfo(spreadsheetId);
            if (!infoResult.success) {
                console.error('Error in checkReceiptsAndUser: Failed to get spreadsheet info', infoResult.message);
                return infoResult;
            }

            const sheetInfo = infoResult.data.sheets.find(s => s.title === sheetName);
            if (!sheetInfo) {
                console.error('Error in checkReceiptsAndUser: Sheet not found', sheetName);
                return {
                    success: false,
                    message: `Sheet with name '${sheetName}' not found.`
                };
            }

            const columnCount = sheetInfo.gridProperties.columnCount;
            const columnLetter = this._toColumnName(columnCount);
            const range = `${sheetName}!A1:${columnLetter}`;

            const readResult = await this.readSheet(spreadsheetId, range);
            if (!readResult.success) {
                console.error('Error in checkReceiptsAndUser: Failed to read sheet', readResult.message);
                return readResult;
            }

            const rows = readResult.data;
            if (!rows || rows.length === 0) {
                console.error('Error in checkReceiptsAndUser: Sheet is empty');
                return {
                    success: false,
                    message: 'Sheet is empty or no data found'
                };
            }

            const headerRow = rows[0];
            const receiptIdColumnIndex = 0; // Column A
            const usernameColumnIndex = 2; // Column C

            if (headerRow.length < Math.max(receiptIdColumnIndex, usernameColumnIndex) + 1) {
                console.error('Error in checkReceiptsAndUser: Required columns not found', headerRow);
                return {
                    success: false,
                    message: 'Required columns (Payment_ID, Name) not found in the sheet header.'
                };
            }

            const results = [];
            let allMatched = true;

            for (const receiptId of receiptIds) {
                let foundAndMatched = false;
                for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
                    const row = rows[i];
                    const currentReceiptId = row[receiptIdColumnIndex];
                    const currentUsername = row[usernameColumnIndex];

                    if (currentReceiptId && currentReceiptId.toLowerCase() === receiptId.toLowerCase()) {
                        if (currentUsername && currentUsername.toLowerCase() === userName.toLowerCase()) {
                            results.push({ receiptId, status: 'matched', message: 'Receipt ID and username matched.' });
                            foundAndMatched = true;
                            break; // Found a match for this receiptId, move to next
                        } else {
                            results.push({ receiptId, status: 'mismatched_username', message: 'Receipt ID found, but username mismatched.' });
                            foundAndMatched = true; // Still found the receipt ID
                            allMatched = false;
                            break;
                        }
                    }
                }
                if (!foundAndMatched) {
                    results.push({ receiptId, status: 'not_found', message: 'Receipt ID not found.' });
                    allMatched = false;
                }
            }

            return {
                success: allMatched,
                message: allMatched ? 'All receipts processed successfully.' : 'Some receipts could not be verified.',
                details: results
            };

        } catch (error) {
            console.error(`Error checking receipts for user '${userName}' in spreadsheet '${spreadsheetId}':`, error);
            return {
                success: false,
                message: `Failed to check receipts for user '${userName}'.`,
                error: error.message
            };
        }
    }
}

export default GoogleSheetsServiceClass;