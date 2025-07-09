import React from 'react';
import logo from '../assets/logo.png'; // logo principal
import './Topbar.css';
import { FaBell } from 'react-icons/fa'; // Icône notification (npm install react-icons si besoin)
const avatar = 'https://i.pravatar.cc/40';
const Topbar = () => {
 return (
 <div className="topbar">
 <div className="topbar-left">
 <img src={logo} alt="Logo" className="topbar-logo" />
 </div>

 <div className="topbar-right">
 <div className="notification-icon">
 <FaBell size={18} />
 </div>
 <div className="user-info">
 <span className="username">User exx</span>
 <img src={avatar} alt="User Avatar" className="user-avatar" />
 <button className="btn btn-light">Logout</button>
 </div>
 </div>
 </div>
 );
};

export default Topbar;