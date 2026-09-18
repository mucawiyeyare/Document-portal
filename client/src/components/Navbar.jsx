import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, FileText, LogIn, Upload } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/files');
  };

  return (
    <nav className="glass nav-bar">
      <div
        onClick={() => navigate('/files')}
        className="nav-brand"
      >
        <FileText color="var(--primary)" size={24} />
        <span>Document Portal</span>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/upload')}
                className="btn"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
              >
                <Upload size={16} /> Upload
              </button>
            )}
            <span style={{ fontSize: '0.9rem' }}>Welcome, <strong style={{ color: 'var(--primary)' }}>{user.name}</strong></span>
            <button onClick={handleLogout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          >
            <LogIn size={16} /> Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
