import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  const [counts, setCounts] = useState({
    totalAssets: 0,
    activeBookings: 0,
    pendingMaintenance: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard/summary');
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchSummary();
  }, []);

  const stats = [
    { title: 'Total Registered Assets', count: counts.totalAssets, color: '#3b82f6' },
    { title: 'Active Live Bookings', count: counts.activeBookings, color: '#10b981' },
    { title: 'Pending Maintenance', count: counts.pendingMaintenance, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: '250px', padding: '2.5rem', boxSizing: 'border-box' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.85rem', fontWeight: '700' }}>📊 Operations Dashboard</h1><br></br>
          <p style={{ color: '#64748b', margin: '0.35rem 0 0 0', fontSize: '0.95rem' }}>Real-time corporate resource utilization metrics synced with your database.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: '6px solid ' + stat.color }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>{stat.title}</h4>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>{stat.count}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', color: '#0f172a', fontSize: '1.2rem' }}>⚡ System Overview</h3>
          <p style={{ color: '#475569', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
            Welcome back! Use the side navigation menu options to manage physical asset distribution lines, allocate conference space schedules, or view internal hardware repair ticketing tasks.
          </p>
        </div>
      </div>
    </div>
  );
}
export default Dashboard; 