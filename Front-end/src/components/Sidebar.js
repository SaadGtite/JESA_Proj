import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaProjectDiagram, FaCog, FaSignOutAlt, FaPlus
} from 'react-icons/fa';
import './Sidebar.css';
import DashboardPage from '../pages/Dashboard';
import Projects from './Projects';
import Settings from './Settings';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt /> },
    { name: 'Projects', icon: <FaProjectDiagram /> },
    { name: 'Settings', icon: <FaCog /> },
    { name: 'Logout', icon: <FaSignOutAlt /> },
  ];

  const handleItemClick = (itemName) => {
    if (itemName === 'Logout') {
      navigate('/');
    } else {
      setActiveItem(itemName);
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
              onClick={() => handleItemClick(item.name)}
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
      </div>
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default Sidebar;