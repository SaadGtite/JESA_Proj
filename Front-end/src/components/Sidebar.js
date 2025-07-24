// Sidebar.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaProjectDiagram, FaCog, FaSignOutAlt, FaPlus, FaBell, FaUserCircle
} from 'react-icons/fa';
import './Sidebar.css';
import DashboardPage from '../pages/Dashboard';
import Projects from './Projects';
import Settings from './Settings';

const Sidebar = () => {
  const location = useLocation();
  const initialActiveItem = location.pathname === '/home/projects' ? 'Projects' : 'Dashboard';
  const [activeItem, setActiveItem] = useState(initialActiveItem);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/home' },
    { name: 'Projects', icon: <FaProjectDiagram />, path: '/home/projects' },
    { name: 'Settings', icon: <FaCog />, path: '/home/settings' },
    { name: 'Logout', icon: <FaSignOutAlt />, path: '/' },
  ];

  const handleItemClick = (itemName, path) => {
    if (itemName === 'Logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      navigate('/');
    } else {
      setActiveItem(itemName);
      navigate(path);
    }
  };

  const handleNewProjectClick = () => {
    navigate('/new-project');
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Projects':
        return <Projects />;
      case 'Settings':
        return <Settings />;
      default:
        return <div className="content"><h2>Welcome</h2><p>Select an option from the sidebar.</p></div>;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={activeItem === item.name ? 'active' : ''}
              onClick={() => handleItemClick(item.name, item.path)}
            >
              {item.icon} <span>{item.name}</span>
            </li>
          ))}
        </ul>
        <div className="new-project-container">
          <button
            className="new-project-btn"
            onClick={handleNewProjectClick}
          >
            <FaPlus className="new-project-icon" />
            <span className="new-project-text">New Project</span>
          </button>
        </div>
        <div className="sidebar-icons">
          <div className="notification-icon" onClick={() => alert('Notifications clicked')}>
            <FaBell size={18} />
          </div>
          <div className="user-info" onClick={() => alert('User profile clicked')}>
            <FaUserCircle size={24} />
            <span className="username">{localStorage.getItem('username') || 'User'}</span>
          </div>
          
        </div>
      </div>
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default Sidebar;