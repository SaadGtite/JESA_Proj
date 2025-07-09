// src/pages/HomePage.jsx
import React from 'react';
import TopBar from '../components/Topbar';
import SideBar from '../components/Sidebar';

function HomePage() {
  return (
    <div className="homepage-container">
      <TopBar />
      <div className="main-content d-flex">
        <SideBar />
      </div>
    </div>
  );
}

export default HomePage;
