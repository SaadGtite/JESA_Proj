import React from 'react';
import logo from '../assets/logo.png'; // 70x70px logo
import './Topbar.css';

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src={logo} alt="Logo" className="topbar-logo" />
      </div>
      <div className="topbar-right">
        <input className="search-input" placeholder="Search projects..." />
        <div className="user-info">
          <span>User exx</span>
          <span>Project Manager</span>
          <button className="btn btn-light">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
