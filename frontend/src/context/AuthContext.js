import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // State for regular user authentication
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // State for admin authentication
    const [admin, setAdmin] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    // Effect to check for existing user session on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsLoggedIn(true);
        }
    }, []);

    // Effect to check for existing admin session on initial load
    useEffect(() => {
        const storedAdmin = localStorage.getItem('admin');
        const storedAdminToken = localStorage.getItem('adminToken');
        if (storedAdmin && storedAdminToken) {
            setAdmin(JSON.parse(storedAdmin));
            setAdminToken(storedAdminToken);
            setIsAdminLoggedIn(true);
        }
    }, []);

    // Regular user login
    const login = (userData, userToken) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        setUser(userData);
        setToken(userToken);
        setIsLoggedIn(true);
    };

    // Regular user logout
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
    };

    // Admin login
    const adminLogin = (adminData, adminUserToken) => {
        localStorage.setItem('admin', JSON.stringify(adminData));
        localStorage.setItem('adminToken', adminUserToken);
        setAdmin(adminData);
        setAdminToken(adminUserToken);
        setIsAdminLoggedIn(true);
    };

    // Admin logout
    const adminLogout = () => {
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        setAdmin(null);
        setAdminToken(null);
        setIsAdminLoggedIn(false);
    };

    const value = {
        user,
        token,
        isLoggedIn,
        login,
        logout,
        admin,
        adminToken,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
