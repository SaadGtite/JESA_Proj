import React, { useState, useRef } from 'react';
import './ProjInfo.css';
import { useNavigate } from 'react-router-dom';

const NewProjectForm = () => {
  const navigate = useNavigate();
  const [reviewTeam, setReviewTeam] = useState([]);
  const [interviewTeam, setInterviewTeam] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState(null);

  const reviewNameRef = useRef(null);
  const reviewRoleRef = useRef(null);
  const interviewNameRef = useRef(null);
  const interviewRoleRef = useRef(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = (e) => {
    e.preventDefault();
    const responsibleOffice = e.target.querySelector('div.col-md-6 input:nth-child(2)').value;
    const projectName = e.target.querySelector('div.col-md-6 input:nth-child(4)').value;
    const projectNumber = e.target.querySelector('div.col-md-6 input:nth-child(6)').value;
    const reviewDate = e.target.querySelector('div.col-md-6 input:nth-child(8)').value;
    const manager = e.target.querySelector('div.col-md-6:nth-child(2) input:nth-child(2)').value;
    const constructorManager = e.target.querySelector('div.col-md-6:nth-child(2) input:nth-child(4)').value;
    const projectScope = e.target.querySelector('div.col-md-6:nth-child(2) textarea').value;

    if (!responsibleOffice || !projectName || !projectNumber || !reviewDate || !manager || !constructorManager || !projectScope) {
      alert('All fields except team members are required to proceed to the CRR questions.');
      return;
    }
    navigate('/crr-Section1');
  };

  const addOrUpdateMember = (type, name, role) => {
    if (editType === type && editIndex !== null) {
      if (type === 'review') {
        const updatedTeam = [...reviewTeam];
        updatedTeam[editIndex] = { name, role };
        setReviewTeam(updatedTeam);
      } else if (type === 'interview') {
        const updatedTeam = [...interviewTeam];
        updatedTeam[editIndex] = { name, role };
        setInterviewTeam(updatedTeam);
      }
      setEditIndex(null);
      setEditType(null);
    } else if (name && role) {
      if (type === 'review') {
        setReviewTeam([...reviewTeam, { name, role }]);
      } else if (type === 'interview') {
        setInterviewTeam([...interviewTeam, { name, role }]);
      }
    }
    if (type === 'review') {
      reviewNameRef.current.value = '';
      reviewRoleRef.current.value = '';
    } else if (type === 'interview') {
      interviewNameRef.current.value = '';
      interviewRoleRef.current.value = '';
    }
  };

  const startEdit = (type, index) => {
    setEditType(type);
    setEditIndex(index);
    if (type === 'review') {
      reviewNameRef.current.value = reviewTeam[index].name;
      reviewRoleRef.current.value = reviewTeam[index].role;
    } else if (type === 'interview') {
      interviewNameRef.current.value = interviewTeam[index].name;
      interviewRoleRef.current.value = interviewTeam[index].role;
    }
  };

  const deleteMember = (type, index) => {
    if (type === 'review') {
      const updatedTeam = reviewTeam.filter((_, i) => i !== index);
      setReviewTeam(updatedTeam);
    } else if (type === 'interview') {
      const updatedTeam = interviewTeam.filter((_, i) => i !== index);
      setInterviewTeam(updatedTeam);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title">Create New Project</h2>
        <p className="form-subtitle">Enter the project information to begin the CRR validation process</p>

        <form className="row g-4" onSubmit={handleNext}>
          <div className="col-md-6">
            <label className="form-label">Responsible Office <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter responsible office" required />

            <label className="form-label mt-3">Name <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter project name" required />

            <label className="form-label mt-3">Number <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter project number" required />

            <label className="form-label mt-3">Review Date <span className="text-danger">*</span></label>
            <input type="date" className="form-control" required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Manager <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter Manager name" required />

            <label className="form-label mt-3">Constructor Manager <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter Constructor Manager name" required />

            <label className="form-label mt-3">Project Scope <span className="text-danger">*</span></label>
            <textarea className="form-control" rows="3" placeholder="Enter project scope details" required></textarea>
          </div>

          {/* Review Team Member Section */}
          <div className="col-md-6 mt-4">
            <label className="form-label">Review team member</label>
            <div className="input-group mb-3 team-input-group">
              <input type="text" className="form-control" placeholder="Name" ref={reviewNameRef} />
              <select className="form-select" defaultValue="" ref={reviewRoleRef}>
                <option value="" disabled>Select Role</option>
                <option>CM</option>
                <option>PM</option>
                <option>SM</option>
                <option>PC</option>
                <option>HSE</option>
                <option>QA/QC</option>
                <option>Other</option>
              </select>
              <button type="button" className="btn btn-primary" onClick={() => {
                addOrUpdateMember('review', reviewNameRef.current.value, reviewRoleRef.current.value);
              }}>
                {editType === 'review' && editIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
            <ul className="list-group">
              {reviewTeam.map((member, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {member.name} - {member.role}
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm btn-warning mx-2"
                      onClick={() => startEdit('review', index)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteMember('review', index)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Team Member Interviewed Section */}
          <div className="col-md-6 mt-4">
            <label className="form-label">Project team member interviewed</label>
            <div className="input-group mb-3 team-input-group">
              <input type="text" className="form-control" placeholder="Name" ref={interviewNameRef} />
              <select className="form-select" defaultValue="" ref={interviewRoleRef}>
                <option value="" disabled>Select Role</option>
                <option>CM</option>
                <option>PM</option>
                <option>SM</option>
                <option>PC</option>
                <option>HSE</option>
                <option>QA/QC</option>
                <option>Other</option>
              </select>
              <button type="button" className="btn btn-primary" onClick={() => {
                addOrUpdateMember('interview', interviewNameRef.current.value, interviewRoleRef.current.value);
              }}>
                {editType === 'interview' && editIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
            <ul className="list-group">
              {interviewTeam.map((member, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {member.name} - {member.role}
                  <div>
                    <button
                      type="button"
                      className="btn btn-sm btn-warning mx-2"
                      onClick={() => startEdit('interview', index)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteMember('interview', index)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="form-footer d-flex justify-content-between align-items-center mt-4">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>Back</button>
            <div className="text-muted small">All fields except team members are required to proceed to the CRR questions</div>
            <button type="submit" className="btn btn-primary">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectForm;