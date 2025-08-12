
import { pool } from '../config/database.js';

const createTableIfNotExists = async ()=> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL
            );
            
        `);
        console.log("Users table created or already exists.");
    } catch (error) {
        console.error("Error creating users table:", error);
    }
};

export {createTableIfNotExists};