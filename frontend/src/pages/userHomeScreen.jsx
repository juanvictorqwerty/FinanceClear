import React from "react";
import Header from "../components/header";
import Search from "../components/Search"; // Import the Search component
import "./userHomeScreen.css";
import "../components/Search.css"; // Import the CSS for the Search component
import { useAuth } from '../context/AuthContext'; // Import useAuth

function UserHomeScreen() {
    const { user, isLoggedIn } = useAuth(); // Use the useAuth hook

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

    return ( //this are supposed to be the same name as database columns
        <>
            <Header />
            <div className="user-home-container">
                <div>
                    <h2 style={{ textAlign: "center" }}>Welcome to Home Screen</h2>
                </div>
                <div className="user-details-section">
                    <h3 style={{ textAlign: "center" }}>User Details</h3>
                    {user ? (
                        <>
                            <p style={{ textAlign: "center" }}>Name: {user.username}</p>
                            <p style={{ textAlign: "center" }}>Email: {user.email}</p>
                            <p style={{ textAlign: "center" }}>Matricule: {user.matricule}</p>
                        </>
                    ) : (
                        <p style={{ textAlign: "center" }}>No user data available</p>
                    )}
                </div>
                <Search /> {/* Add the Search component here */}
            </div>
        </>
    );
}

export default UserHomeScreen;