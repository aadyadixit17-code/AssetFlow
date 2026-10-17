import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import Dashboard from './pages/Dashboard';
import OrgSetup from './pages/OrgSetup';
import AssetRegistry from './pages/AssetRegistry';
import ResourceBooking from './pages/ResourceBooking';
import MaintenanceManagement from './pages/MaintenanceManagement';
import Sidebar from './components/Sidebar'; // Import your central Sidebar component

// Protected Layout Route with Outlet
const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar rendered exactly once here */}
      <Sidebar />
      {/* Main content container for nested pages */}
      <div style={{ flex: 1, padding: '30px', background: '#f8fafc', overflowY: 'auto' }}>
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
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginSignup onLoginSuccess={setUser} />} />
        <Route path="/signup" element={<LoginSignup onLoginSuccess={setUser} />} />

        {/* Protected Routes nested inside the layout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/organization" element={<OrgSetup />} />
          <Route path="/assets" element={<AssetRegistry />} />
          <Route path="/bookings" element={<ResourceBooking />} />
          <Route path="/maintenance" element={<MaintenanceManagement />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}