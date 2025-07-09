import React from 'react';
import './ProjInfo.css'; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';
const NewProjectForm = () => {
  const navigate = useNavigate(); // ← Create navigate function

  const handleBack = () => {
    navigate(-1); // ← Go back to the previous page
  };
  const handleNext = () => {
    navigate('/crr-Section1'); // ← Navigate to the CRR questions page
  };
  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title">Create New Project</h2>
        <p className="form-subtitle">Enter the project information to begin the CRR validation process</p>

        <form className="row g-4">
          <div className="col-md-6">
            <label className="form-label">Responsible Office</label>
            <select className="form-select">
              <option>Select Office</option>
            </select>

            <label className="form-label mt-3">Name</label>
            <input type="text" className="form-control" placeholder="Enter project name" />

            <label className="form-label mt-3">Number</label>
            <input type="text" className="form-control" placeholder="Enter project number" />

            <label className="form-label mt-3">Review Date</label>
            <input type="date" className="form-control" />
          </div>

          <div className="col-md-6">
            <label className="form-label">Manager</label>
            <select className="form-select">
              <option>Select Manager</option>
            </select>

            <label className="form-label mt-3">Constructor Manager</label>
            <select className="form-select">
              <option>Select Constructor Manager</option>
            </select>

            <label className="form-label mt-3">Project Scope</label>
            <textarea className="form-control" rows="3" placeholder="Enter project scope details"></textarea>
          </div>

          <div className="form-footer d-flex justify-content-between align-items-center mt-4">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>Back</button>
            <div className="text-muted small">All fields are required to proceed to the CRR questions</div>
            <button type="submit" className="btn btn-primary" onClick={handleNext}>Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectForm;
