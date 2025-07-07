import React from 'react';

const ProjectCard = ({ project }) => {
  const statusColor = {
    "Approved": "success",
    "In Progress": "primary",
    "Pending Review": "warning",
    "Needs Revision": "danger"
  };

  return (
    <div className="project-card border p-3">
      <div className={`status-label text-${statusColor[project.status]}`}>
        {project.status}
      </div>
      <h5>{project.name}</h5>
      <small>Project #: {project.id}</small>
      <p>{project.description}</p>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <span>{project.manager}</span><br />
          <span>Review: {project.reviewDate}</span>
        </div>
        <div className="text-end">
          {project.status === "Pending Review" ? (
            <span className="text-warning">Pending</span>
          ) : (
            <span className={`text-${statusColor[project.status]}`}>{project.score}% Score</span>
          )}
          <br />
          <button className="btn btn-primary btn-sm mt-1">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
