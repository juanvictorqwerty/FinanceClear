import bcrypt from 'bcrypt'
import { pool } from '../config/database.js';
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "jWTrandomstringSecretUserToken1sttimeIuseitlearNINGEveryDay147";

export const registerUser = async (user) => {
    console.log('Registering user:', user);
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const userQuery = `INSERT INTO user(email, username, password, matricule) VALUES (?, ?, ?, ?)`;
        const userValues = [user.userEmail, user.userName, hashedPassword, user.matricule];
        await connection.query(userQuery, userValues);

        const profileQuery = `INSERT INTO profile(email, username) VALUES (?, ?)`;
        const profileValues = [user.userEmail, user.userName];
        await connection.query(profileQuery, profileValues);

        await connection.commit();
        return { success: true, message: "User saved successfully" };
    } catch (error) { 
        await connection.rollback();
        console.error('Registration error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: "Account with the email or matricule already exists, try to log in" };
        }
        return { success: false, message: "Registration failed. Please try again." };
    } finally {
        connection.release();
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
            {email:user.email},
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

export const getUserToken=async(token)=>{
    try {
        const trimmedToken=token.trim();
        const decodedToken=await jwt.verify(trimmedToken,JWT_SECRET)

        const rows = await pool.query(`Select email,username,matricule from user where email=?` ,[decodedToken.email]);
        if(rows.length===0){
            return {success:false,message:"user not found"}
        }
        return {success:true,data:rows[0]}
    }catch(error){
        return {success:false, message:"Invalid token"}
    }
}
