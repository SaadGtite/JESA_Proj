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
  const reviewNameRef = useRef(null);
  const reviewRoleRef = useRef(null);
  const interviewNameRef = useRef(null);
  const interviewRoleRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
          if (responsibleOfficeRef.current) responsibleOfficeRef.current.value = data['responsible office'];
          if (projectNameRef.current) projectNameRef.current.value = data['name project'];
          if (projectNumberRef.current) projectNumberRef.current.value = data['number project'];
          if (reviewDateRef.current) reviewDateRef.current.value = data['review date']?.slice(0, 10);
          if (managerRef.current) managerRef.current.value = data.manager;
          if (constructorManagerRef.current) constructorManagerRef.current.value = data['manager constructor'];
          if (projectScopeRef.current) projectScopeRef.current.value = data['project scope'];

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

    const formData = {
      'responsible office': responsibleOfficeRef.current.value,
      'name project': projectNameRef.current.value,
      'number project': projectNumberRef.current.value,
      'review date': reviewDateRef.current.value,
      manager: managerRef.current.value,
      'manager constructor': constructorManagerRef.current.value,
      'project scope': projectScopeRef.current.value,
      'review team members': reviewTeam.map((member) => `${member.name}: ${member.role}`),
      'project members interviewed': interviewTeam.map((member) => `${member.name}: ${member.role}`),
    };

    if (
      !formData['responsible office'] ||
      !formData['name project'] ||
      !formData['number project'] ||
      !formData['review date'] ||
      !formData.manager ||
      !formData['manager constructor'] ||
      !formData['project scope'] ||
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!projectResponse.ok) {
        throw new Error('Failed to create project');
      }
      if (!projectResponse.ok) throw new Error('Failed to create project');

      const projectData = await projectResponse.json();
      const projectId = projectData._id; // Adjust based on your response structure (e.g., projectData.id)

      // Step 2: Create the CRR for the project
      const crrData = {
        title: projectNameRef.current.value, // Use project name as CRR title (modify if needed)
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

      // Step 3: Navigate to the next page
      navigate('/home');
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
          // Pré-remplir les champs
          if (responsibleOfficeRef.current) responsibleOfficeRef.current.value = data['responsible office'];
          if (projectNameRef.current) projectNameRef.current.value = data['name project'];
          if (projectNumberRef.current) projectNumberRef.current.value = data['number project'];
          if (reviewDateRef.current) reviewDateRef.current.value = data['review date']?.slice(0,10); // pour input type="date"
          if (managerRef.current) managerRef.current.value = data.manager;
          if (constructorManagerRef.current) constructorManagerRef.current.value = data['manager constructor'];
          if (projectScopeRef.current) projectScopeRef.current.value = data['project scope'];
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

        <form className="row g-4" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Responsible Office <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter responsible office" ref={responsibleOfficeRef} required />

            <label className="form-label mt-3">Name <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter project name" ref={projectNameRef} required />

            <label className="form-label mt-3">Number <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter project number" ref={projectNumberRef} required />

            <label className="form-label mt-3">Review Date <span className="text-danger">*</span></label>
            <input type="date" className="form-control" ref={reviewDateRef} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Manager <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter Manager name" ref={managerRef} required />

            <label className="form-label mt-3">Constructor Manager <span className="text-danger">*</span></label>
            <input type="text" className="form-control" placeholder="Enter Constructor Manager name" ref={constructorManagerRef} required />

            <label className="form-label mt-3">Project Scope <span className="text-danger">*</span></label>
            <textarea className="form-control" rows="3" placeholder="Enter project scope details" ref={projectScopeRef} required />
          </div>

          {/* Review Team Section */}
          <div className="col-md-6 mt-4">
            <label className="form-label">Review team member <span className="text-danger">*</span></label>
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
          <div className="col-md-6 mt-4">
            <label className="form-label">Project team member interviewed <span className="text-danger">*</span></label>
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
