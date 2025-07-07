import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const statusColors = {
    "Approved": "#28a745",
    "In Progress": "#007bff",
    "Pending Review": "#ffc107",
    "Needs Revision": "#dc3545"
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <span
          className="project-status"
          style={{ backgroundColor: statusColors[project.status] }}
        >
          {project.status}
        </span>
      </div>

      <div className="project-card-body">
        <h5 className="project-name">{project.name}</h5>
        <p className="project-id">Project ID: {project.id}</p>
        <p className="project-description">{project.description}</p>

        <div className="project-footer">
          <div className="project-manager">
            <strong>{project.manager}</strong>
            <br />
            <small>Review: {project.reviewDate}</small>
          </div>

          <div className="project-score">
            {project.score != null ? (
              <span className="score">{project.score}% Score</span>
            ) : (
              <span className="pending">Pending</span>
            )}
            <button className="details-button">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
