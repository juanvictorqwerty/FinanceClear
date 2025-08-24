import React, { useState } from 'react';
import axios from 'axios';



const Search = () => {
    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!query) return;

        const spreadsheetId = "1djogVeb0vT2Klqnx7HZfON-g1B3i4KV_5426ACNbHJs";

        if (!spreadsheetId) {
            alert('Spreadsheet ID is not configured. Please set REACT_APP_GOOGLE_SHEET_ID in your .env file.');
            return;
        }

        try {
            const sheetName = 'Sheet1'; // Consider making this a prop or part of a config

            const response = await axios.get('http://localhost:5000/api/sheets/search', {
                params: {
                    spreadsheetId,
                    sheetName,
                    query,
                },
            });

            console.log('Sheet Address:', `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
            console.log('Backend Response:', response.data);

            setSearchResult(response.data);
            setSearched(true);
        } catch (error) {
            console.error('Error searching sheet:', error);
            setSearchResult({ success: false, message: 'Search failed' });
            setSearched(true);
        }
    };

    return (
        <div className="search-container">
            <h3>Search for a Receipt</h3>
            <div className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter Receipt ID, Date, or Name"
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {searched && (
                <div className="search-results">
                    {searchResult?.found ? (
                        <div className="success-sign">
                            <p>&#10004; Receipt Found</p>
                            <pre>{JSON.stringify(searchResult.data, null, 2)}</pre>
                        </div>
                    ) : (
                        <div className="not-found-sign">
                            <p>&#10060; {searchResult?.message || 'No results found'}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
