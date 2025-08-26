import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // Assuming you'll add some styles for the alert
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Search = () => {
    const [receiptIdsInput, setReceiptIdsInput] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'
    const { user } = useAuth(); // Use the useAuth hook

    const handleCheckReceipts = async () => {
        const receiptIds = receiptIdsInput.split(/[,\n]/).map(id => id.trim()).filter(id => id !== '');

        if (receiptIds.length === 0) {
            setAlertMessage('Please enter at least one receipt ID.');
            setAlertType('error');
            setShowAlert(true);
            return;
        }

        const username = user?.username; // Get username from AuthContext
        if (!username) {
            setAlertMessage('User not logged in. Cannot check receipts.');
            setAlertType('error');
            setShowAlert(true);
            return;
        }

        const spreadsheetId = "1djogVeb0vT2Klqnx7HZfON-g1B3i4KV_5426ACNbHJs"; // Your spreadsheet ID

        if (!spreadsheetId) {
            setAlertMessage('Spreadsheet ID is not configured. Please set REACT_APP_GOOGLE_SHEET_ID in your .env file.');
            setAlertType('error');
            setShowAlert(true);
            return;
        }

        try {
            // New backend endpoint for checking multiple receipts
            const response = await axios.post('http://localhost:5000/api/sheets/check-receipts', {
                spreadsheetId,
                receiptIds,
                userName: username,
            });

            console.log('Backend Response:', response.data);

            if (response.data.success) {
                setAlertMessage('All receipts checked!');
                setAlertType('success');
            } else {
                setAlertMessage(response.data.message || 'Failed to check some receipts.');
                setAlertType('error');
            }
            setShowAlert(true);
        } catch (error) {
            console.error('Error checking receipts:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setAlertMessage(error.response.data.message);
            } else {
                setAlertMessage('An error occurred while checking receipts.');
            }
            setAlertType('error');
            setShowAlert(true);
        }
    };

    return (
        <div className="search-container">
            <h3>Check Multiple Receipts</h3>
            <div className="search-bar">
                <textarea
                    value={receiptIdsInput}
                    onChange={(e) => setReceiptIdsInput(e.target.value)}
                    placeholder="Enter Receipt IDs, separated by commas or newlines"
                    rows="5"
                ></textarea>
                <button onClick={handleCheckReceipts}>Check Receipts</button>
            </div>

            {showAlert && (
                <div className={`alert ${alertType}`}>
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default Search;