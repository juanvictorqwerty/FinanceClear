import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './resetPassword.css'; // Import the new CSS file

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            toast.error('Invalid or missing reset token.');
            navigate('/login');
        }
        setToken(tokenFromUrl);
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!token) {
            toast.error('No token provided.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                token,
                newPassword: password
            });

            toast.success(response.data.message || 'Password has been reset successfully.');
            setTimeout(() => {
                navigate('/'); // Redirect to login after success
            }, 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div className="login-content">
                    <h2>Reset Password</h2>
                    <p className="subtitle">Enter and confirm your new password.</p>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;