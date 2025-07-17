import React, { useState } from 'react';
import './Settings.css';
import { FaUser, FaLock, FaBell, FaMoon, FaSignOutAlt } from 'react-icons/fa';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-section">
        <h3 className="section-title">Profile</h3>
        <div className="settings-item">
          <FaUser className="settings-icon" />
          <div className="item-text">
            <label>Username</label>
            <input type="text" defaultValue="JohnDoe" />
          </div>
        </div>

        <div className="settings-item">
          <FaLock className="settings-icon" />
          <div className="item-text">
            <label>Password</label>
            <input type="password" value="123456" disabled />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Preferences</h3>
        <div className="settings-item toggle">
          <FaBell className="settings-icon" />
          <span>Enable Notifications</span>
          <label className="switch">
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="settings-item toggle">
          <FaMoon className="settings-icon" />
          <span>Dark Mode</span>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h3 className="section-title">Account</h3>
        <div className="settings-item logout">
          <FaSignOutAlt className="settings-icon" />
          <button className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
