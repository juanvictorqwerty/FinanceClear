import React from "react";
import "./forgotPassword.css"; // Import the CSS file

function ForgotPassword() {
    return (
        <div className="login-container">
            <div className="login-content">
                <h2>Forgot Password?</h2>
                <p className="subtitle">No problem. Enter your email below and we'll send you a link to reset it.</p>
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@ictuniversity.edu.cm" required />
                    </div>
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword;