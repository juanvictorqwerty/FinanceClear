
import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './grantedClearances.css';

function GrantedClearances() {
    const { user } = useAuth();
    const [clearances, setClearances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.username) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }
            try {
                // Fetch the profile with used_receipt JSON
                const response = await axios.post('http://localhost:5000/api/profile/get-profile', {
                    username: user.username
                });
                console.log('API response:', response.data);
                const usedReceipt = response.data?.data?.used_receipt;
                let parsed = [];
                if (Array.isArray(usedReceipt)) {
                    parsed = usedReceipt;
                } else if (typeof usedReceipt === 'string') {
                    try {
                        parsed = JSON.parse(usedReceipt);
                        if (!Array.isArray(parsed)) parsed = [parsed];
                    } catch (e) {
                        parsed = [];
                    }
                }
                console.log('Parsed used_receipt:', parsed);
                setClearances(parsed);
            } catch (err) {
                setError('Failed to fetch clearances.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    return (
        <>
            <Header />
            <div className="clearances-container">
                <h1>Your Granted Clearances</h1>
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                <div className="clearance-cards">
                    {clearances.length === 0 && !loading && !error && (
                        <p>No clearances found.</p>
                    )}
                    {clearances.map(clearance => (
                        <div className="clearance-card" key={clearance.id}>
                            <h2>Clearance #{clearance.id}</h2>
                            <p><strong>Email:</strong> {clearance.email}</p>
                            <p><strong>Clearance ID:</strong> {clearance.clearance_id}</p>
                            <p><strong>Receipts Used:</strong> {Array.isArray(clearance.receipt_ids) ? clearance.receipt_ids.join(', ') : clearance.receipt_ids}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default GrantedClearances;
