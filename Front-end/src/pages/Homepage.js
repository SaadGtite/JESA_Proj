import React from 'react';
import TopBar from '../components/Topbar';
import SideBar from '../components/Sidebar';
import '../components/Sidebar.css';
import '../components/Topbar.css';

function HomePage() {
  return (
    <div className="homepage-container">
      <TopBar />
      <SideBar />
    </div>
  );
}

export default HomePage;