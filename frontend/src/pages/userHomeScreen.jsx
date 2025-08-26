import React, { useState } from "react";
import Header from "../components/header";
import Search from "../components/Search"; // Import the Search component
import "./userHomeScreen.css";
import "../components/Search.css"; // Import the CSS for the Search component
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function UserHomeScreen() {
    const { user, isLoggedIn } = useAuth(); // Use the useAuth hook
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    if (!isLoggedIn) {
        // This case should ideally be handled by ProtectedRoute in App.js
        // but as a fallback or for initial rendering, we can show a loading/redirect message
        return (
            <>
                <div>
                    <h2 style={{ textAlign: "center" }}>Welcome to Home Screen</h2>
                    <p style={{ textAlign: "center" }}>Redirecting to login...</p>
                </div>
            </>
        );
    }

    const toggleDetails = () => {
        setIsDetailsVisible(!isDetailsVisible);
    };

    return (
        <>
            <Header />
            <div className="user-home-container">
                <h2 className="welcome-header">Welcome to Your Dashboard</h2>

                <div className="user-details-card">
                    <div className="card-header" onClick={toggleDetails}>
                        <h3>User Details</h3>
                        <button className="toggle-btn" aria-label="Toggle user details">
                            {isDetailsVisible ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                    </div>
                    {isDetailsVisible && (
                        <div className="card-body">
                            {user ? (
                                <ul>
                                    <li><strong>Name:</strong> <span>{user.username}</span></li>
                                    <li><strong>Email:</strong> <span>{user.email}</span></li>
                                    <li><strong>Matricule:</strong> <span>{user.matricule}</span></li>
                                </ul>
                            ) : (
                                <p>No user data available</p>
                            )}
                        </div>
                    )}
                </div>
                <Search />
            </div>
        </>
    );
}

export default UserHomeScreen;