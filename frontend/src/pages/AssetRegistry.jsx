import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

function AssetRegistry() {
  const [assets, setAssets] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [location, setLocation] = useState('');

  // Fetch from Express API Backend
  const fetchAssets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/assets');
      const data = await res.json();
      if (data && data.length > 0) {
        setAssets(data.map(item => ({
          id: item.assetId,
          name: item.name,
          category: item.category,
          status: item.status,
          location: item.location
        })));
      } else {
        // Fallback placeholder data if database collection has no documents yet
        setAssets([
          { id: 'AST-001', name: 'MacBook Pro 16"', category: 'Hardware', status: 'Allocated', location: 'HQ - Floor 3' },
          { id: 'AST-002', name: 'Conference Room Display', category: 'AV Equipment', status: 'Available', location: 'Room 402' },
          { id: 'AST-003', name: 'Dell XPS Desktop', category: 'Hardware', status: 'Maintenance', location: 'Lab 1' },
        ]);
      }
    } catch (err) {
      console.error('Error contacting backend API:', err);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleAddAsset = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), category, location: location.trim() })
      });

      if (response.ok) {
        setName('');
        setLocation('');
        fetchAssets(); // Refresh from DB
      }
    } catch (err) {
      console.error('Failed to submit asset entry:', err);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: '250px', padding: '2.5rem', boxSizing: 'border-box' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.85rem' }}>📋 Corporate Asset Registry</h1><br></br>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Register and track hardware equipment units dynamically.</p>
        </header>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#1e293b' }}>➕ Register New Asset Unit</h3>
          <form onSubmit={handleAddAsset} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Asset Item Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Logitech MX Master 3S" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ width: '180px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', boxSizing: 'border-box' }}>
                <option value="Hardware">Hardware</option>
                <option value="AV Equipment">AV Equipment</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Site Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Boston Office - Rm 12" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
            </div>
            <button type="submit" style={{ padding: '0.65rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', height: '38px' }}>Add Item</button>
          </form>
        </div>

        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Asset Name</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Deployment Status</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, i) => (
                <tr key={asset.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#64748b' }}>{asset.id}</td>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{asset.name}</td>
                  <td style={{ padding: '1rem', color: '#475569' }}><span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem' }}>{asset.category}</span></td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                      backgroundColor: asset.status === 'Available' ? '#d1fae5' : asset.status === 'Allocated' ? '#dbeafe' : '#fef3c7',
                      color: asset.status === 'Available' ? '#065f46' : asset.status === 'Allocated' ? '#1e40af' : '#92400e'
                    }}>
                      {asset.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{asset.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AssetRegistry;