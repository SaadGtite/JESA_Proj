import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa'; 
import logo from '../assets/logo2.png';
import './Topbar.css';

const Topbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const userRole = localStorage.getItem('role') || 'Unknown Role';
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="topbar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="topbar-logo" />
      </div>
      <div className="topbar-icons" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="notification-icon" style={{ cursor: 'pointer' }} onClick={() => alert('Notifications clicked')}>
          <FaBell size={18} />
        </div>
        <div className="user-info" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={toggleProfileDropdown}>
          <FaUserCircle size={20} />
          <div className="user-details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
            <span className="username" style={{ fontWeight: 'bold' }}>{username}</span>
            <span className="user-role" style={{ marginTop: '2px', fontSize: '0.95em', color: '#f9f9f9' }}>{userRole}</span>
          </div>
          {isProfileOpen && (
            <div className="profile-dropdown" style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'rgb(76, 117, 179)',
              color: '#fff',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              minWidth: '150px',
              zIndex: 1000,
              padding: '10px',
              marginTop: '5px'
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <span style={{ fontWeight: 'bold' }}>{username}</span>
                <div style={{ fontSize: '0.9em', color: '#f9f9f9' }}>{userRole}</div>
              </div>
              <div 
                style={{ 
                  padding: '8px 12px', 
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.1)' }
                }} 
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;