import axios from "axios";
import React, { useState, useEffect } from "react";

function UserHomeScreen() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                console.log("No token found");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:5000/api/auth/get-userData", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                console.log(response.data);
                // Handle different response structures
                const userInfo = response.data.data || response.data.user || response.data;
                setUserData(userInfo);
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

    return (
        <>
            <div>
                <h2 style={{ textAlign: "center" }}>Welcome to Home Screen</h2>
            </div>
            <div>
                <h3 style={{ textAlign: "center" }}>User Details</h3>
                {userData ? (
                    <>
                        <p style={{ textAlign: "center" }}>Name: {userData.userName || 'N/A'}</p>
                        <p style={{ textAlign: "center" }}>Email: {userData.userEmail || 'N/A'}</p>
                    </>
                ) : (
                    <p style={{ textAlign: "center" }}>No user data available</p>
                )}
            </div>
        </>
    );
}

export default UserHomeScreen;
