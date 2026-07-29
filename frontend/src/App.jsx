import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AssetRegistry from './pages/AssetRegistry';
import ResourceBooking from './pages/ResourceBooking';
import MaintenanceManagement from './pages/MaintenanceManagement';
import OrgSetup from './pages/OrgSetup';
import Login from './pages/Login.jsx';   // Explicitly adding .jsx extension
import Signup from './pages/Signup.jsx'; // Explicitly adding .jsx extension

// Route Guard Definition
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Entry Point Gates */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Panels */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><AssetRegistry /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><ResourceBooking /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><MaintenanceManagement /></ProtectedRoute>} />
        <Route path="/organization" element={<ProtectedRoute><OrgSetup /></ProtectedRoute>} />

        {/* Fallback Redirection Handler */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;