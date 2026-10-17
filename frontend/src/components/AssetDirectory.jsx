import React, { useState, useEffect } from 'react';

export default function AssetDirectory() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Form states for asset registration
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const assetRes = await fetch('http://localhost:5000/api/assets');
      setAssets(await assetRes.json());

      const catRes = await fetch('http://localhost:5000/api/categories');
      setCategories(await catRes.json());

      const deptRes = await fetch('http://localhost:5000/api/departments');
      setDepartments(await deptRes.json());
    } catch (err) {
      console.error('Error loading asset data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterAsset = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, categoryId, departmentId, serialNumber, acquisitionCost, location })
    });

    if (res.ok) {
      setName('');
      setSerialNumber('');
      setAcquisitionCost('');
      setLocation('');
      setMessage('Asset registered successfully!');
      fetchData();
    } else {
      const data = await res.json();
      setMessage(data.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📦 Asset Registration & Directory</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Registration Form */}
      <form onSubmit={handleRegisterAsset} style={{ background: '#f9f9f9', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h3>Register New Asset</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input type="text" placeholder="Asset Name" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px' }} />
          <input type="text" placeholder="Serial Number" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} required style={{ padding: '8px' }} />
          
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required style={{ padding: '8px' }}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select value={departmentId} onChange={e => setDepartmentId(e.target.value)} style={{ padding: '8px' }}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          <input type="number" placeholder="Acquisition Cost (₹)" value={acquisitionCost} onChange={e => setAcquisitionCost(e.target.value)} style={{ padding: '8px' }} />
          <input type="text" placeholder="Location (e.g., Room 402)" value={location} onChange={e => setLocation(e.target.value)} style={{ padding: '8px' }} />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Register Asset</button>
      </form>

      {/* Asset List Table */}
      <h3>Asset Directory</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Tag</th>
            <th>Name</th>
            <th>Category</th>
            <th>Serial No.</th>
            <th>Status</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td><b>{asset.assetTag}</b></td>
              <td>{asset.name}</td>
              <td>{asset.AssetCategory ? asset.AssetCategory.name : 'N/A'}</td>
              <td>{asset.serialNumber}</td>
              <td><span style={{ padding: '3px 8px', background: '#e2e3e5', borderRadius: '4px' }}>{asset.status}</span></td>
              <td>{asset.location || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}