import googleSheetsService from '../services/sheetsService.js';

/**
 * Read data from a Google Sheet
 */
export const readSheetController = async (req, res) => {
    try {
        const { spreadsheetId, range } = req.body;

        if (!spreadsheetId || !range) {
            return res.status(400).json({
                success: false,
                message: 'spreadsheetId and range are required'
            });
        }

        const result = await googleSheetsService.readSheet(spreadsheetId, range);
        
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Read sheet controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while reading sheet'
        });
    }
};

/**
 * Write data to a Google Sheet
 */
export const writeSheetController = async (req, res) => {
    try {
        const { spreadsheetId, range, values, valueInputOption } = req.body;

        if (!spreadsheetId || !range || !values) {
            return res.status(400).json({
                success: false,
                message: 'spreadsheetId, range, and values are required'
            });
        }

        if (!Array.isArray(values) || !Array.isArray(values[0])) {
            return res.status(400).json({
                success: false,
                message: 'values must be a 2D array'
            });
        }

        const result = await googleSheetsService.writeSheet(
            spreadsheetId, 
            range, 
            values, 
            valueInputOption
        );
        
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Write sheet controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while writing to sheet'
        });
    }
};

/**
 * Append data to a Google Sheet
 */
export const appendSheetController = async (req, res) => {
    try {
        const { spreadsheetId, range, values, valueInputOption } = req.body;

        if (!spreadsheetId || !range || !values) {
            return res.status(400).json({
                success: false,
                message: 'spreadsheetId, range, and values are required'
            });
        }

        if (!Array.isArray(values) || !Array.isArray(values[0])) {
            return res.status(400).json({
                success: false,
                message: 'values must be a 2D array'
            });
        }

        const result = await googleSheetsService.appendSheet(
            spreadsheetId, 
            range, 
            values, 
            valueInputOption
        );
        
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Append sheet controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while appending to sheet'
        });
    }
};

/**
 * Clear data from a Google Sheet range
 */
export const clearSheetController = async (req, res) => {
    try {
        const { spreadsheetId, range } = req.body;

        if (!spreadsheetId || !range) {
            return res.status(400).json({
                success: false,
                message: 'spreadsheetId and range are required'
            });
        }

        const result = await googleSheetsService.clearSheet(spreadsheetId, range);
        
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Clear sheet controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while clearing sheet'
        });
    }
};

/**
 * Get spreadsheet information
 */
export const getSpreadsheetInfoController = async (req, res) => {
    try {
        const { spreadsheetId } = req.params;

        if (!spreadsheetId) {
            return res.status(400).json({
                success: false,
                message: 'spreadsheetId is required'
            });
        }

        const result = await googleSheetsService.getSpreadsheetInfo(spreadsheetId);
        
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Get spreadsheet info controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while getting spreadsheet info'
        });
    }
};

/**
 * Create a new spreadsheet
 */
export const createSpreadsheetController = async (req, res) => {
    try {
        const { title, sheetTitles } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'title is required'
            });
        }

        const result = await googleSheetsService.createSpreadsheet(title, sheetTitles);
        
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Create spreadsheet controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while creating spreadsheet'
        });
    }
};

/**
 * Batch read multiple ranges from a Google Sheet
 */
export const batchReadSheetController = async (req, res) => {
    try {
        const { spreadsheetId, ranges } = req.body;

        if (!spreadsheetId || !ranges || !Array.isArray(ranges)) {
            return res.status(400).json({
                success: false,
                message: 'spreadsheetId and ranges (array) are required'
            });
        }

        const results = await Promise.all(
            ranges.map(range => googleSheetsService.readSheet(spreadsheetId, range))
        );

        const allSuccessful = results.every(result => result.success);
        
        return res.status(allSuccessful ? 200 : 207).json({
            success: allSuccessful,
            message: allSuccessful ? 'All ranges read successfully' : 'Some ranges failed to read',
            results: results.map((result, index) => ({
                range: ranges[index],
                ...result
            }))
        });
    } catch (error) {
        console.error('Batch read sheet controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while batch reading sheets'
        });
    }
};

/**
 * Get data from a specific sheet by name
 */
export const readSheetByNameController = async (req, res) => {
    try {
        const { spreadsheetId, sheetName, startRow, endRow, startCol, endCol } = req.body;

        if (!spreadsheetId || !sheetName) {
            return res.status(400).json({
                success: false,
                message: 'spreadsheetId and sheetName are required'
            });
        }

        // Build range string
        let range = sheetName;
        if (startRow || startCol || endRow || endCol) {
            const start = `${startCol || 'A'}${startRow || '1'}`;
            const end = endRow && endCol ? `:${endCol}${endRow}` : '';
            range = `${sheetName}!${start}${end}`;
        }

        const result = await googleSheetsService.readSheet(spreadsheetId, range);
        
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Read sheet by name controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while reading sheet by name'
        });
    }
};
