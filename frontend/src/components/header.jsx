import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './header.css';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {isLoggedIn, logout } = useAuth(); // Use the useAuth hook

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <i className="fas fa-briefcase logo-icon"></i>
                <span className="logo-text">
                    Welcome
                </span>
            </div>

            <ul className="navbar-links">
                <li>
                    <Link
                        to="/"
                        className={location.pathname === "/" ? "active" : ''}
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
                <li>
                    <Link
                        to="/about"
                        className={location.pathname === '/about' ? "active" : ''}
                    >
                        About Us
                    </Link>
                </li>

                {isLoggedIn ? ( // Only show logout if logged in
                    <li>
                        <button
                            onClick={handleLogout}
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