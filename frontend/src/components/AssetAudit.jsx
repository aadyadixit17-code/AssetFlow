import React, { useState, useEffect } from 'react';

export default function AssetAudit() {
  const [audits, setAudits] = useState([]);
  const [scope, setScope] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedAuditId, setSelectedAuditId] = useState(null);
  const [auditItems, setAuditItems] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchAudits = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/audits');
      setAudits(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleCreateAudit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ scope, startDate, endDate })
    });
    if (res.ok) {
      setScope(''); setStartDate(''); setEndDate('');
      setMessage('Audit cycle created successfully!');
      fetchAudits();
    }
  };

  const loadAuditItems = async (id) => {
    setSelectedAuditId(id);
    const res = await fetch(`http://localhost:5000/api/audits/${id}/items`);
    setAuditItems(await res.json());
  };

  const handleUpdateItemStatus = async (itemId, status) => {
    await fetch(`http://localhost:5000/api/audit-items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    loadAuditItems(selectedAuditId);
  };

  const handleCloseAudit = async (id) => {
    await fetch(`http://localhost:5000/api/audits/${id}/close`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessage('Audit cycle closed. Discrepancies applied.');
    fetchAudits();
    setSelectedAuditId(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📋 Asset Audit System</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleCreateAudit} style={{ background: '#f9f9f9', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>Create Audit Cycle</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <input type="text" placeholder="Scope (e.g. Building A / IT Dept)" value={scope} onChange={e => setScope(e.target.value)} required style={{ padding: '8px' }} />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={{ padding: '8px' }} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={{ padding: '8px' }} />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '8px 15px', background: '#5bc0de', color: 'white', border: 'none', cursor: 'pointer' }}>Create Audit</button>
      </form>

      <h3>Audit Cycles</h3>
      <ul>
        {audits.map(audit => (
          <li key={audit.id} style={{ marginBottom: '10px' }}>
            <b>Scope: {audit.scope}</b> ({audit.startDate} to {audit.endDate}) - Status: <b>{audit.status}</b>
            <button onClick={() => loadAuditItems(audit.id)} style={{ marginLeft: '10px', padding: '4px 8px' }}>View Items</button>
            {audit.status === 'Open' && (
              <button onClick={() => handleCloseAudit(audit.id)} style={{ marginLeft: '5px', padding: '4px 8px', background: '#d9534f', color: 'white', border: 'none' }}>Close & Lock</button>
            )}
          </li>
        ))}
      </ul>

      {selectedAuditId && (
        <div style={{ marginTop: '20px' }}>
          <h3>Discrepancy Report & Item Verification</h3>
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Name</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditItems.map(item => (
                <tr key={item.id}>
                  <td>{item.Asset ? item.Asset.assetTag : 'N/A'}</td>
                  <td>{item.Asset ? item.Asset.name : 'N/A'}</td>
                  <td><b>{item.status}</b></td>
                  <td>
                    <button onClick={() => handleUpdateItemStatus(item.id, 'Verified')} style={{ background: 'green', color: 'white', marginRight: '5px' }}>Verified</button>
                    <button onClick={() => handleUpdateItemStatus(item.id, 'Missing')} style={{ background: 'orange', color: 'white', marginRight: '5px' }}>Missing</button>
                    <button onClick={() => handleUpdateItemStatus(item.id, 'Damaged')} style={{ background: 'red', color: 'white' }}>Damaged</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}