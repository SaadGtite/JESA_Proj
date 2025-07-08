// src/pages/HomePage.jsx
import React from 'react';
import TopBar from '../components/Topbar';
import SideBar from '../components/Sidebar';
import ProjectCards from '../components/ProjectCard';

function HomePage() {
  return (
    <div className="homepage-container">
      <TopBar />
      <div className="main-content d-flex">
        <SideBar />
        <div className="content-area flex-grow-1 p-4">
          <ProjectCards />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
