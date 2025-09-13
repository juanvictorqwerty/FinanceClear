import React, { useState, useEffect } from "react";
import './loginScreen.css';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import API_URL from '../apiConfig';

const LoginScreen = () => {
    const navigate = useNavigate();
    const { login, isLoggedIn} = useAuth(); // Use the useAuth hook
    const [formValues, setFormValues] = React.useState({
        userEmail: '',
        password: '',
    });
    const [showAlert, setShowAlert] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');
    const [isLoading, setIsLoading] = useState(true); // For initial loading state
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // For auto-login check

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const trimmedValue = name === 'password' ? value : value.trim();
        setFormValues({ ...formValues, [name]: trimmedValue });
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
            setEmailError('Password cannot be empty.');
            setShowAlert(true);
            return;
        }

        try {
                                    const response = await axios.post(`${API_URL.replace(/\/$/, '')}/api/auth/login-user`, {
                userEmail: formValues.userEmail,
                password: formValues.password
            });

            if (response.data.success) {
                toast.success(response.data.message || "Login Successful");
                // Use the login function from AuthContext
                login(response.data.user, response.data.token);
                navigate('/');
            } else {
                setEmailError(response.data.message || "Login Failed");
                setShowAlert(true);
                toast.error(response.data.message || "Login Failed", { autoClose: 10000 });
            }
        } catch (error) {
            setEmailError(error.response.data.message || "Something went wrong");
            setShowAlert(true);
            toast.error(error.response.data.message || "Something went wrong", { autoClose: 10000 });
        }
    };

    // Auto-login check on component mount
    useEffect(() => {
        // If already logged in via AuthContext (from localStorage), navigate to Home
        if (isLoggedIn) {
            toast.success("Welcome back!");
            navigate('/');
            setIsLoading(false);
            setIsCheckingAuth(false);
        } else {
            // If not logged in, proceed to show the login form
            setIsLoading(false);
            setIsCheckingAuth(false);
        }
    }, [isLoggedIn, navigate]); // Depend on isLoggedIn and navigate

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

                <div className="forgot-password-link">
                    <Link to="/forgot-password">Forgot Password?</Link>
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