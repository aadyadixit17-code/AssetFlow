import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

function ResourceBooking() {
  const [bookings, setBookings] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]); // Dynamic Asset List
  const [asset, setAsset] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Fetch Bookings and Assets from API Backend
  const fetchData = async () => {
    try {
      // 1. Fetch Bookings
      const bookingsRes = await fetch('http://localhost:5000/api/bookings');
      const bookingsData = await bookingsRes.json();
      if (bookingsData && bookingsData.length > 0) {
        setBookings(bookingsData.map(b => ({
          id: b.bookingId,
          assetName: b.assetName,
          bookedBy: b.bookedBy,
          date: b.date,
          time: b.time,
          status: b.status
        })));
      }

      // 2. Fetch Assets for the dropdown menu
      const assetsRes = await fetch('http://localhost:5000/api/assets');
      const assetsData = await assetsRes.json();
      if (assetsData && assetsData.length > 0) {
        setAvailableAssets(assetsData);
        setAsset(assetsData[0].name); // Default selection to first active item
      } else {
        // Fallback placeholders if DB is empty
        setAvailableAssets([
          { name: 'Conference Room Display' },
          { name: 'MacBook Pro 16"' },
          { name: 'Dell XPS Desktop' }
        ]);
        setAsset('Conference Room Display');
      }
    } catch (err) {
      console.error('Error fetching data from API:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!asset || !date || !time.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetName: asset, date, time: time.trim() })
      });

      if (response.ok) {
        setDate('');
        setTime('');
        fetchData(); // Refresh list from DB
      }
    } catch (err) {
      console.error('Failed to register booking:', err);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: '250px', padding: '2.5rem', boxSizing: 'border-box' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.85rem' }}>📅 Resource Bookings</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Schedule and manage live asset reservations.</p>
        </header>

        {/* Booking Creation Form */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '2.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', color: '#1e293b' }}>🕒 Reserve an Asset</h3>
          <form onSubmit={handleBookingSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Select Asset</label>
              <select value={asset} onChange={(e) => setAsset(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', boxSizing: 'border-box' }}>
                {availableAssets.map((item, idx) => (
                  <option key={idx} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>

            <div style={{ width: '160px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
            </div>

            <div style={{ width: '180px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Time Block</label>
              <input type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 2:00 PM - 4:00 PM" style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
            </div>

            <button type="submit" style={{ padding: '0.65rem 1.5rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', height: '38px' }}>
              Confirm Booking
            </button>
          </form>
        </div>

        {/* Active Bookings List Table */}
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Ref ID</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Asset</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Reserved By</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Schedule</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => (
                <tr key={booking.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#64748b' }}>{booking.id}</td>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{booking.assetName}</td>
                  <td style={{ padding: '1rem', color: '#475569' }}>{booking.bookedBy}</td>
                  <td style={{ padding: '1rem', color: '#475569' }}>{booking.date} | {booking.time}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                      backgroundColor: booking.status === 'Approved' ? '#d1fae5' : '#fef3c7',
                      color: booking.status === 'Approved' ? '#065f46' : '#92400e'
                    }}>
                      {booking.status}
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

export default ResourceBooking;