import express from 'express';
import cors from 'cors';
import { router as userRoutes } from './routes/userRoutes.js';
import { checkConnection } from './config/database.js';
import { createTableIfNotExists } from './utils/dbUtils.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //Middleware to parse JSON bodies
app.use(cors()); //Middleware to enable CORS
app.use('/api/users', userRoutes); //Mount user routes

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Optionally, you can check the database connection here
    try {
        await checkConnection();
        await createTableIfNotExists(); // Ensure the users table exists
        console.log('Database connection established and users table checked.');
    } catch (error) {
        console.error('Failed to initialize the server:', error);
        process.exit(1); // Exit the application if DB connection or table setup fails
    }

});