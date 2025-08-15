import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './header.css';

const Header = () => {
    const location = useLocation();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 200);
    }, [location]);

    const getData = async () => {
        const data = JSON.parse(sessionStorage.getItem('userInfo'));
        if (data && data.isLoggedIn) {
            // Access the actual user data from the nested structure
            const userInfo = data.userData?.data?.[0] || data.userData;
            setUserData(userInfo);
        }
    }

    const logout = () => {
        sessionStorage.clear();
        setUserData(null);
        navigate('/');
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <i className="fas fa-briefcase logo-icon"></i>
                <span className="logo-text">Welcome  </span>
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
