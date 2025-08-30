import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // Assuming you'll add some styles for the alert
import { useAuth } from '../context/AuthContext'; // Import useAuth
import API_URL from '../apiConfig';

const Search = () => {
    const [receiptIds, setReceiptIds] = useState(['']);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'
    const [processingDetails, setProcessingDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); // Use the useAuth hook

    const handleCheckReceipts = async () => {
        const filteredIds = receiptIds.map(id => id.trim()).filter(id => id !== '');
        
        // Reset alerts and details on each new check
        setShowAlert(false);
        setProcessingDetails([]);

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
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/sheets/check-receipts`, {
                receiptIds: filteredIds,
                userName: username,
            });

            // Always set the main message from the response
            setAlertMessage(response.data.message || 'An unknown response was received from the server.');

            if (response.data.success) {
                setAlertType('success');
            } else {
                setAlertType('error');
            }

            // Set processing details if they exist in the response
            if (response.data.details && Array.isArray(response.data.details)) {
                setProcessingDetails(response.data.details);
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
                <div className={`alert ${alertType}`}>
                    <p className="alert-message-main">{alertMessage}</p>
                    {processingDetails.length > 0 && (
                        <ul className="details-list">
                            {processingDetails.map((detail, index) => (
                                <li key={index} className={`detail-item status-${detail.status}`}>
                                    <strong>Receipt {detail.receiptId}:</strong> {detail.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;