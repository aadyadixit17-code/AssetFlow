import React, { useState, useEffect } from 'react';

export default function MaintenanceManagement() {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [assets, setAssets] = useState([]);
  
  // Form states
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  // Get logged in user ID from localStorage or auth state if available
  const user = JSON.parse(localStorage.getItem('user')) || { id: 1 };

  const fetchData = async () => {
    try {
      const maintRes = await fetch('http://localhost:5000/api/maintenance');
      setMaintenanceList(await maintRes.json());

      const assetRes = await fetch('http://localhost:5000/api/assets');
      setAssets(await assetRes.json());
    } catch (err) {
      console.error('Error fetching maintenance data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRaiseRequest = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ assetId, raisedByUserId: user.id || 1, description, priority })
    });

    if (res.ok) {
      setAssetId('');
      setDescription('');
      setPriority('Medium');
      setMessage('Maintenance request raised successfully!');
      fetchData();
    } else {
      const data = await res.json();
      setMessage(data.message);
    }
  };

  const handleUpdateStatus = async (id, newStatus, technician = '') => {
    const res = await fetch(`http://localhost:5000/api/maintenance/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus, assignedTechnician: technician })
    });

    if (res.ok) {
      setMessage(`Maintenance status updated to ${newStatus}!`);
      fetchData();
    } else {
      const data = await res.json();
      setMessage(data.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🛠️ Maintenance Management Workflow</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Raise Maintenance Request Form */}
      <form onSubmit={handleRaiseRequest} style={{ background: '#f9f9f9', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>Raise Maintenance Request</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <select value={assetId} onChange={e => setAssetId(e.target.value)} required style={{ padding: '8px' }}>
            <option value="">Select Asset for Repair</option>
            {assets.map(a => <option key={a.id} value={a.id}>{a.assetTag} - {a.name} ({a.status})</option>)}
          </select>

          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: '8px' }}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>

          <textarea 
            placeholder="Describe the issue in detail..." 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            required 
            style={{ padding: '8px', gridColumn: 'span 2', height: '60px' }} 
          />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '8px 15px', background: '#d9534f', color: 'white', border: 'none', cursor: 'pointer' }}>Submit Request</button>
      </form>

      {/* Maintenance Requests Table & Workflow Actions */}
      <h3>Maintenance Active Pipeline</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Asset</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Technician</th>
            <th>Workflow Actions</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceList.map(m => (
            <tr key={m.id}>
              <td>#{m.id}</td>
              <td>{m.Asset ? `${m.Asset.assetTag} (${m.Asset.name})` : 'N/A'}</td>
              <td>{m.description}</td>
              <td><b>{m.priority}</b></td>
              <td>
                <span style={{ padding: '3px 8px', background: '#fff3cd', borderRadius: '4px' }}>
                  {m.status}
                </span>
              </td>
              <td>{m.assignedTechnician || 'Unassigned'}</td>
              <td>
                {m.status === 'Pending' && (
                  <>
                    <button onClick={() => handleUpdateStatus(m.id, 'Approved')} style={{ marginRight: '5px', background: '#5cb85c', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Approve</button>
                    <button onClick={() => handleUpdateStatus(m.id, 'Rejected')} style={{ background: '#d9534f', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Reject</button>
                  </>
                )}
                {m.status === 'Approved' && (
                  <button onClick={() => {
                    const tech = prompt('Enter technician name:');
                    if (tech) handleUpdateStatus(m.id, 'In Progress', tech);
                  }} style={{ background: '#f0ad4e', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Assign Tech & Start</button>
                )}
                {m.status === 'In Progress' && (
                  <button onClick={() => handleUpdateStatus(m.id, 'Resolved')} style={{ background: '#0275d8', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Mark Resolved</button>
                )}
                {m.status === 'Resolved' && <span>Completed</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}