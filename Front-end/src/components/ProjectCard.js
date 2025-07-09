import React from 'react';
import './ProjectCard.css'; // Assure-toi d'importer le CSS

const ProjectCard = ({ project }) => {
 const statusColor = {
 "Approved": "success",
 "In Progress": "primary",
 "Pending Review": "warning",
 "Needs Revision": "danger"
 };

 return (
 <div className="project-card">
 <div className={`status-label badge bg-${statusColor[project.status]}`}>
 {project.status}
 </div>

 <h5 className="mb-1">{project.name}</h5>
 <small className="text-muted">Project #: {project.id}</small>
 <p className="mt-2 mb-3">{project.description}</p>

 <div className="d-flex justify-content-between align-items-center">
 <div>
 <strong>{project.manager}</strong><br />
 <small className="text-muted">Review: {project.reviewDate}</small>
 </div>

 <div className="score-section text-center">
 {project.status === "Pending Review" ? (
 <div className="text-warning fw-semibold mb-1">Pending</div>
 ) : (
 <div className={`text-${statusColor[project.status]} fw-semibold mb-1`}>
 {project.score}% Score
 </div>
 )}
 <button className="view-btn btn btn-sm">View Details</button>
 </div>
 </div>
 </div>
 );
};

export default ProjectCard;