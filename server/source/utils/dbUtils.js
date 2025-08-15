
import { pool } from '../config/database.js';

const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS \`user\` (
        email VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        matricule VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

const createProfilesTableQuery = `
    CREATE TABLE IF NOT EXISTS \`profile\` (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        used_receipt JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        graduation_fee_paid BOOLEAN DEFAULT FALSE NOT NULL,
        internship_fee_paid BOOLEAN DEFAULT FALSE NOT NULL,
        school_fee_due INT DEFAULT 365000 CHECK (school_fee_due >= 0),
        penalty_fee INT DEFAULT 0 CHECK (penalty_fee >= 0) NOT NULL,
        excess_fee INT DEFAULT 0 CHECK (excess_fee >= 0) NOT NULL,
        FOREIGN KEY (email) REFERENCES \`user\`(email)
    )`;

const createUsedUBA_receiptTableQuery = `
    CREATE TABLE IF NOT EXISTS \`usedUBA_receipt\` (
        receipt_id VARCHAR(255) PRIMARY KEY,
        receipt_user VARCHAR(255) NOT NULL,
        receipt_used_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

async function createTableIfNotExists() {
    try {
        await pool.query(createUsersTableQuery);
        await pool.query(createProfilesTableQuery);
        await pool.query(createUsedUBA_receiptTableQuery);
        console.log('Database tables checked/created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error; // Re-throw the error to be handled by the calling function
    }
}

export { createTableIfNotExists };