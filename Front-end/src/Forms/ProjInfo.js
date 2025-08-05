import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProjInfo.css'; // Your CSS file

const NewProjectForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [reviewTeam, setReviewTeam] = useState([]);
  const [interviewTeam, setInterviewTeam] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState(null);

  const responsibleOfficeRef = useRef(null);
  const { id } = useParams(); 
  const projectNameRef = useRef(null);
  const projectNumberRef = useRef(null);
  const reviewDateRef = useRef(null);
  const managerRef = useRef(null);
  const constructorManagerRef = useRef(null);
  const projectScopeRef = useRef(null);
  const locationRef = useRef(null); // Ref for location dropdown
  const pictureRef = useRef(null); // Ref for file input
  const sectorManagerRef = useRef(null); // Ref for sectorManager
  const reviewNameRef = useRef(null);
  const reviewRoleRef = useRef(null);
  const interviewNameRef = useRef(null);
  const interviewRoleRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
          if (responsibleOfficeRef.current) responsibleOfficeRef.current.value = data['responsible office'] || '';
          if (projectNameRef.current) projectNameRef.current.value = data['name project'] || '';
          if (projectNumberRef.current) projectNumberRef.current.value = data['number project'] || '';
          if (reviewDateRef.current) reviewDateRef.current.value = data['review date']?.slice(0, 10) || '';
          if (managerRef.current) managerRef.current.value = data.manager || '';
          if (constructorManagerRef.current) constructorManagerRef.current.value = data['manager constructor'] || '';
          if (projectScopeRef.current) projectScopeRef.current.value = data['project scope'] || '';
          if (locationRef.current) locationRef.current.value = data['location'] || ''; // Pre-fill location
          if (pictureRef.current) pictureRef.current.value = data['picture'] || ''; // Pre-fill picture (if URL exists)
          if (sectorManagerRef.current) sectorManagerRef.current.value = data['sectorManager'] || ''; // Pre-fill sectorManager

          setReviewTeam((data['review team members'] || []).map(item => {
            const [name, role] = item.split(':').map(s => s.trim());
            return { name, role };
          }));

          setInterviewTeam((data['project members interviewed'] || []).map(item => {
            const [name, role] = item.split(':').map(s => s.trim());
            return { name, role };
          }));
        })
        .catch(err => console.error('Failed to fetch project for editing:', err));
    }
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('responsible office', responsibleOfficeRef.current.value);
    formData.append('name project', projectNameRef.current.value);
    formData.append('number project', projectNumberRef.current.value);
    formData.append('review date', reviewDateRef.current.value);
    formData.append('manager', managerRef.current.value);
    formData.append('manager constructor', constructorManagerRef.current.value);
    formData.append('project scope', projectScopeRef.current.value);
    formData.append('location', locationRef.current.value); // Add location
    if (pictureRef.current.files[0]) formData.append('picture', pictureRef.current.files[0]); // Add image file
    formData.append('sectorManager', sectorManagerRef.current.value); // Add sectorManager
    reviewTeam.forEach((member, index) => formData.append(`review team members[${index}]`, `${member.name}: ${member.role}`));
    interviewTeam.forEach((member, index) => formData.append(`project members interviewed[${index}]`, `${member.name}: ${member.role}`));

    if (
      !formData.get('responsible office') ||
      !formData.get('name project') ||
      !formData.get('number project') ||
      !formData.get('review date') ||
      !formData.get('manager') ||
      !formData.get('manager constructor') ||
      !formData.get('project scope') ||
      reviewTeam.length === 0 ||
      interviewTeam.length === 0
    ) {
      setError('All fields are required to proceed to the CRR questions.');
      return;
    }

    try {
      // Step 1: Create the project
      const projectResponse = await fetch('http://localhost:5000/api/projects/create', {
        method: 'POST',
        body: formData, // Use FormData instead of JSON
      });

      if (!projectResponse.ok) {
        throw new Error('Failed to create project');
      }

      const projectData = await projectResponse.json();
      const projectId = projectData._id; // Adjust based on your response structure

      // Step 2: Create the CRR for the project
      const crrData = {
        title: projectNameRef.current.value, // Use project name as CRR title
      };

      const crrResponse = await fetch(`http://localhost:5000/api/projects/${projectId}/crrs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crrData),
      });

      if (!crrResponse.ok) {
        throw new Error('Failed to create CRR');
      }

      const crrDataResponse = await crrResponse.json();
      console.log('Project created:', projectData);
      console.log('CRR created:', crrDataResponse);

      // Step 3: Navigate to the projects page
      navigate('/home/projects');
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    }
  };

  const addOrUpdateMember = (type, name, role) => {
    if (editType === type && editIndex !== null) {
      const updatedTeam = type === 'review' ? [...reviewTeam] : [...interviewTeam];
      updatedTeam[editIndex] = { name, role };
      type === 'review' ? setReviewTeam(updatedTeam) : setInterviewTeam(updatedTeam);
      setEditIndex(null);
      setEditType(null);
    } else if (name && role) {
      type === 'review'
        ? setReviewTeam([...reviewTeam, { name, role }])
        : setInterviewTeam([...interviewTeam, { name, role }]);
    }

    if (type === 'review') {
      reviewNameRef.current.value = '';
      reviewRoleRef.current.value = '';
    } else {
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
    } else {
      interviewNameRef.current.value = interviewTeam[index].name;
      interviewRoleRef.current.value = interviewTeam[index].role;
    }
  };

  const deleteMember = (type, index) => {
    if (type === 'review') {
      setReviewTeam(reviewTeam.filter((_, i) => i !== index));
    } else {
      setInterviewTeam(interviewTeam.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title">Create New Project</h2>
        <p className="form-subtitle">Enter the project information to begin the CRR validation process</p>

        <form className="row g-4" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="col-md-6">
            <label className="form-label">Responsible Office <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter responsible office" ref={responsibleOfficeRef} required />

            <label className="form-label mt-3">Name <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter project name" ref={projectNameRef} required />

            <label className="form-label mt-3">Number <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter project number" ref={projectNumberRef} required />

            <label className="form-label mt-3">Review Date <span className="text-danger">*</span></label>
            <input type="date" className="form-control" ref={reviewDateRef} required />

            <label className="form-label mt-3">Location</label>
            <select className="form-control" ref={locationRef} defaultValue="">
              <option value="" disabled>Select a city</option>
              <option value="Agadir">Agadir</option>
              <option value="Casablanca">Casablanca</option>
              <option value="Fes">Fes</option>
              <option value="Marrakech">Marrakech</option>
              <option value="Rabat">Rabat</option>
              <option value="Tangier">Tangier</option>
              <option value="Oujda">Oujda</option>
              <option value="Meknes">Meknes</option>
              <option value="Tetouan">Tetouan</option>
              <option value="Safi">Safi</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Manager <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter Manager name" ref={managerRef} required />

            <label className="form-label mt-3">Constructor Manager <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter Constructor Manager name" ref={constructorManagerRef} required />

            <label className="form-label mt-3">Project Scope <span className="text-danger">*</span></label>
            <textarea className="form-control" rows="3" placeholder="Enter project scope details" ref={projectScopeRef} required />

            <label className="form-label mt-3">Sector Manager</label>
            <select className="form-control" ref={sectorManagerRef}>
              <option value="">Select Sector</option>
              <option value="Water">Water</option>
              <option value="Energy">Energy</option>
              <option value="Construction">Construction</option>
              <option value="Transportation">Transportation</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>

            <label className="form-label mt-3">Project Image</label>
            <input type="file" className="form-control" accept="image/*" ref={pictureRef} />
          </div>

          {/* Review Team Section */}
          <div className="col-12 mt-4">
            <label className="form-label">Review Team Members <span className="text-danger">*</span></label>
            <div className="input-group mb-3 team-input-group">
              <input type="text" className="form-control" placeholder="Name" ref={reviewNameRef} />
              <select className="form-select" defaultValue="" ref={reviewRoleRef}>
                <option value="" disabled></option>
                <option>CM</option>
                <option>PM</option>
                <option>SM</option>
                <option>PC</option>
                <option>HSE</option>
                <option>QA/QC</option>
                <option>Other</option>
              </select>
              <button type="button" className="btn-primary" onClick={() => addOrUpdateMember('review', reviewNameRef.current.value, reviewRoleRef.current.value)}>
                {editType === 'review' && editIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
            <ul className="list-group">
              {reviewTeam.map((member, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {member.name} - {member.role}
                  <div>
                    <button type="button" className="btn btn-sm btn-warning mx-2" onClick={() => startEdit('review', index)}>Edit</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteMember('review', index)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Team Section */}
          <div className="col-12 mt-4">
            <label className="form-label">Interviewed Team Members <span className="text-danger">*</span></label>
            <div className="input-group mb-3 team-input-group">
              <input type="text" className="form-control" placeholder="Name" ref={interviewNameRef} />
              <select className="form-select" defaultValue="" ref={interviewRoleRef}>
                <option value="" disabled></option>
                <option>CM</option>
                <option>PM</option>
                <option>SM</option>
                <option>PC</option>
                <option>HSE</option>
                <option>QA/QC</option>
                <option>Other</option>
              </select>
              <button type="button" className="btn-primary" onClick={() => addOrUpdateMember('interview', interviewNameRef.current.value, interviewRoleRef.current.value)}>
                {editType === 'interview' && editIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
            <ul className="list-group">
              {interviewTeam.map((member, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {member.name} - {member.role}
                  <div>
                    <button type="button" className="btn btn-sm btn-warning mx-2" onClick={() => startEdit('interview', index)}>Edit</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteMember('interview', index)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="alert alert-danger mt-3">{error}</div>
          )}

          <div className="form-footer d-flex justify-content-between align-items-center mt-4">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>Back</button>
            <div className="text-muted small">All fields are required to proceed to the CRR questions</div>
            <button type="submit" className="btn btn-primary">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectForm;