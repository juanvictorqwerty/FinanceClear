import bcrypt from 'bcrypt'
import { pool } from '../config/database.js';
import jwt from 'jsonwebtoken'

const JWT_SECRET= "jWTrandomstringSecretUserToken1sttimeIuseitlearNINGEveryDay";

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
            return {success:false, message:"Account with the email or matricule already exists, try to log in"}
        }
        return {success:false, message:"Registration failed. Please try again."}
    }
}

export const loginUser = async(userEmail,password)=>{
    try{
        const [rows] = await pool.query(`SELECT * FROM user WHERE email = ?`,[userEmail]);
        if (rows.length === 0){
            return{success:false,message:"Invalid email or password"}
        }
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return {success:false,message:"Invalid email or password"}
        }
        const token = jwt.sign(
            {id:user.id,email:user.email},
            JWT_SECRET,
            {expiresIn:'1h'}
        )
        return{
            success:true,
            message:'Login Successful',
            token:token
        }

    } catch (error){
        console.error('Login service error:', error);
        return {success:false,message:"Login failed. Please try again later."}
    }
}
