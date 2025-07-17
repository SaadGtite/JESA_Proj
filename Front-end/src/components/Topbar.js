import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa'; 
import logo from '../assets/logo2.png';
import './Topbar.css';

const Topbar = () => {
  const navigate = useNavigate();

  // Get username from localStorage (or default to 'User')
  const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/'); // redirect to login page
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="topbar-logo" />
          <span className="logo-text">Field Services</span>
        </div>
      </div>


      <div className="topbar-right">
        <div className="notification-icon">
          <FaBell size={18} />
        </div>
        <div className="user-info">
          <span className="username">{username}</span>
          <FaUserCircle size={24} className="user-icon" />
          <button className="btn btn-light" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
