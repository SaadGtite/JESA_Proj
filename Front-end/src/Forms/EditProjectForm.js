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

  // Team members as arrays of strings like "Name (Role)"
  const [reviewTeam, setReviewTeam] = useState([]);
  const [interviewTeam, setInterviewTeam] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editType, setEditType] = useState(null); // 'review' or 'interview'
  const [editIndex, setEditIndex] = useState(null); // index of member being edited

  // Refs for inputs
  const reviewNameRef = useRef(null);
  const reviewRoleRef = useRef(null);
  const interviewNameRef = useRef(null);
  const interviewRoleRef = useRef(null);

  // Helper to parse backend JSON string field to array of strings in 'Name (Role)' format
  // Helper to parse backend JSON string field to array of strings in 'Name (Role)' format
const parseTeamField = (data) => {
  if (!data) {
    console.warn('parseTeamField: No data provided, returning empty array');
    return [];
  }
  let arr = [];
  try {
    // If data is a string, parse it as JSON
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
  if (Array.isArray(arr)) {
    // Always return array of strings
    return arr
      .map(member => {
        if (typeof member === 'object' && member !== null && 'name' in member && 'role' in member) {
          return `${member.name} (${member.role})`;
        }
        if (typeof member === 'string') {
          return member;
        }
        console.warn('parseTeamField: Invalid member format:', member);
        return '';
      })
      .filter(str => str && typeof str === 'string');
  }
  console.warn('parseTeamField: Data is not an array:', arr);
  return [];
};

  // Fetch project data on mount
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

        const parsedReviewTeam = parseTeamField(data['review team members']);
        const parsedInterviewTeam = parseTeamField(data['project members interviewed']);
        console.log('Review Team:', parsedReviewTeam);
        console.log('Interview Team:', parsedInterviewTeam);
        setReviewTeam(parsedReviewTeam);
        setInterviewTeam(parsedInterviewTeam);
      })
      .catch(() => setError('Failed to load project data'));
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

  // Add or update a member string "Name (Role)"
  const addOrUpdateMember = (type, name, role) => {
    setError('');
    if (!name.trim() || !role) {
      setError(`${type === 'review' ? 'Review Team' : 'Interviewed Team'} member name and role are required`);
      return;
    }

    const memberStr = `${name.trim()} (${role})`;

    if (type === 'review') {
      if (editType === 'review' && editIndex !== null) {
        setReviewTeam(prev => {
          const updated = [...prev];
          updated[editIndex] = memberStr;
          return updated;
        });
      } else {
        setReviewTeam(prev => [...prev, memberStr]);
      }
    } else {
      if (editType === 'interview' && editIndex !== null) {
        setInterviewTeam(prev => {
          const updated = [...prev];
          updated[editIndex] = memberStr;
          return updated;
        });
      } else {
        setInterviewTeam(prev => [...prev, memberStr]);
      }
    }

    // Reset inputs and editing state
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

  // Start editing a member - parse string into name and role
  const startEdit = (type, index) => {
    setEditType(type);
    setEditIndex(index);

    const member = (type === 'review' ? reviewTeam : interviewTeam)[index];
    const match = member.match(/^(.+)\s+\((.+)\)$/);
    const name = match ? match[1] : member;
    const role = match ? match[2] : 'Other';

    if (type === 'review') {
      reviewNameRef.current.value = name;
      reviewRoleRef.current.value = role;
    } else {
      interviewNameRef.current.value = name;
      interviewRoleRef.current.value = role;
    }
  };

  // Delete a member
  const deleteMember = (type, index) => {
    if (type === 'review') {
      setReviewTeam(prev => prev.filter((_, i) => i !== index));
    } else {
      setInterviewTeam(prev => prev.filter((_, i) => i !== index));
    }
    // Clear edit if deleting edited member
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
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

            {/* Review Team */}
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
                {reviewTeam.length > 0 ? reviewTeam.map((member, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {member}
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

            {/* Interview Team */}
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
                {interviewTeam.length > 0 ? interviewTeam.map((member, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {member}
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
                <img
                  src={formData.picture}
                  alt="Project"
                  style={{ marginTop: '10px', maxHeight: '150px' }}
                />
              )}
            </Form.Group>
          </div>
        </div>
        <Button variant="primary" type="submit" style={{ minWidth: '160px', padding: '12px 0' }}>
          Update Project
        </Button>
      </Form>
    </Container>
  );
};

export default EditProjectForm;
