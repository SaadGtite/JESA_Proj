import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import './EditProjectForm.css';

const EditProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    responsibleOffice: '',
    nameProject: '',
    numberProject: '',
    projectScope: '',
    managerConstructor: '',
    manager: '',
    reviewDate: '',
    reviewTeamMembers: '',
    projectMembersInterviewed: '',
    location: '',
    sectorManager: '',
    picture: null // Initialized as null for file input
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch project data
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
          reviewTeamMembers: data['review team members'] || '',
          projectMembersInterviewed: data['project members interviewed'] || '',
          location: data.location || '',
          sectorManager: data.sectorManager || '',
          picture: data.picture || null // Store the current picture path or null
        });
      })
      .catch(error => setError('Failed to load project data'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'picture' && files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] })); // Handle file upload
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // Validate required fields before submission
  if (!formData.responsibleOffice.trim() || !formData.nameProject.trim()) {
    setError('Responsible Office and Project Name are required');
    return;
  }

  const dataToSend = new FormData();
  dataToSend.append('responsible office', formData.responsibleOffice.trim()); // Use exact key with space
  dataToSend.append('name project', formData.nameProject.trim()); // Use exact key with space
  dataToSend.append('number project', formData.numberProject);
  dataToSend.append('project scope', formData.projectScope);
  dataToSend.append('manager constructor', formData.managerConstructor);
  dataToSend.append('manager', formData.manager);
  dataToSend.append('review date', formData.reviewDate);
  dataToSend.append('review team members', formData.reviewTeamMembers);
  dataToSend.append('project members interviewed', formData.projectMembersInterviewed);
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
      const errorData = await response.json(); // Parse JSON error response
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
            <Form.Group className="mb-3" controlId="reviewTeamMembers">
              <Form.Label>Review Team Members</Form.Label>
              <Form.Control
                type="text"
                name="reviewTeamMembers"
                value={formData.reviewTeamMembers}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="projectMembersInterviewed">
              <Form.Label>Project Members Interviewed</Form.Label>
              <Form.Control
                type="text"
                name="projectMembersInterviewed"
                value={formData.projectMembersInterviewed}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{ height: '38px', minHeight: '38px', padding: '6px 12px' }}
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
                style={{ height: '38px', minHeight: '38px', padding: '6px 12px' }}
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