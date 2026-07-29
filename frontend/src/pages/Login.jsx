import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });

    if (response.data.token) {
      // ✅ CRITICAL: Save the token and user data to the browser storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Token stored safely!');
      
      // Redirect to the dashboard page
      window.location.href = '/dashboard'; 
    }
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    alert('Invalid credentials, please try again.');
  }
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', textAlign: 'center' }}>🔒 AssetFlow Login</h2>
        <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', textAlign: 'center', fontSize: '0.9rem' }}>Sign in to access your dashboard metrics</p>

        {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '500' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} required />
          </div>

          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}>Sign In</button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', margin: '1.5rem 0 0 0' }}>
          Don't have an admin profile? <Link to="/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}
import axios from 'axios';
export default Login;