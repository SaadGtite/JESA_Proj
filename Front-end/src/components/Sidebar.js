import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaProjectDiagram, FaSearch,
  FaChartBar, FaFileAlt, FaUsers, FaCog,
  FaSignOutAlt, FaPlus
} from 'react-icons/fa';
import './Sidebar.css';
import DashboardPage from '../pages/Dashboard';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt /> },
    { name: 'Projects', icon: <FaProjectDiagram /> },
    { name: 'CRR Reviews', icon: <FaSearch /> },
    { name: 'Analytics', icon: <FaChartBar /> },
    { name: 'Reports', icon: <FaFileAlt /> },
    { name: 'Team', icon: <FaUsers /> },
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

  // Add your onNewProjectClick handler here:
  const handleNewProjectClick = () => {
    // For example, navigate to a New Project page or show a modal
    navigate('/new-project');
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Projects':
        return <div className="content "><h2>Projects</h2><p>Manage your projects here.</p></div>;
      case 'CRR Reviews':
        return <div className="content"><h2>CRR Reviews</h2><p>View and manage CRR reviews.</p></div>;
      case 'Analytics':
        return <div className="content"><h2>Analytics</h2><p>Analyze your data.</p></div>;
      case 'Reports':
        return <div className="content"><h2>Reports</h2><p>Generate and view reports.</p></div>;
      case 'Team':
        return <div className="content"><h2>Team</h2><p>Manage your team members.</p></div>;
      case 'Settings':
        return <div className="content"><h2>Settings</h2><p>Configure your settings.</p></div>;
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
            onClick={handleNewProjectClick} // <--- Added here
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
