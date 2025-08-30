import React, { useState, useEffect } from "react";
import './loginScreen.css';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import API_URL from '../apiConfig';


const AdminLoginScreen = () => {
    const navigate = useNavigate();
    // Use adminLogin from context, and check if an admin is already logged in.
    const { adminLogin, isAdminLoggedIn } = useAuth();
    const [formValues, setFormValues] = React.useState({
        userEmail: '',
        password: '',
    });
    const [showAlert, setShowAlert] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');
    const [isLoading, setIsLoading] = useState(false); // Only for form submission loading state

    // Redirect if admin is already logged in
    useEffect(() => {
        if (isAdminLoggedIn) {
            navigate('/admin');
        }
    }, [isAdminLoggedIn, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
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

        setIsLoading(true);
        try {
            // Point to the admin login endpoint
                        const response = await axios.post(`${API_URL.replace(/\/$/, '')}/api/auth/login-admin`, {
                userEmail: formValues.userEmail,
                password: formValues.password
            });

            if (response.data.success) {
                toast.success(response.data.message || "Admin Login Successful");
                // Use the adminLogin function from AuthContext
                adminLogin(response.data.user, response.data.token);
                // Redirect to the admin dashboard
                navigate('/admin');
            } else {
                toast.error(response.data.message || "Login Failed");
                setEmailError(response.data.message || "Login Failed");
                setShowAlert(true);
            }
        } catch (error) {
            console.log("error", error.response?.data);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    
    const isEmailValid = (email) => {
        // Assuming admins also use ICTU emails. Adjust if necessary.
        return /^[a-zA-Z0-9._%+]+@ictuniversity\.edu\.cm$/.test(email);
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                {showAlert && (
                    <div className="error-alert">
                        {emailError}
                    </div>
                )}
                <h1>Admin Login</h1>
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
                        disabled={isLoading}
                    />
                    <FaEnvelope className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Your ICTU password"
                        required
                        name="password"
                        value={formValues.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <FaLock className="icon" />
                </div>

                <button type="submit" className="btn" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                <div className="register-link">
                    <p>Or <Link to="/admin-signIn">Register</Link></p>
                </div>
            </form>
        </div>
    );
};

export default AdminLoginScreen;