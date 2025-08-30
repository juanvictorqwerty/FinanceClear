
import React, { useEffect, useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../apiConfig';

const API_BASE = `${API_URL.replace(/\/$/, '')}/api/admin`;



function Admin() {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [clearances, setClearances] = useState([]);
    const [useduba, setUseduba] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { adminLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };

    // Fetch all data for a tab
    const fetchData = async (tab) => {
        setLoading(true);
        let url = `${API_BASE}/${tab}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                if (tab === 'users') setUsers(data.data);
                if (tab === 'profiles') setProfiles(data.data);
                if (tab === 'clearances') setClearances(data.data.reverse());
                if (tab === 'useduba') setUseduba(data.data);
            }
        } catch (e) {
            // handle error
        }
        setLoading(false);
    };

    // Search for a tab
    const handleSearch = async (tab, term) => {
        setLoading(true);
        let url = `${API_BASE}/${tab}/search?q=${encodeURIComponent(term)}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                if (tab === 'users') setUsers(data.data);
                if (tab === 'profiles') setProfiles(data.data);
                if (tab === 'clearances') setClearances(data.data.reverse());
                if (tab === 'useduba') setUseduba(data.data);
            }
        } catch (e) {
            // handle error
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData(activeTab);
        // eslint-disable-next-line
    }, [activeTab]);

    return (
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
            }}>
                <button
                    onClick={handleLogout}
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>
            <h1 style={{textAlign:'center',marginTop:24}}>Admin Dashboard</h1>
            <AdminPanel
                users={users}
                profiles={profiles}
                clearances={clearances}
                useduba={useduba}
                onSearch={handleSearch}
                loading={loading}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
        </div>
    );
}

export default Admin;
