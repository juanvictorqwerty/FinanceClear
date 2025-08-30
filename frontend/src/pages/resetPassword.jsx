import React from "react";
import "./forgotPassword.css";
function ResetPassword(){
    return(
        <div className="login-container">
            <form>
                <div className="login-content">
                    <h2>Reset Password</h2>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required />      
                    </div>
                    <button type="submit">Reset Password</button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword;


