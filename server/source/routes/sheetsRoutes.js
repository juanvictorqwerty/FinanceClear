import express from 'express';
<<<<<<< HEAD

=======
>>>>>>> 17777a2b8a27824643fb35bb198f88972a1dadd7
import {
    readSheetController,
    writeSheetController,
    appendSheetController,
    clearSheetController,
    getSpreadsheetInfoController,
    batchReadSheetController,
<<<<<<< HEAD
    readSheetByNameController,
    searchSheetController,
    createSpreadsheetController
=======
    readSheetByNameController
>>>>>>> 17777a2b8a27824643fb35bb198f88972a1dadd7
} from '../controllers/sheetsController.js';

const router = express.Router();

// Read data from a Google Sheet
// POST /api/sheets/read
// Body: { spreadsheetId: string, range: string }
router.post('/read', readSheetController);

// Write data to a Google Sheet
// POST /api/sheets/write
// Body: { spreadsheetId: string, range: string, values: Array<Array>, valueInputOption?: string }
router.post('/write', writeSheetController);

// Append data to a Google Sheet
// POST /api/sheets/append
// Body: { spreadsheetId: string, range: string, values: Array<Array>, valueInputOption?: string }
router.post('/append', appendSheetController);

// Clear data from a Google Sheet range
// POST /api/sheets/clear
// Body: { spreadsheetId: string, range: string }
router.post('/clear', clearSheetController);

// Get spreadsheet information
// GET /api/sheets/info/:spreadsheetId
router.get('/info/:spreadsheetId', getSpreadsheetInfoController);

// Batch read multiple ranges from a Google Sheet
// POST /api/sheets/batch-read
// Body: { spreadsheetId: string, ranges: Array<string> }
router.post('/batch-read', batchReadSheetController);

// Read data from a specific sheet by name with optional range
// POST /api/sheets/read-by-name
// Body: { spreadsheetId: string, sheetName: string, startRow?: number, endRow?: number, startCol?: string, endCol?: string }
router.post('/read-by-name', readSheetByNameController);

<<<<<<< HEAD
// Search for a value in a Google Sheet
// GET /api/sheets/search?spreadsheetId=...&sheetName=...&query=...
router.get('/search', searchSheetController);

// Create a new spreadsheet
// POST /api/sheets/create
// Body: { title: string, sheetTitles?: Array<string> }
router.post('/create', createSpreadsheetController);

=======
>>>>>>> 17777a2b8a27824643fb35bb198f88972a1dadd7
export default router;
