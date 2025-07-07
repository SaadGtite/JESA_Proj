import React from 'react';
import {
  FaTachometerAlt, FaProjectDiagram, FaSearch,
  FaChartBar, FaFileAlt, FaUsers, FaCog,
  FaSignOutAlt, FaPlus
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li><FaTachometerAlt /> <span>Dashboard</span></li>
        <li><FaProjectDiagram /> <span>Projects</span></li>
        <li><FaSearch /> <span>CRR Reviews</span></li>
        <li><FaChartBar /> <span>Analytics</span></li>
        <li><FaFileAlt /> <span>Reports</span></li>
        <li><FaUsers /> <span>Team</span></li>
        <li><FaCog /> <span>Settings</span></li>
        <li><FaSignOutAlt /> <span>Logout</span></li>
      </ul>
      <div className="new-project-container">
        <button className="new-project-btn">
          <FaPlus className="new-project-icon" />
          <span className="new-project-text">New Project</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
