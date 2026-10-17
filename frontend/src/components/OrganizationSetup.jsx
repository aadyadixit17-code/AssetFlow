import React, { useState, useEffect } from 'react';

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [deptName, setDeptName] = useState('');
  const [catName, setCatName] = useState('');
  const [customFields, setCustomFields] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const deptRes = await fetch('http://localhost:5000/api/departments');
      setDepartments(await deptRes.json());

      const catRes = await fetch('http://localhost:5000/api/categories');
      setCategories(await catRes.json());

      const empRes = await fetch('http://localhost:5000/api/employees');
      setEmployees(await empRes.json());
    } catch (err) {
      console.error('Error fetching master data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: deptName })
    });
    if (res.ok) {
      setDeptName('');
      setMessage('Department created successfully!');
      fetchData();
    } else {
      const data = await res.json();
      setMessage(data.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: catName, customFields })
    });
    if (res.ok) {
      setCatName('');
      setCustomFields('');
      setMessage('Category created successfully!');
      fetchData();
    } else {
      const data = await res.json();
      setMessage(data.message);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h2>🏢 Organization Setup (Admin Console)</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('departments')} style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer' }}>Departments</button>
        <button onClick={() => setActiveTab('categories')} style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer' }}>Asset Categories</button>
        <button onClick={() => setActiveTab('employees')} style={{ padding: '8px 15px', cursor: 'pointer' }}>Employee Directory</button>
      </div>

      {activeTab === 'departments' && (
        <div>
          <h3>Department Management</h3>
          <form onSubmit={handleCreateDepartment} style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="New Department Name" 
              value={deptName} 
              onChange={(e) => setDeptName(e.target.value)} 
              required
              style={{ padding: '8px', marginRight: '10px', width: '250px' }}
            />
            <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Add Department</button>
          </form>
          <ul>
            {departments.map(d => <li key={d.id}>{d.name} ({d.status})</li>)}
          </ul>
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          <h3>Asset Category Management</h3>
          <form onSubmit={handleCreateCategory} style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Category Name (e.g., Electronics)" 
              value={catName} 
              onChange={(e) => setCatName(e.target.value)} 
              required
              style={{ padding: '8px', marginRight: '10px', width: '220px' }}
            />
            <input 
              type="text" 
              placeholder="Custom Fields (e.g., Warranty)" 
              value={customFields} 
              onChange={(e) => setCustomFields(e.target.value)} 
              style={{ padding: '8px', marginRight: '10px', width: '220px' }}
            />
            <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Add Category</button>
          </form>
          <ul>
            {categories.map(c => <li key={c.id}><b>{c.name}</b> {c.customFields ? `[Fields: ${c.customFields}]` : ''}</li>)}
          </ul>
        </div>
      )}

      {activeTab === 'employees' && (
        <div>
          <h3>Employee Directory</h3>
          <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th>Username</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.username}</td>
                  <td>{emp.email}</td>
                  <td>{emp.Department ? emp.Department.name : 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}