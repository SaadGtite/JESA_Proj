import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa'; 
import logo from '../assets/logo2.png';
import './Topbar.css';


const Topbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/home'); // Navigate to home page
  };

  return (
    <div className="topbar">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" className="topbar-logo" />
        <span className="logo-text">Field Services</span>
      </div>
    </div>
  );
};

export default Topbar;