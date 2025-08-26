import React, { useState } from 'react';
import './AdminPanel.css';

const TABS = [
  { key: 'users', label: 'Users' },
  { key: 'profiles', label: 'Profiles' },
  { key: 'clearances', label: 'Clearances' },
  { key: 'useduba', label: 'UsedUBA Receipts' },
];



function MiniCard({ obj }) {
  if (Array.isArray(obj)) {
    return (
      <div className="minicard-list">
        {obj.map((item, idx) => (
          <div className="minicard" key={idx}>
            {typeof item === 'object' && item !== null ? (
              Object.entries(item).map(([k, v]) => (
                <div className="minicard-row" key={k}>
                  <span className="minicard-key">{k}:</span>
                  <span className="minicard-value">{typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}</span>
                </div>
              ))
            ) : (
              <span className="minicard-value">{String(item)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }
  // Single object
  return (
    <div className="minicard">
      {Object.entries(obj).map(([k, v]) => (
        <div className="minicard-row" key={k}>
          <span className="minicard-key">{k}:</span>
          <span className="minicard-value">{typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}</span>
        </div>
      ))}
    </div>
  );
}

function ExpandableCell({ value }) {
  const [expanded, setExpanded] = useState(false);
  if (typeof value === 'object' && value !== null) {
    return (
      <td className="exp-cell">
        <button className="exp-btn" onClick={() => setExpanded(e => !e)}>
          {expanded ? 'Hide' : 'Show'}
        </button>
        {expanded && (
          <div className="exp-minicards">
            <MiniCard obj={value} />
          </div>
        )}
      </td>
    );
  }
  // Style string/number/boolean in a modern way
  return (
    <td className="modern-cell">
      {typeof value === 'string' ? <span className="modern-string">{value}</span> : value}
    </td>
  );
}

function AdminPanel({
  users, profiles, clearances, useduba,
  onSearch, loading, activeTab, setActiveTab, searchTerm, setSearchTerm
}) {
  const dataMap = { users, profiles, clearances, useduba };
  const columnsMap = {
    users: ['email', 'username', 'matricule'],
    profiles: Object.keys(profiles[0] || {}),
    clearances: Object.keys(clearances[0] || {}),
    useduba: Object.keys(useduba[0] || {}),
  };

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => { setActiveTab(tab.key); setSearchTerm(''); }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="admin-search">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button onClick={() => onSearch(activeTab, searchTerm)} disabled={loading}>
          Search
        </button>
      </div>
      <div className="admin-table-container">
        {loading ? <div className="admin-loading">Loading...</div> : (
          <table className="admin-table">
            <thead>
              <tr>
                {columnsMap[activeTab]?.map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {dataMap[activeTab]?.map((row, i) => (
                <tr key={i}>
                  {columnsMap[activeTab]?.map(col => (
                    <ExpandableCell key={col} value={row[col]} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
