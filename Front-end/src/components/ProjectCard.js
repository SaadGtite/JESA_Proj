import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  // If no project prop is passed, render nothing or fallback
  if (!project) return <div className="project-card">No project data</div>;

  const statusColors = {
    "Approved": "#28a745",
    "In Progress": "#007bff",
    "Pending Review": "#ffc107",
    "Needs Revision": "#dc3545"
  };

  const {
    status = "Unknown",
    name = "Unnamed Project",
    id = "N/A",
    description = "No description provided",
    manager = "Unknown Manager",
    reviewDate = "N/A",
    score = null
  } = project;

  return (
    <div className="project-card">
      <div className="project-card-header">
        <span
          className="project-status"
          style={{ backgroundColor: statusColors[status] || "#6c757d" }}
        >
          {status}
        </span>
      </div>

      <div className="project-card-body">
        <h5 className="project-name">{name}</h5>
        <p className="project-id">Project ID: {id}</p>
        <p className="project-description">{description}</p>

        <div className="project-footer">
          <div className="project-manager">
            <strong>{manager}</strong>
            <br />
            <small>Review: {reviewDate}</small>
          </div>

          <div className="project-score">
            {score != null ? (
              <span className="score">{score}% Score</span>
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
