import React, { useState } from 'react';
import './CheckUser.css'; // Assumes CSS file exists

function CheckUser() {
  const [username, setUsername] = useState('');
  const [userExists, setUserExists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalize input: trim spaces, remove accents, convert to lowercase
  const handleInputChange = (e) => {
    // Update state with the raw input value
    // Normalization will happen when the request is sent
    setUsername(e.target.value);
  };

  const handleCheckUser = async () => {
    if (!username) return; // Prevent submission if username is empty
    setLoading(true);
    setError(null);
    setUserExists(null);

    // Normalize username before sending the request
    const normalizedUsername = username.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const controller = new AbortController();
    // 5-second timeout
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    try {
      const response = await fetch(`http://127.0.0.1:8000/check_user/?name=${encodeURIComponent(username)}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear timeout if request completes in time

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserExists(data.user_exists);
    } catch (e) {
      if (e.name === 'AbortError') {
        setError('Request timed out. Please check if the server is running.');
      } else {
        setError('Failed to fetch: ' + e.message);
      }
      console.error('CheckUser fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-user-container">
      <h2>Check User Existence</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={handleInputChange}
      />
      <button onClick={handleCheckUser} disabled={loading || !username}>
        {loading ? 'Checking...' : 'Check'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {userExists !== null && (
        <div className={`sign ${userExists ? 'green' : 'red'}`}>
          {userExists ? 'User Found (Green Sign)' : 'User Not Found (Red Sign)'}
        </div>
      )}
    </div>
  );
}

export default CheckUser;