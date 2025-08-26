import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';
// This component reuses styles from the existing login/sign-in pages.
// Ensure you have a shared CSS file or that styles in `loginScreen.css` are appropriate.
import './signInScreen.css'; 

const AdminSignInScreen = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        secretKey: '', // Added secret key state
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formValues.username || !formValues.email || !formValues.password || !formValues.secretKey) {
            toast.error('All fields are required.');
            return;
        }

        setIsLoading(true);
        try {
            // Note: This endpoint will need to be created on your backend.
                        const response = await axios.post("http://localhost:5000/api/auth/register-admin", formValues);

            if (response.data.success) {
                toast.success(response.data.message || "Admin registration successful! Please log in.");
                navigate('/admin-login'); // Redirect to the admin login page on success
            } else {
                toast.error(response.data.message || "Registration failed.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Admin Registration</h1>
                <img
                    src="/logo.png"
                    alt="FiClear Logo"
                    className="logo"
                    style={{ width: '120px', height: 'auto', marginBottom: '20px' }}
                />
                <div className="input-box">
                    <input
                        type="text"
                        placeholder="Username"
                        required
                        name="username"
                        value={formValues.username}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <FaEnvelope className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        name="password"
                        value={formValues.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <FaLock className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        placeholder="Secret Key"
                        required
                        name="secretKey"
                        value={formValues.secretKey}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <FaKey className="icon" />
                </div>

                <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register Admin'}
                </button>

                <div className="register-link">
                    <p>Already have an admin account? <Link to="/admin-login">Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default AdminSignInScreen;