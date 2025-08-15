import React, { useState, useEffect } from "react";
import './loginScreen.css'; 
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

const LoginScreen = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = React.useState({
        userEmail: '',
        password: '',
    });
    const [showAlert, setShowAlert] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Trim all inputs except passwords
        const trimmedValue = name === 'password' ? value : value.trim();
        setFormValues({ ...formValues, [name]: trimmedValue });
        // Reset alert and error on input change to avoid showing stale errors
        setShowAlert(false);
        setEmailError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailValid(formValues.userEmail)) {
            setEmailError('Invalid email format. Please use a valid ICT University email.');
            setShowAlert(true);
            return;
        }
        
        if (formValues.password.length === 0) {
            setEmailError('Please enter a password.');
            setShowAlert(true);
            return;
        }
        
        // Valid email and password provided
        console.log('Form submitted successfully');
        try{
            const response=await axios.post("http://localhost:5000/api/auth/login-user",{  //login actually
                userEmail: formValues.userEmail,
                password: formValues.password
            });
            if (response.data.success){
                toast.success(response.data.message || "Login Successful")                
                const token= response.data.token;
                localStorage.setItem("authToken", token);
                localStorage.setItem("keepLoggedIn", JSON.stringify(true));
                
                // Store user data in localStorage for persistence
                localStorage.setItem("userInfo", JSON.stringify({
                    isLoggedIn: true,
                    userData: response.data.user
                }));
                
                navigate('/Home');
            }else{
                toast.error(response.data.message || "Login Failed")
            }
        }catch(error){
            console.log("error",error.response.data);
            toast.error(error.response.data.message || "Something went wrong");
        }             
    };

    // Auto-login check on component mount
    useEffect(() => {
        const checkAutoLogin = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const keepLoggedIn = JSON.parse(localStorage.getItem("keepLoggedIn"));
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));

                if (token && keepLoggedIn && userInfo?.isLoggedIn) {
                    // Validate token by making a quick API call
                    const response = await axios.get("http://localhost:5000/api/auth/get-userData", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data.success) {
                        // Token is valid, redirect to home
                        toast.success("Welcome back!");
                        navigate('/Home');
                    } else {
                        // Token is invalid, clear localStorage
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("keepLoggedIn");
                        localStorage.removeItem("userInfo");
                        setIsCheckingAuth(false);
                    }
                } else {
                    // No valid login data found
                    setIsCheckingAuth(false);
                }
            } catch (error) {
                console.error("Auto-login check failed:", error);
                // Clear potentially corrupted data
                localStorage.removeItem("authToken");
                localStorage.removeItem("keepLoggedIn");
                localStorage.removeItem("userInfo");
                setIsCheckingAuth(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAutoLogin();
    }, [navigate]);

    const isEmailValid = (email) => {
        return /^[a-zA-Z0-9._%+]+@ictuniversity\.edu\.cm$/.test(email);
    };

    if (isLoading || isCheckingAuth) {
        return (
            <div className="login-wrapper">
                <div className="loading-container">
                    <img 
                        src="/logo.png" 
                        alt="FiClear logo"
                        className="logo"
                        style={{ width: '120px', height: 'auto', marginBottom: '20px' }}
                    />
                    <h2>Checking authentication...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                {showAlert && (
                    <div className="error-alert">
                        {emailError}
                    </div>
                )}
                <h1>Login</h1>
                <img 
                    src="/logo.png" 
                    alt="FiClear logo with stylized blue and green text, conveying a welcoming and professional tone"
                    className="logo"
                    style={{ width: '120px', height: 'auto' }}
                />
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Your ICTU email"
                        required
                        name="userEmail"
                        value={formValues.userEmail}
                        onChange={handleInputChange}
                        pattern="[a-zA-Z0-9._%+]+@ictuniversity\.edu\.cm"
                        title="Please enter a valid ICT University email address (e.g., example@ictuniversity.edu.cm)"
                    />
                    <FaEnvelope className="icon" />
                </div>
                <div className="input-box"> 
                    <input type="password" placeholder="Your ICTU password" required name="password" value={formValues.password} onChange={handleInputChange} />
                    <FaLock className="icon" />
                </div>
                
                <button type="submit" className="btn">Login</button>
                <div className="register-link">
                    <p>Or <Link to="/signIn">Register</Link></p>
                </div>   
            </form>
        </div>
    );
};

export default LoginScreen;
