import React from "react";
import { useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./forgotPassword.css"; // Import the CSS file

function ForgotPassword() {
    const [userEmail, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleForgotPassword = async(e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setSuccess(""); // Clear previous success messages
        try {
            await axios.post(
                "http://localhost:5000/api/auth/forgot-password",
            {
                userEmail,
            }
            );
            setSuccess("Password reset link sent to your email.");
            toast.success("Password reset link sent to your email.");
        } catch (error) {
            setError(error.response.data.message);
            toast.error(error.response.data.message);
        }
    };


    return (
        <div className="login-container">
            <form onSubmit={handleForgotPassword}>
                <div className="login-content">
                    <h2>Forgot Password?</h2>
                    <p className="subtitle">No problem. Enter your email below and we'll send you a link to reset it.</p>
                    {success && <p className="success">{success}</p>}
                    {error && <p className="error">{error}</p>}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="userEmail" placeholder="you@ictuniversity.edu.cm" value={userEmail} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button type="submit">Reset Password</button>
                </div>
            </form>
            </div>
    )   
}

export default ForgotPassword;