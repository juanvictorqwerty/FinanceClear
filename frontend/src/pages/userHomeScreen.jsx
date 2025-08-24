import axios from "axios";
import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Search from "../components/Search"; // Import the Search component
import "./userHomeScreen.css";
import "../components/Search.css"; // Import the CSS for the Search component


function UserHomeScreen() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.log("No token found");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:5000/api/auth/get-userData", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            );

            if (response.data.success) {
                console.log(response.data);
                // Handle array response structure
                const userData = response.data.data[0]; // Get first item from array
                setUserData(userData);
                let userInfo = {
                    isLoggedIn:true,
                    userData:response.data
                }
                sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
            } else {
                console.log("No data fetched:", response.data.message);
            }
        } catch (error) {
            console.log("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <div>
                    <h2 style={{ textAlign: "center" }}>Welcome to Home Screen</h2>
                    <p style={{ textAlign: "center" }}>Loading user details...</p>
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
                    {userData ? (
                        <>
                            <p style={{ textAlign: "center" }}>Name: {userData.username}</p> 
                            <p style={{ textAlign: "center" }}>Email: {userData.email}</p>
                            <p style={{ textAlign: "center" }}>Matricule: {userData.matricule}</p>
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
