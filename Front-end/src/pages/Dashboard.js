import React from 'react';
import ProjectCard from '../components/ProjectCard';

const projects = [
  {
    name: 'Project 1',
    id: 'HWY-2023-101',
    description: 'Expansion of Highway 101...',
    manager: 'Sarah Johnson',
    reviewDate: 'Oct 15, 2023',
    score: 85,
    status: 'In Progress',
  },
  {
    name: 'Project 2',
    id: 'BRG-2023-042',
    description: 'Structural renovation of Central Bridge...',
    manager: 'Michael Chen',
    reviewDate: 'Nov 3, 2023',
    score: null,
    status: 'Pending Review',
  },
  {
    name: 'Project 3',
    id: 'TRN-2023-078',
    description: 'New multi-modal transit hub...',
    manager: 'Emily Rodriguez',
    reviewDate: 'Sep 22, 2023',
    score: 92,
    status: 'Approved',
  },
  // Add more...
];

const Dashboard = () => {
  return (
    <div className="dashboard p-4">
      <h3>Projects Dashboard</h3>
      <p>Manage and monitor your CRR validation projects</p>
      <input type="text" className="form-control my-3" placeholder="Search projects..." />
      <div className="project-grid">
        {projects.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
