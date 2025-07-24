import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa'; 
import logo from '../assets/logo2.png';
import './Topbar.css';

const Topbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';
  const userRole = localStorage.getItem('role') || 'Unknown Role';

  return (
    <div className="topbar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="topbar-logo" />
      </div>
      <div className="topbar-icons" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div className="notification-icon" style={{ cursor: 'pointer' }} onClick={() => alert('Notifications clicked')}>
          <FaBell size={18} />
        </div>
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => alert('User profile clicked')}>
          <FaUserCircle size={20} />
          <div className="user-details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
            <span className="username" style={{ fontWeight: 'bold' }}>{username}</span>
            <span className="user-role" style={{ marginTop: '2px', fontSize: '0.95em', color: '#f9f9f9' }}>{userRole}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;