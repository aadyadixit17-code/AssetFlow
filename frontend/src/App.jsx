import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import Dashboard from './pages/Dashboard';
import OrgSetup from './pages/OrgSetup';
import AssetRegistry from './pages/AssetRegistry';
import ResourceBooking from './pages/ResourceBooking';
import MaintenanceManagement from './pages/MaintenanceManagement';
import Sidebar from './components/Sidebar';

const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      {/* Content Area - Transparent background to reveal the dark red wave image */}
      <div style={{ flex: 1, padding: '30px', marginLeft: '250px', overflowY: 'auto', background: 'transparent' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginSignup onLoginSuccess={setUser} />} />
        <Route path="/signup" element={<LoginSignup onLoginSuccess={setUser} />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/organization" element={<OrgSetup />} />
          <Route path="/assets" element={<AssetRegistry />} />
          <Route path="/bookings" element={<ResourceBooking />} />
          <Route path="/maintenance" element={<MaintenanceManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}