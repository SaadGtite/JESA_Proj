import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Projects.css';

const EditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const ExportIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const ProceedIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><polyline points="12 5 19 12 12 19"></polyline></svg>;

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch projects from backend on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleShowModal = (project) => {
    setSelectedProject(project);
    setEditData({
      'responsible office': project['responsible office'] || '',
      'name project': project['name project'] || '',
      'number project': project['number project'] || '',
      'review date': project['review date'] ? project['review date'].slice(0, 10) : '',
      manager: project.manager || '',
      'manager constructor': project['manager constructor'] || '',
      'project scope': project['project scope'] || '',
      reviewTeamMembers: project.reviewTeamMembers || [],
      projectMembersInterviewed: project.projectMembersInterviewed || [],
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setEditData({});
  };

  const handleEdit = async () => {
    try {
      if (!selectedProject || !selectedProject._id) {
        console.error('No project selected for update');
        alert('Please select a project to update');
        return;
      }

      console.log('Updating project:', { projectId: selectedProject._id, editData });

      const res = await fetch(`http://localhost:5000/api/projects/${selectedProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Update response:', errorData);
        throw new Error(`Update failed: ${errorData.message || res.statusText}`);
      }

      const updatedProject = await res.json();
      setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
      setMessage('Project updated successfully!');
      setShowModal(false);

      setTimeout(() => navigate('/home'), 1000);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert(`Failed to update project: ${error.message}`);
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure about deleting the project?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Delete failed');
        setProjects(projects.filter(p => p._id !== projectId));
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project');
      }
    }
  };

  const handleExport = (e, projectId) => {
    e.stopPropagation();
    alert(`Exporting project ID: ${projectId}`);
  };

  return (
    <div className="container-fluid py-4 project-dashboard">
      <h2 className="mb-4 dashboard-heading">Projects Dashboard</h2>
      {message && <div style={{ color: 'green' }}>{message}</div>}
      <div className="table-container shadow-sm">
        <Table responsive hover className="project-table align-middle">
          <thead className="table-header">
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project['name project']}</td>
                <td className="text-muted">{project['project scope']}</td>
                <td className="text-muted">{formatDate(project['review date'])}</td>
                <td className="d-flex justify-content-between align-items-center">
                  <div>
                    {/* Fix: Call handleShowModal instead of handleEdit */}
                    <Button variant="link" className="action-btn" onClick={() => handleShowModal(project)}>
                      <EditIcon />
                    </Button>
                    <Button variant="link" className="action-btn" onClick={(e) => handleDelete(e, project._id)}>
                      <DeleteIcon />
                    </Button>
                    <Button variant="link" className="action-btn" onClick={(e) => handleExport(e, project._id)}>
                      <ExportIcon />
                    </Button>
                  </div>
                  {project.crrs && project.crrs.length > 0 ? (
                    <Button
                      variant="link"
                      className="action-btn ms-auto"
                      as={Link}
                      to={`/${project._id}/crrs/${project.crrs[0]._id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      Proceed <ProceedIcon />
                    </Button>
                  ) : (
                    <span>No CRR available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered className="project-modal">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProject?.['name project'] || 'Edit Project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-control"
                value={editData['name project'] || ''}
                onChange={(e) => setEditData({ ...editData, 'name project': e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Responsible Office</label>
              <input
                type="text"
                className="form-control"
                value={editData['responsible office'] || ''}
                onChange={(e) => setEditData({ ...editData, 'responsible office': e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Project Number</label>
              <input
                type="text"
                className="form-control"
                value={editData['number project'] || ''}
                onChange={(e) => setEditData({ ...editData, 'number project': e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Review Date</label>
              <input
                type="date"
                className="form-control"
                value={editData['review date'] || ''}
                onChange={(e) => setEditData({ ...editData, 'review date': e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Manager</label>
              <input
                type="text"
                className="form-control"
                value={editData.manager || ''}
                onChange={(e) => setEditData({ ...editData, manager: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Manager Constructor</label>
              <input
                type="text"
                className="form-control"
                value={editData['manager constructor'] || ''}
                onChange={(e) => setEditData({ ...editData, 'manager constructor': e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Project Scope</label>
              <textarea
                className="form-control"
                value={editData['project scope'] || ''}
                onChange={(e) => setEditData({ ...editData, 'project scope': e.target.value })}
              />
            </div>
            {/* Add fields for reviewTeamMembers and projectMembersInterviewed if needed */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectTable;