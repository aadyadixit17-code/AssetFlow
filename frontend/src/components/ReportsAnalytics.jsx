import React, { useState, useEffect } from 'react';

export default function ReportsAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [overdue, setOverdue] = useState({ count: 0, overdueAllocations: [] });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/reports/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/reports/overdue-alerts')
      .then(res => res.json())
      .then(data => setOverdue(data))
      .catch(err => console.error(err));

    fetch('http://localhost:5000/api/reports/logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>📈 Reports, Analytics & Notifications</h2>

      {/* Analytics KPI Cards */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', borderLeft: '5px solid #0275d8' }}>
            <h4>Total Assets</h4>
            <h2>{analytics.summary.totalAssets}</h2>
          </div>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', borderLeft: '5px solid #5cb85c' }}>
            <h4>Asset Utilization Rate</h4>
            <h2>{analytics.summary.utilizationRate}</h2>
          </div>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', borderLeft: '5px solid #f0ad4e' }}>
            <h4>Under Maintenance</h4>
            <h2>{analytics.summary.underMaintenance}</h2>
          </div>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', borderLeft: '5px solid #d9534f' }}>
            <h4>Lost Assets</h4>
            <h2>{analytics.summary.lostAssets}</h2>
          </div>
        </div>
      )}

      {/* Overdue Alerts Section */}
      <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '5px', marginBottom: '30px', border: '1px solid #ffeeba' }}>
        <h3>🚨 Overdue Allocations Alert ({overdue.count})</h3>
        {overdue.overdueAllocations.length === 0 ? (
          <p>No overdue assets currently.</p>
        ) : (
          <ul>
            {overdue.overdueAllocations.map(item => (
              <li key={item.id}>
                Asset: <b>{item.Asset ? item.Asset.name : 'N/A'}</b> held by <b>{item.User ? item.User.username : 'N/A'}</b> (Expected return: {item.expectedReturnDate})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Activity Logs Section */}
      <h3>📜 System Activity Logs</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Severity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td><b>{log.action}</b></td>
              <td>{log.severity}</td>
              <td>{log.details || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}