import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // Assuming you'll add some styles for the alert
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Search = () => {
    const [receiptIds, setReceiptIds] = useState(['']);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); // Use the useAuth hook

    const handleCheckReceipts = async () => {
        const filteredIds = receiptIds.map(id => id.trim()).filter(id => id !== '');
        if (filteredIds.length === 0) {
            setAlertMessage('Please enter at least one receipt ID.');
            setAlertType('error');
            setShowAlert(true);
            return;
        }
        const username = user?.username;
        if (!username) {
            setAlertMessage('User not logged in. Cannot check receipts.');
            setAlertType('error');
            setShowAlert(true);
            return;
        }
        const spreadsheetId = "1djogVeb0vT2Klqnx7HZfON-g1B3i4KV_5426ACNbHJs";
        if (!spreadsheetId) {
            setAlertMessage('Spreadsheet ID is not configured. Please set REACT_APP_GOOGLE_SHEET_ID in your .env file.');
            setAlertType('error');
            setShowAlert(true);
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/sheets/check-receipts', {
                spreadsheetId,
                receiptIds: filteredIds,
                userName: username,
            });
            if (response.data.success) {
                setAlertMessage('All receipts checked!');
                setAlertType('success');
            } else {
                setAlertMessage(response.data.message || 'Failed to check some receipts.');
                setAlertType('error');
            }
            setShowAlert(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setAlertMessage(error.response.data.message);
            } else {
                setAlertMessage('An error occurred while checking receipts.');
            }
            setAlertType('error');
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (idx, value) => {
        setReceiptIds(ids => ids.map((id, i) => (i === idx ? value : id)));
    };

    const handleAddField = () => {
        setReceiptIds(ids => [...ids, '']);
    };

    const handleRemoveField = (idx) => {
        setReceiptIds(ids => ids.length > 1 ? ids.filter((_, i) => i !== idx) : ids);
    };

    return (
        <div className="search-container">
            <h3>Check Multiple Receipts</h3>
            <div className="search-bar modern-bar">
                {receiptIds.map((id, idx) => (
                    <div className="input-row" key={idx}>
                        <input
                            type="text"
                            className="receipt-input"
                            value={id}
                            onChange={e => handleInputChange(idx, e.target.value)}
                            placeholder={`Receipt ID #${idx + 1}`}
                            disabled={isLoading}
                        />
                        {receiptIds.length > 1 && (
                            <button
                                className="remove-btn"
                                onClick={() => handleRemoveField(idx)}
                                disabled={isLoading}
                                aria-label="Remove field"
                            >
                                &minus;
                            </button>
                        )}
                        {idx === receiptIds.length - 1 && (
                            <button
                                className="add-btn"
                                onClick={handleAddField}
                                disabled={isLoading}
                                aria-label="Add field"
                            >
                                +
                            </button>
                        )}
                    </div>
                ))}
                <button
                    className="search-btn"
                    onClick={handleCheckReceipts}
                    disabled={isLoading}
                >
                    {isLoading ? <span className="loader"></span> : 'Check Receipts'}
                </button>
            </div>
            {showAlert && (
                <div className={`alert ${alertType}`}>{alertMessage}</div>
            )}
        </div>
    );
};

export default Search;