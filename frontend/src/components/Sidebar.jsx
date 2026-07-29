import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: '📊 Dashboard', path: '/dashboard' },
    { name: '🏢 Org Setup', path: '/org-setup' },
    { name: '📋 Asset Registry', path: '/assets' },
    { name: '📅 Bookings', path: '/bookings' },
    { name: '🛠️ Maintenance', path: '/maintenance' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div style={{ 
      width: '250px', 
      height: '100vh', 
      background: '#1e293b', 
      color: '#fff', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      padding: '1.5rem 1rem', 
      boxSizing: 'border-box',
      zIndex: 1000
    }}>
      <div>
        <h3 style={{ margin: '0 0 2rem 0', textAlign: 'center', color: '#38bdf8', letterSpacing: '1px' }}>⚙️ AssetFlow</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li 
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#3b82f6' : 'transparent',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
      
      <button 
        onClick={handleLogout}
        style={{ 
          width: '100%', 
          padding: '0.75rem', 
          backgroundColor: '#ef4444', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '6px', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          marginTop: 'auto'
        }}
      >
        🚪 Log Out
      </button>
    </div>
  );
}

export default Sidebar;