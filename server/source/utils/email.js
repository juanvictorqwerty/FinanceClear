
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendPasswordResetEmail = async (to, token) => {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Password Reset',
        html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
               <p>Please click on the following link, or paste this into your browser to complete the process:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Error sending password reset email');
    }
};
