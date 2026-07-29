import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

function MaintenanceManagement() {
  // Mock Data for Maintenance Issues
  const [tickets, setTickets] = useState([
    { id: 'MNT-401', assetName: 'Dell XPS Desktop', issue: 'OS boot loop after update', severity: 'High', status: 'In Progress' },
    { id: 'MNT-402', assetName: 'MacBook Pro 16"', issue: 'Battery degradation check', severity: 'Low', status: 'Resolved' },
  ]);

  const [assetName, setAssetName] = useState('MacBook Pro 16"');
  const [issue, setIssue] = useState('');
  const [severity, setSeverity] = useState('Medium');

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!issue) return;

    const newTicket = {
      id: `MNT-${400 + tickets.length + 1}`,
      assetName,
      issue,
      severity,
      status: 'Open'
    };

    setTickets([...tickets, newTicket]);
    setIssue('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: '250px', padding: '2.5rem', boxSizing: 'border-box' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.85rem' }}>🛠️ Maintenance Logs</h1><br></br>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Report system failures and log servicing history.</p>
        </header>

        {/* Ticket Submission Form */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#1e293b' }}>⚠️ Open a Repair Ticket</h3>
          <form onSubmit={handleCreateTicket} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Select Broken Asset</label>
              <select value={assetName} onChange={(e) => setAssetName(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}>
                <option value="MacBook Pro 16">MacBook Pro 16"</option>
                <option value="Conference Room Display">Conference Room Display</option>
                <option value="Dell XPS Desktop">Dell XPS Desktop</option>
              </select>
            </div>

            <div style={{ width: '140px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Severity Level</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div style={{ flex: 2, minWidth: '250px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Describe the Failure Issue</label>
              <input type="text" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. Screen flickering when waking from sleep" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} required />
            </div>

            <button type="submit" style={{ padding: '0.65rem 1.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Log Issue
            </button>
          </form>
        </div>

        {/* Maintenance Tickets Table */}
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Ticket ID</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Asset Name</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Issue Description</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Severity</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#64748b' }}>{ticket.id}</td>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{ticket.assetName}</td>
                  <td style={{ padding: '1rem', color: '#475569' }}>{ticket.issue}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600',
                      backgroundColor: ticket.severity === 'High' ? '#ffebe9' : ticket.severity === 'Medium' ? '#fff3cd' : '#f1f5f9',
                      color: ticket.severity === 'High' ? '#ce1515' : ticket.severity === 'Medium' ? '#856404' : '#475569'
                    }}>
                      {ticket.severity}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                      backgroundColor: ticket.status === 'Resolved' ? '#d1fae5' : ticket.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                      color: ticket.status === 'Resolved' ? '#065f46' : ticket.status === 'In Progress' ? '#1e40af' : '#475569'
                    }}>
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default MaintenanceManagement;