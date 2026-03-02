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
    <nav className="glass" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderRadius: '0 0 12px 12px' }}>
      <div
        onClick={() => navigate('/files')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}
      >
        <FileText color="var(--primary)" />
       Document Portal
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <span>Welcome, <strong style={{ color: 'var(--primary)' }}>{user.name}</strong></span>
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
