import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginSignup({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          if (onLoginSuccess) onLoginSuccess(data.user);
          navigate('/', { replace: true });
        } else {
          setMessage('Registration successful! Please login.');
          setIsSuccess(true);
          setIsLogin(true);
          setUsername('');
          setPassword('');
        }
      } else {
        setMessage(data.message || 'Authentication failed.');
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage('Network error occurred.');
      setIsSuccess(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Neon Glass Card Container */}
      <div className="neon-card" style={{ width: '100%', maxWidth: '420px', marginBottom: 0 }}>
        <div className="neon-card-inner" style={{ padding: '35px 30px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', margin: '0 0 6px 0', color: '#f472b6' }}>
              {isLogin ? '🔑 AssetFlow Login' : '📝 Create Account'}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#fbcfe8', opacity: 0.8 }}>
              {isLogin ? 'Enter your credentials to access the workspace' : 'Register a new admin profile for AssetFlow'}
            </p>
          </div>

          {/* Status Message */}
          {message && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: '600',
              textAlign: 'center',
              backgroundColor: isSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isSuccess ? '#4ade80' : '#f87171',
              border: `1px solid ${isSuccess ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
            }}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {!isLogin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: '#fbcfe8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. aadya1"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: '#fbcfe8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="aadya@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: '#fbcfe8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '10px',
                padding: '12px',
                fontSize: '15px'
              }}
            >
              {isLogin ? 'Sign In' : 'Register Account'}
            </button>
          </form>

          {/* Toggle View */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
              }}
              style={{
                color: '#f472b6',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}