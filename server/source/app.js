import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as userRoutes } from './routes/userRoutes.js';
import { checkConnection } from './config/database.js';
import { createTableIfNotExists } from './utils/dbUtils.js';
import authRoutes from './routes/authRoutes.js';
import sheetsRoutes from './routes/sheetsRoutes.js';
import { validateGoogleSheetsConfig } from './config/googleSheets.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module-friendly way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from the same directory as app.js
dotenv.config({ path: path.resolve(__dirname, '.env') });


const app = express();
const PORT = process.env.PORT || 5000;

// --- Robust CORS Configuration ---
// Define the list of allowed origins.
const allowedOrigins = [
    'http://localhost:3000', // Your local development frontend
    process.env.FRONTEND_URL // Your production frontend URL from the .env file
].filter(Boolean); // This removes any falsy values if FRONTEND_URL is not set.

const corsOptions = {
    origin: '*', // Allow all origins
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(express.json()); //Middleware to parse JSON bodies
app.use(cors(corsOptions)); //Middleware to enable CORS with specific options
app.use('/api/users', userRoutes); //Mount user routes
app.use('/api/auth',authRoutes);

app.use('/api/profile', profileRoutes); // Mount profile routes
app.use('/api/sheets', sheetsRoutes); //Mount Google Sheets routes

// Admin endpoints
app.use('/api/admin', adminRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Optionally, you can check the database connection here
    try {
        await checkConnection();
        await createTableIfNotExists(); // Ensure the users table exists
        console.log('Database connection established and users table checked.');

        // Validate Google Sheets configuration
        validateGoogleSheetsConfig();
    } catch (error) {
        console.error('Failed to initialize the server:', error);
        process.exit(1); // Exit the application if DB connection or table setup fails
    }

});