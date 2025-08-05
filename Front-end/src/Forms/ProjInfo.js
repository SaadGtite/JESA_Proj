import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProjInfo.css'; // Your CSS file

const NewProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reviewTeam, setReviewTeam] = useState([]);
  const [interviewTeam, setInterviewTeam] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState(null);
  const [existingPicture, setExistingPicture] = useState(null); // Store existing picture URL

  const responsibleOfficeRef = useRef(null);
  const projectNameRef = useRef(null);
  const projectNumberRef = useRef(null);
  const reviewDateRef = useRef(null);
  const managerRef = useRef(null);
  const constructorManagerRef = useRef(null);
  const projectScopeRef = useRef(null);
  const locationRef = useRef(null);
  const pictureRef = useRef(null);
  const sectorManagerRef = useRef(null);
  const reviewNameRef = useRef(null);
  const reviewRoleRef = useRef(null);
  const interviewNameRef = useRef(null);
  const interviewRoleRef = useRef(null);

  // Parse team member string (e.g., "sjjs (CM)") into { name, role }
  const parseTeamMember = (memberStr) => {
    if (!memberStr) return { name: '', role: '' };
    const match = memberStr.match(/^(.+)\s+\((.+)\)$/);
    return match ? { name: match[1], role: match[2] } : { name: memberStr, role: 'Other' };
  };

  // Parse team field (array or JSON string) from backend
  const parseTeamField = (data) => {
    if (!data) {
      console.warn('parseTeamField: No data provided, returning empty array');
      return [];
    }
    let arr = [];
    try {
      if (typeof data === 'string') {
        arr = JSON.parse(data);
      } else if (Array.isArray(data)) {
        arr = data;
      } else {
        console.warn('parseTeamField: Data is neither a string nor an array:', data);
        return [];
      }
    } catch (error) {
      console.error('parseTeamField: Failed to parse JSON:', error, 'Data:', data);
      return [];
    }
    return arr
      .map(member => (typeof member === 'string' ? member : ''))
      .filter(str => str && typeof str === 'string');
  };

  // Fetch project data for editing
  useEffect(() => {
    if (id) {
      fetch(`http://backend:5000/api/projects/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch project: ${res.statusText}`);
          return res.json();
        })
        .then(data => {
          console.log('Fetched project data:', data);
          if (responsibleOfficeRef.current) responsibleOfficeRef.current.value = data['responsible office'] || '';
          if (projectNameRef.current) projectNameRef.current.value = data['name project'] || '';
          if (projectNumberRef.current) projectNumberRef.current.value = data['number project'] || '';
          if (reviewDateRef.current) reviewDateRef.current.value = data['review date'] ? new Date(data['review date']).toISOString().split('T')[0] : '';
          if (managerRef.current) managerRef.current.value = data.manager || '';
          if (constructorManagerRef.current) constructorManagerRef.current.value = data['manager constructor'] || '';
          if (projectScopeRef.current) projectScopeRef.current.value = data['project scope'] || '';
          if (locationRef.current) locationRef.current.value = data.location || '';
          if (sectorManagerRef.current) sectorManagerRef.current.value = data.sectorManager || '';
          setExistingPicture(data.picture || null);

          const parsedReviewTeam = parseTeamField(data['review team members']).map(parseTeamMember);
          const parsedInterviewTeam = parseTeamField(data['project members interviewed']).map(parseTeamMember);
          console.log('Parsed Review Team:', parsedReviewTeam);
          console.log('Parsed Interview Team:', parsedInterviewTeam);
          setReviewTeam(parsedReviewTeam);
          setInterviewTeam(parsedInterviewTeam);
        })
        .catch(err => {
          console.error('Failed to fetch project:', err);
          setError('Failed to load project data');
        });
    }
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('responsible office', responsibleOfficeRef.current.value.trim());
    formData.append('name project', projectNameRef.current.value.trim());
    formData.append('number project', projectNumberRef.current.value.trim());
    formData.append('review date', reviewDateRef.current.value);
    formData.append('manager', managerRef.current.value.trim());
    formData.append('manager constructor', constructorManagerRef.current.value.trim());
    formData.append('project scope', projectScopeRef.current.value.trim());
    formData.append('location', locationRef.current.value);
    if (pictureRef.current.files[0]) {
      formData.append('picture', pictureRef.current.files[0]);
    } else if (id && existingPicture) {
      formData.append('picture', existingPicture);
    }
    formData.append('sectorManager', sectorManagerRef.current.value);
    formData.append('review team members', JSON.stringify(reviewTeam.map(member => `${member.name} (${member.role})`)));
    formData.append('project members interviewed', JSON.stringify(interviewTeam.map(member => `${member.name} (${member.role})`)));

    // Validation
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
      setError('All required fields must be filled, and at least one review and interviewed team member are required.');
      return;
    }

    try {
      const url = id ? `http://backend:5000/api/projects/${id}` : 'http://backend:5000/api/projects/create';
      const method = id ? 'PUT' : 'POST';

      console.log('Submitting form data:', Object.fromEntries(formData));

      const projectResponse = await fetch(url, {
        method,
        body: formData,
      });

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json();
        throw new Error(`Failed to ${id ? 'update' : 'create'} project: ${errorData.message || 'Unknown error'}`);
      }

      const projectData = await projectResponse.json();
      const projectId = id || projectData.project?._id || projectData._id;

      if (!id) {
        const crrData = {
          title: projectNameRef.current.value,
        };

        const crrResponse = await fetch(`http://backend:5000/api/projects/${projectId}/crrs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(crrData),
        });

        if (!crrResponse.ok) {
          throw new Error('Failed to create CRR');
        }

        const crrDataResponse = await crrResponse.json();
        console.log('CRR created:', crrDataResponse);
      }

      setSuccess(`Project ${id ? 'updated' : 'created'} successfully!`);
      setTimeout(() => navigate('/home/projects'), 1500);
    } catch (err) {
      setError(err.message);
      console.error('Submission error:', err);
    }
  };

  const addOrUpdateMember = (type, name, role) => {
    if (!name.trim() || !role) {
      setError(`${type === 'review' ? 'Review Team' : 'Interviewed Team'} member name and role are required`);
      return;
    }

    const member = { name: name.trim(), role };
    if (editType === type && editIndex !== null) {
      const updatedTeam = type === 'review' ? [...reviewTeam] : [...interviewTeam];
      updatedTeam[editIndex] = member;
      type === 'review' ? setReviewTeam(updatedTeam) : setInterviewTeam(updatedTeam);
      setEditIndex(null);
      setEditType(null);
    } else {
      type === 'review' ? setReviewTeam([...reviewTeam, member]) : setInterviewTeam([...interviewTeam, member]);
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
    const team = type === 'review' ? reviewTeam : interviewTeam;
    reviewNameRef.current.value = team[index].name;
    reviewRoleRef.current.value = team[index].role;
    if (type === 'interview') {
      interviewNameRef.current.value = team[index].name;
      interviewRoleRef.current.value = team[index].role;
    }
  };

  const deleteMember = (type, index) => {
    if (type === 'review') {
      setReviewTeam(reviewTeam.filter((_, i) => i !== index));
    } else {
      setInterviewTeam(interviewTeam.filter((_, i) => i !== index));
    }
    if (editType === type && editIndex === index) {
      setEditType(null);
      setEditIndex(null);
      if (type === 'review') {
        reviewNameRef.current.value = '';
        reviewRoleRef.current.value = '';
      } else {
        interviewNameRef.current.value = '';
        interviewRoleRef.current.value = '';
      }
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title">{id ? 'Edit Project' : 'Create New Project'}</h2>
        <p className="form-subtitle">{id ? 'Update the project information' : 'Enter the project information to begin the CRR validation process'}</p>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}

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
            {id && existingPicture && (
              <img
                src={`http://backend:5000${existingPicture}`}
                alt="Project"
                style={{ marginTop: '10px', maxHeight: '150px' }}
                onError={(e) => console.error('Image load error:', e, 'URL:', `http://backend:5000${existingPicture}`)}
              />
            )}
          </div>

          <div className="col-12 mt-4">
            <label className="form-label">Review Team Members <span className="text-danger">*</span></label>
            <div className="input-group mb-3 team-input-group">
              <input type="text" className="form-control" placeholder="Name" ref={reviewNameRef} />
              <select className="form-select" defaultValue="" ref={reviewRoleRef}>
                <option value="" disabled>Select Role</option>
                <option value="CM">CM</option>
                <option value="PM">PM</option>
                <option value="SM">SM</option>
                <option value="PC">PC</option>
                <option value="HSE">HSE</option>
                <option value="QA/QC">QA/QC</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="button"
                className="btn-primary"
                onClick={() => addOrUpdateMember('review', reviewNameRef.current.value, reviewRoleRef.current.value)}
              >
                {editType === 'review' && editIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
            <ul className="list-group">
              {reviewTeam.length > 0 ? (
                reviewTeam.map((member, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {member.name} ({member.role})
                    <div>
                      <button type="button" className="btn btn-sm btn-warning mx-2" onClick={() => startEdit('review', index)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteMember('review', index)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">No review team members</li>
              )}
            </ul>
          </div>

          <div className="col-12 mt-4">
            <label className="form-label">Interviewed Team Members <span className="text-danger">*</span></label>
            <div className="input-group mb-3 team-input-group">
              <input type="text" className="form-control" placeholder="Name" ref={interviewNameRef} />
              <select className="form-select" defaultValue="" ref={interviewRoleRef}>
                <option value="" disabled>Select Role</option>
                <option value="CM">CM</option>
                <option value="PM">PM</option>
                <option value="SM">SM</option>
                <option value="PC">PC</option>
                <option value="HSE">HSE</option>
                <option value="QA/QC">QA/QC</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="button"
                className="btn-primary"
                onClick={() => addOrUpdateMember('interview', interviewNameRef.current.value, interviewRoleRef.current.value)}
              >
                {editType === 'interview' && editIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
            <ul className="list-group">
              {interviewTeam.length > 0 ? (
                interviewTeam.map((member, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {member.name} ({member.role})
                    <div>
                      <button type="button" className="btn btn-sm btn-warning mx-2" onClick={() => startEdit('interview', index)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteMember('interview', index)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">No interviewed team members</li>
              )}
            </ul>
          </div>

          <div className="form-footer d-flex justify-content-between align-items-center mt-4">
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
            <div className="text-muted small">All fields are required to proceed to the CRR questions</div>
            <button type="submit" className="btn btn-primary">
              {id ? 'Update' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectForm;