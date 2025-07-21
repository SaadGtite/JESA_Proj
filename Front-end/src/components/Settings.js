import React, { useState } from 'react';
import './Settings.css';
import { FaUserCircle, FaBell, FaMoon, FaSignOutAlt } from 'react-icons/fa';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="settings-wrapper">
      <div className="settings-card">
        <div className="profile-header">
          <FaUserCircle className="profile-icon" />
          <h2>John Doe</h2>
          <p>john@example.com</p>
        </div>

        <div className="section">
          <h3>Profile</h3>
          <div className="form-group">
            <label>Username</label>
            <input type="text" defaultValue="JohnDoe" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue="john@example.com" />
          </div>
        </div>

        <div className="section">
          <h3>Security</h3>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value="123456" disabled />
          </div>
        </div>

        <div className="section">
          <h3>Preferences</h3>
          <div className="toggle-group">
            <span><FaBell /> Enable Notifications</span>
            <label className="switch">
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="toggle-group">
            <span><FaMoon /> Dark Mode</span>
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="section danger">
          <h3>Danger Zone</h3>
          <button className="logout-btn"><FaSignOutAlt /> Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
