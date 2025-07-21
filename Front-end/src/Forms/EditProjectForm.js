import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import './EditProjectForm.css'; // Assuming you have a CSS file for styling
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
    projectMembersInterviewed: ''
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
          projectMembersInterviewed: data['project members interviewed'] || ''
        });
      })
      .catch(error => setError('Failed to load project data'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'responsible office': formData.responsibleOffice,
          'name project': formData.nameProject,
          'number project': formData.numberProject,
          'project scope': formData.projectScope,
          'manager constructor': formData.managerConstructor,
          manager: formData.manager,
          'review date': formData.reviewDate,
          'review team members': formData.reviewTeamMembers,
          'project members interviewed': formData.projectMembersInterviewed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      setSuccess('Project updated successfully!');
      setTimeout(() => navigate('/home'), 1500); // Redirect to project list after success
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 dashboard-heading">Edit Project</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
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
          <Form.Label>Project Scope</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="projectScope"
            value={formData.projectScope}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="managerConstructor">
          <Form.Label>Manager Constructor</Form.Label>
          <Form.Control
            type="text"
            name="managerConstructor"
            value={formData.managerConstructor}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="manager">
          <Form.Label>Manager</Form.Label>
          <Form.Control
            type="text"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
          />
        </Form.Group>

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

        <Button variant="primary" type="submit" onClick={() => navigate('/home/projects')}>
          Save Changes
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate('/home/projects')}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditProjectForm;