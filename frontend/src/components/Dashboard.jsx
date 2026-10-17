import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/summary')
      .then(res => res.json())
      .then(data => setKpis(data))
      .catch(err => console.error(err));
  }, []);

  if (!kpis) return <p>Loading dashboard KPIs...</p>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h2>📊 AssetFlow Executive Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #0275d8', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4>Total Assets</h4>
          <h1>{kpis.totalAssets}</h1>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #5cb85c', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4>Available Assets</h4>
          <h1>{kpis.availableAssets}</h1>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #f0ad4e', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4>Allocated Assets</h4>
          <h1>{kpis.allocatedAssets}</h1>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #d9534f', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4>Under Maintenance</h4>
          <h1>{kpis.maintenanceToday}</h1>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #5bc0de', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4>Active Bookings</h4>
          <h1>{kpis.activeBookings}</h1>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #f0ad4e', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4>Pending Maintenance Requests</h4>
          <h1>{kpis.pendingMaintenance}</h1>
        </div>
      </div>
    </div>
  );
}