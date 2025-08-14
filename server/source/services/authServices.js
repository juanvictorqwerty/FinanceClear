import bcrypt from 'bcrypt'
import { pool } from '../config/database.js';

export const registerUser=async(user)=>{
    console.log('Registering user:', user);

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        const registration_query= `INSERT INTO user(email, username, password,matricule) VALUES (?, ?, ?,?)`
        const values = [user.userEmail, user.userName, hashedPassword,user.matricule];

        await pool.query(registration_query, values)
        return {success:true, message:"User saved successfully"}
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return {success:false, message:"Account with the email already exists, try to log in"}
        }
        return {success:false, message:"Registration failed. Please try again."}
    }
}
