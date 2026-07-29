import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

function OrgSetup() {
  const [orgName, setOrgName] = useState('');
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');

  const fetchOrgDetails = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/org');
      if (res.ok) {
        const data = await res.json();
        setOrgName(data.orgName);
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error('Error fetching org data profile:', err);
    }
  };

  useEffect(() => {
    fetchOrgDetails();
  }, []);

  const handleUpdateSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgName, departments })
      });
      if (res.ok) alert('Corporate configuration updated successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDept.trim()) return;

    const updatedDepts = [...departments, newDept.trim()];
    try {
      const res = await fetch('http://localhost:5000/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgName, departments: updatedDepts })
      });
      if (res.ok) {
        setDepartments(updatedDepts);
        setNewDept('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: '250px', padding: '2.5rem', boxSizing: 'border-box' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.85rem' }}>🏢 Organization Configuration</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Manage workspace parameters and operational teams.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#1e293b' }}>Company Details</h3>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Organization Identity Name</label>
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Primary Operations Hub Location</label>
              <input type="text" defaultValue="New York HQ, USA" disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} />
            </div>
            <button onClick={handleUpdateSettings} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Update Settings</button>
          </div>

          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#1e293b' }}>Active Business Units</h3>
            <form onSubmit={handleAddDepartment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input type="text" value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="e.g. Legal & Compliance" style={{ flex: 1, padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} required />
              <button type="submit" style={{ padding: '0.6rem 1.2rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Add</button>
            </form>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {departments.map((dept, idx) => (
                <li key={idx} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                    <span>🏢</span>
                    <span>{dept}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#475569', fontWeight: '600', whiteSpace: 'nowrap' }}>Active Sector</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrgSetup;