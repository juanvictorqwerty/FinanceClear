import React from "react";
import './loginScreen.css'; 
import { FaEnvelope  } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';

const LoginScreen = () => {
    return (
        <div className="wrapper">
            <form action="">
                <h1>Login</h1>
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
                    <input type="password" placeholder="Your ICTU password" required />
                    <FaLock className="icon" />
                </div>
                <div className="remember-forgot">
                    <label><input type="checkbox" />Remember me</label>
                </div>
                <button type="submit" className="btn">Login</button>
                <div className="register-link">
                    <p>Or <a href="signInScreen">Register</a></p>
                </div>   
            </form>
        </div>
    );
};

export default LoginScreen;