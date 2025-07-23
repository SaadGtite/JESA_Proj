import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa'; 
import logo from '../assets/logo2.png';
import './Topbar.css';


const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="logo-container" >
        <img src={logo} alt="Logo" className="topbar-logo" />
      </div>
    </div>
  );
};

export default Topbar;