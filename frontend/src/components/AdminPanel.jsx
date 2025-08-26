import React, { useState } from 'react';
import './AdminPanel.css';
function ConfirmDialog({ open, onConfirm, onCancel, message }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button className="modal-btn confirm" onClick={onConfirm}>Confirm</button>
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ open, onClose, onSave, fields, values, title }) {
  const [form, setForm] = useState(values || {});
  React.useEffect(() => { setForm(values || {}); }, [values]);
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-dialog">
        <h3 className="modal-title">{title}</h3>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          {fields.map(f => (
            <div className="modal-row" key={f.name}>
              <label>{f.label}</label>
              <input
                type={f.type || 'text'}
                value={form[f.name] ?? ''}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                required={f.required}
                min={f.type === 'number' ? 0 : undefined}
                step={f.type === 'number' ? 'any' : undefined}
                disabled={f.disabled}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button className="modal-btn confirm" type="submit">Save</button>
            <button className="modal-btn cancel" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
  const [editModal, setEditModal] = useState({ open: false, fields: [], values: {}, onSave: null, title: '' });
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null, message: '' });
  const [editRow, setEditRow] = useState(null);
  const [editType, setEditType] = useState('');
  const dataMap = { users, profiles, clearances, useduba };
  const columnsMap = {
    users: ['email', 'username', 'matricule'],
    profiles: Object.keys(profiles[0] || {}),
    clearances: Object.keys(clearances[0] || {}),
    useduba: Object.keys(useduba[0] || {}),
  };

  // Backend endpoints
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api/admin';

  // Edit handlers
  const handleEditUser = (row) => {
    setEditType('user');
    setEditRow(row);
    setEditModal({
      open: true,
      title: 'Edit User',
      fields: [
        { name: 'email', label: 'Email', required: true },
        { name: 'username', label: 'Username', required: true },
      ],
      values: { email: row.email, username: row.username },
      onSave: (form) => {
        setEditModal(m => ({ ...m, open: false }));
        setConfirm({
          open: true,
          message: `Are you sure you want to update this user?`,
          onConfirm: async () => {
            setConfirm(c => ({ ...c, open: false }));
            await fetch(`${API_BASE}/user/edit`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ oldEmail: row.email, oldUsername: row.username, newEmail: form.email, newUsername: form.username })
            });
            onSearch('users', '');
            onSearch('profiles', '');
          }
        });
      }
    });
  };

  const handleEditProfile = (row) => {
    setEditType('profile');
    setEditRow(row);
    setEditModal({
      open: true,
      title: 'Edit Profile',
      fields: [
        { name: 'email', label: 'Email', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'school_fee_due', label: 'Due Fee', type: 'number', required: true },
        { name: 'penalty_fee', label: 'Penalty Fee', type: 'number', required: true },
        { name: 'excess_fee', label: 'Excess Fee', type: 'number', required: true },
      ],
      values: {
        email: row.email,
        username: row.username,
        school_fee_due: row.school_fee_due,
        penalty_fee: row.penalty_fee,
        excess_fee: row.excess_fee
      },
      onSave: (form) => {
        setEditModal(m => ({ ...m, open: false }));
        setConfirm({
          open: true,
          message: `Are you sure you want to update this profile?`,
          onConfirm: async () => {
            setConfirm(c => ({ ...c, open: false }));
            // Update email/username if changed
            if (form.email !== row.email || form.username !== row.username) {
              await fetch(`${API_BASE}/user/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldEmail: row.email, oldUsername: row.username, newEmail: form.email, newUsername: form.username })
              });
            }
            // Update fees
            await fetch(`${API_BASE}/profile/fees`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: form.username, school_fee_due: form.school_fee_due, penalty_fee: form.penalty_fee, excess_fee: form.excess_fee })
            });
            onSearch('profiles', '');
            onSearch('users', '');
          }
        });
      }
    });
  };

  return (
    <div className="admin-panel">
      <EditModal {...editModal} onClose={() => setEditModal(m => ({ ...m, open: false }))} />
      <ConfirmDialog {...confirm} onCancel={() => setConfirm(c => ({ ...c, open: false }))} />
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
                {(activeTab === 'users' || activeTab === 'profiles') && <th>Edit</th>}
              </tr>
            </thead>
            <tbody>
              {dataMap[activeTab]?.map((row, i) => (
                <tr key={i}>
                  {columnsMap[activeTab]?.map(col => (
                    <ExpandableCell key={col} value={row[col]} />
                  ))}
                  {(activeTab === 'users') && (
                    <td><button className="edit-btn" onClick={() => handleEditUser(row)}>Edit</button></td>
                  )}
                  {(activeTab === 'profiles') && (
                    <td><button className="edit-btn" onClick={() => handleEditProfile(row)}>Edit</button></td>
                  )}
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
