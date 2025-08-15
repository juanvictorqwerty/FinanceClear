import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './header.css';

const Header = () => {
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, [location]);

    const getData = () => {
        try {
            // Check for token first
            const token = localStorage.getItem("authToken");
            const keepLoggedIn = localStorage.getItem("keepLoggedIn");
            
            if (token && keepLoggedIn === "true") {
                // Get user data
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo && userInfo.userData) {
                    // Handle different response structures
                    const userData = userInfo.userData.data?.[0] || 
                                    userInfo.userData[0] || 
                                    userInfo.userData;
                    setUserData(userData);
                } else {
                    // Fallback: create basic user data from token
                    setUserData({ userName: "User" });
                }
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            setUserData(null);
        }
    }

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setUserData(null);
        navigate('/');
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <i className="fas fa-briefcase logo-icon"></i>
                <span className="logo-text">
                    {userData ? `Welcome ${userData.userName || userData.name || ''}` : 'Welcome'}
                </span>
            </div>

            <ul className="navbar-links">
                <li>
                    <Link 
                        to="/Home" 
                        className={location.pathname === "/Home" ? "active" : ''}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/clearances" 
                        className={location.pathname === '/clearances' ? "active" : ''}
                    >
                        Clearances
                    </Link>
                </li>

                {userData ? (
                    <li>
                        <button 
                            onClick={logout}
                            className="logout-button"
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </li>
                ) : null}
            </ul>
        </nav>
    );
};

export default Header;
