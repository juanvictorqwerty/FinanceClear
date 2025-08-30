import React, { use, useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./forgotPassword.css";

function ResetPassword(){
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken,setResetToken]=useState("");
    const location = useLocation();

    useEffect(()=>{
        const params=new URLSearchParams(location.search);
        const token=params.get("token");
        console.log(token);
        setResetToken(token);
    },[location.search]);

    const handleSubmit=async (e)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            alert("Passwords do not match");
            return;
        }
        try{
            const response= await axios.post(
                "http://localhost:5000/api/auth/reset-password",
                {
                    token:resetToken,
                    password:password
                }
            );
            alert(response.data.message);
        }catch(error){
            alert(error.response.data.message);
        }

    }       

    return(
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div className="login-content">
                    <h2>Reset Password</h2>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input type="password"
                        id="password" 
                        name="password" 
                        value={password}
                        onChange={(e)=>{
                            setPassword(e.target.value);
                        }}
                        required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={confirmPassword}
                        onChange={(e)=>{
                            setConfirmPassword(e.target.value);
                        }}
                        required />      
                    </div>
                    <button type="submit">Reset Password</button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword;


