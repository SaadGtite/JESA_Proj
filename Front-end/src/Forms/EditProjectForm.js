import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import './EditProjectForm.css';

const EditProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form data (excluding team members)
  const [formData, setFormData] = useState({
    responsibleOffice: '',
    nameProject: '',
    numberProject: '',
    projectScope: '',
    managerConstructor: '',
    manager: '',
    reviewDate: '',
    location: '',
    sectorManager: '',
    picture: null,
  });

  // State for dynamic team member lists (initialize as null to distinguish between loading and empty)
  const [reviewTeam, setReviewTeam] = useState(null);
  const [interviewTeam, setInterviewTeam] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editType, setEditType] = useState(null); // 'review' or 'interview'
  const [editIndex, setEditIndex] = useState(null); // Index of member being edited

  // Refs for input fields
  const reviewNameRef = useRef(null);
  const reviewRoleRef = useRef(null);
  const interviewNameRef = useRef(null);
  const interviewRoleRef = useRef(null);

  // Function to parse legacy string data into array of objects
  const parseLegacyTeamData = (data, defaultRole = 'Other') => {
    if (!data) return [];
    // Case 1: Already a JSON string (new format)
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.every(item => item.name && item.role)) {
        return parsed;
      }
    } catch (e) {
      // Not a valid JSON string, try legacy format
    }
    // Case 2: Legacy string format (e.g., "John, Jane" or "John:PM, Jane:SM")
    if (typeof data === 'string') {
      return data.split(',').map(item => {
        const [name, role] = item.split(':').map(str => str.trim());
        return { name, role: role || defaultRole };
      }).filter(item => item.name); // Filter out empty names
    }
    // Case 3: Unexpected format, return empty array
    return [];
  };

  // Fetch project data
  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          responsibleOffice: data['responsible office'] || '',
          nameProject: data['name project'] || '',
          numberProject: data['number project'] || '',
          projectScope: data['project scope'] || '',
          managerConstructor: data['manager constructor'] || '',
          manager: data['manager'] || '',
          reviewDate: data['review date'] ? new Date(data['review date']).toISOString().split('T')[0] : '',
          location: data.location || '',
          sectorManager: data.sectorManager || '',
          picture: data.picture || null,
        });
        // Parse team member data (handles both JSON and legacy string formats)
        const parsedReview = parseLegacyTeamData(data['review team members']);
        const parsedInterview = parseLegacyTeamData(data['project members interviewed']);
        setReviewTeam(parsedReview);
        setInterviewTeam(parsedInterview);
      })
      .catch(error => setError('Failed to load project data'));
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'picture' && files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add or update team member
  const addOrUpdateMember = (type, name, role) => {
    if (!name.trim() || !role) {
      setError(`${type === 'review' ? 'Review Team' : 'Interviewed Team'} member name and role are required`);
      return;
    }

    const newMember = { name, role };
    if (type === 'review') {
      if (editType === 'review' && editIndex !== null) {
        setReviewTeam(prev => {
          const updated = [...prev];
          updated[editIndex] = newMember;
          return updated;
        });
      } else {
        setReviewTeam(prev => [...prev, newMember]);
      }
    } else if (type === 'interview') {
      if (editType === 'interview' && editIndex !== null) {
        setInterviewTeam(prev => {
          const updated = [...prev];
          updated[editIndex] = newMember;
          return updated;
        });
      } else {
        setInterviewTeam(prev => [...prev, newMember]);
      }
    }

    // Reset input fields and edit state
    if (type === 'review') {
      reviewNameRef.current.value = '';
      reviewRoleRef.current.value = '';
    } else {
      interviewNameRef.current.value = '';
      interviewRoleRef.current.value = '';
    }
    setEditType(null);
    setEditIndex(null);
  };

  // Start editing a member
  const startEdit = (type, index) => {
    setEditType(type);
    setEditIndex(index);
    if (type === 'review') {
      const member = reviewTeam[index];
      reviewNameRef.current.value = member.name;
      reviewRoleRef.current.value = member.role;
    } else {
      const member = interviewTeam[index];
      interviewNameRef.current.value = member.name;
      interviewRoleRef.current.value = member.role;
    }
  };

  // Delete a member
  const deleteMember = (type, index) => {
    if (type === 'review') {
      setReviewTeam(prev => prev.filter((_, i) => i !== index));
    } else {
      setInterviewTeam(prev => prev.filter((_, i) => i !== index));
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.responsibleOffice.trim() || !formData.nameProject.trim()) {
      setError('Responsible Office and Project Name are required');
      return;
    }
    if (reviewTeam.length === 0 || interviewTeam.length === 0) {
      setError('At least one Review Team Member and one Interviewed Team Member are required');
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('responsible office', formData.responsibleOffice.trim());
    dataToSend.append('name project', formData.nameProject.trim());
    dataToSend.append('number project', formData.numberProject);
    dataToSend.append('project scope', formData.projectScope);
    dataToSend.append('manager constructor', formData.managerConstructor);
    dataToSend.append('manager', formData.manager);
    dataToSend.append('review date', formData.reviewDate);
    dataToSend.append('review team members', JSON.stringify(reviewTeam));
    dataToSend.append('project members interviewed', JSON.stringify(interviewTeam));
    dataToSend.append('location', formData.location);
    dataToSend.append('sectorManager', formData.sectorManager);

    if (formData.picture instanceof File) {
      dataToSend.append('picture', formData.picture);
    } else if (formData.picture && typeof formData.picture === 'string') {
      dataToSend.append('picture', formData.picture);
    }

    // Debug: Log FormData entries
    for (let [key, value] of dataToSend.entries()) {
      console.log(`FormData Entry: ${key} = ${value}`);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'PUT',
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update project: ${errorData.message || response.statusText}`);
      }

      setSuccess('Project updated successfully!');
      setTimeout(() => navigate('/home/projects'), 1500);
    } catch (error) {
      setError(error.message);
      console.error('Submission Error:', error);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 dashboard-heading">Edit Project</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          alignItems: 'flex-start',
          marginBottom: '24px'
        }}>
          <div style={{ flex: '1 1 320px', minWidth: '320px', maxWidth: '480px' }}>
            <Form.Group className="mb-3" controlId="responsibleOffice">
              <Form.Label>Responsible Office</Form.Label>
              <Form.Control
                type="text"
                name="responsibleOffice"
                value={formData.responsibleOffice}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="nameProject">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="nameProject"
                value={formData.nameProject}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="numberProject">
              <Form.Label>Project Number</Form.Label>
              <Form.Control
                type="text"
                name="numberProject"
                value={formData.numberProject}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="projectScope">
              <Form.Label>Project Scope <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="projectScope"
                value={formData.projectScope}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="managerConstructor">
              <Form.Label>Constructor Manager <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="managerConstructor"
                value={formData.managerConstructor}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="manager">
              <Form.Label>Manager <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>
          <div style={{ flex: '1 1 320px', minWidth: '320px', maxWidth: '480px' }}>
            <Form.Group className="mb-3" controlId="reviewDate">
              <Form.Label>Review Date</Form.Label>
              <Form.Control
                type="date"
                name="reviewDate"
                value={formData.reviewDate}
                onChange={handleChange}
              />
            </Form.Group>
            {/* Review Team Section */}
            <div className="mb-3">
              <Form.Label>Review Team Members <span className="text-danger">*</span></Form.Label>
              <div className="input-group mb-3 team-input-group">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  ref={reviewNameRef}
                  style={{ height: '44px', minHeight: '44px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ced4da' }}
                />
                <Form.Select
                  defaultValue=""
                  ref={reviewRoleRef}
                  style={{ height: '44px', minHeight: '44px', padding: '10px 14px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ced4da' }}
                >
                  <option value="" disabled>Role</option>
                  <option>CM</option>
                  <option>PM</option>
                  <option>SM</option>
                  <option>PC</option>
                  <option>HSE</option>
                  <option>QA/QC</option>
                  <option>Other</option>
                </Form.Select>
                <Button
                  variant="primary"
                  onClick={() => addOrUpdateMember('review', reviewNameRef.current.value, reviewRoleRef.current.value)}
                  style={{ height: '44px', minHeight: '44px', fontSize: '1rem', borderRadius: '6px' }}
                >
                  {editType === 'review' && editIndex !== null ? 'Update' : 'Add'}
                </Button>
              </div>
              <ul className="list-group">
                {(reviewTeam && reviewTeam.length > 0) ? reviewTeam.map((member, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {member.name} - {member.role}
                    <div>
                      <Button
                        variant="warning"
                        size="sm"
                        className="mx-2"
                        onClick={() => startEdit('review', index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteMember('review', index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                )) : <li className="list-group-item text-muted">No review team members</li>}
              </ul>
            </div>
            {/* Interview Team Section */}
            <div className="mb-3">
              <Form.Label>Interviewed Team Members <span className="text-danger">*</span></Form.Label>
              <div className="input-group mb-3 team-input-group">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  ref={interviewNameRef}
                  style={{ height: '44px', minHeight: '44px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ced4da' }}
                />
                <Form.Select
                  defaultValue=""
                  ref={interviewRoleRef}
                  style={{ height: '44px', minHeight: '44px', padding: '10px 14px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ced4da' }}
                >
                  <option value="" disabled>Role</option>
                  <option>CM</option>
                  <option>PM</option>
                  <option>SM</option>
                  <option>PC</option>
                  <option>HSE</option>
                  <option>QA/QC</option>
                  <option>Other</option>
                </Form.Select>
                <Button
                  variant="primary"
                  onClick={() => addOrUpdateMember('interview', interviewNameRef.current.value, interviewRoleRef.current.value)}
                  style={{ height: '44px', minHeight: '44px', fontSize: '1rem', borderRadius: '6px' }}
                >
                  {editType === 'interview' && editIndex !== null ? 'Update' : 'Add'}
                </Button>
              </div>
              <ul className="list-group">
                {(interviewTeam && interviewTeam.length > 0) ? interviewTeam.map((member, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {member.name} - {member.role}
                    <div>
                      <Button
                        variant="warning"
                        size="sm"
                        className="mx-2"
                        onClick={() => startEdit('interview', index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteMember('interview', index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                )) : <li className="list-group-item text-muted">No interviewed team members</li>}
              </ul>
            </div>
            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{ height: '44px', minHeight: '44px', padding: '10px 14px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ced4da' }}
              >
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
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="sectorManager">
              <Form.Label>Sector Manager</Form.Label>
              <Form.Select
                name="sectorManager"
                value={formData.sectorManager}
                onChange={handleChange}
                style={{ height: '44px', minHeight: '44px', padding: '10px 14px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ced4da' }}
              >
                <option value="">Select Sector</option>
                <option value="Water">Water</option>
                <option value="Energy">Energy</option>
                <option value="Construction">Construction</option>
                <option value="Transportation">Transportation</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="picture">
              <Form.Label>Project Image</Form.Label>
              <Form.Control
                type="file"
                name="picture"
                onChange={handleChange}
                accept="image/*"
              />
              {formData.picture && typeof formData.picture === 'string' && (
                <div>
                  <p>Current Image: {formData.picture}</p>
                  <img
                    src={`http://localhost:5000${formData.picture}`}
                    alt="Current Project"
                    style={{ maxWidth: '200px', maxHeight: '150px', marginTop: '10px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </Form.Group>
          </div>
        </div>
        <Button variant="primary" type="submit" style={{ height: '40px', minWidth: '120px', fontWeight: '500' }}>
          Save Changes
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate('/home/projects')}
          style={{ height: '40px', minWidth: '120px', fontWeight: '500' }}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditProjectForm;