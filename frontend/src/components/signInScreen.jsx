import React from "react";
import './signInScreen.css'; 
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { FaEnvelope  } from 'react-icons/fa';

const LoginScreen = () => {
    return (
        <div className="wrapper">
            <form action="">
                <h1>Sign In</h1>
                <img 
                    src="/logo.png" 
                    alt="FiClear logo with stylized blue and green text, conveying a welcoming and professional tone"
                    className="logo"
                    style={{ width: '120px', height: 'auto' }} /* Slightly larger logo */
                />
                <div className="input-box">
                    <input type="email" placeholder="Your ICTU email" required />
                    <FaEnvelope className="icon" />
                </div>
                <div className="input-box"> 
                    <input type="text" placeholder="Your name as in your ID" required />
                <FaUser className="icon" />
                </div>
                <div className="input-box"> 
                    <input type="password" placeholder="Your ICTU password" required />
                    <FaLock className="icon" />
                </div>
                <div className="input-box"> 
                    <input type="password" placeholder="Confirm your password" required />
                    <FaLock className="icon" />
                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                </div>
                <button type="submit" className="btn">Login</button>
                <div className="register-link">
                    <p>Or <a href="loginScreen">Log in</a></p>
                </div>   
            </form>
        </div>
    );
};

export default LoginScreen;