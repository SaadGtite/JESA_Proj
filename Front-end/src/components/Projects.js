import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import './Projects.css';

const EditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const ExportIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;

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

  // 👇 Charger les projets depuis le backend au montage
  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const handleShowModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleEdit = (e, projectId) => { e.stopPropagation(); alert(`Editing project ID: ${projectId}`); };
  const handleDelete = (e, projectId) => { e.stopPropagation(); if (window.confirm('Are you sure?')) { setProjects(projects.filter(p => p._id !== projectId)); } };
  const handleExport = (e, projectId) => { e.stopPropagation(); alert(`Exporting project ID: ${projectId}`); };

  return (
    <div className="container-fluid py-4 project-dashboard">
      <h2 className="mb-4 dashboard-heading">Projects Dashboard</h2>
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
              <tr key={project._id} onClick={() => handleShowModal(project)}>
                <td className="project-name-cell">{project['name project']}</td>
                <td className="text-muted">{project['project scope']}</td>
                <td className="text-muted">{formatDate(project['review date'])}</td>
                <td>
                  <Button variant="link" className="action-btn" onClick={(e) => handleEdit(e, project._id)}><EditIcon /></Button>
                  <Button variant="link" className="action-btn" onClick={(e) => handleDelete(e, project._id)}><DeleteIcon /></Button>
                  <Button variant="link" className="action-btn" onClick={(e) => handleExport(e, project._id)}><ExportIcon /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

     <Modal show={showModal} onHide={handleCloseModal} centered className="project-modal">
  <Modal.Header closeButton>
    <Modal.Title>{selectedProject?.['name project']}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div className="project-details-horizontal">
    {selectedProject && Object.entries(selectedProject).map(([key, value]) => {
      if (['crrs', '_id', '__v'].includes(key)) return null;
      const isDate = key.toLowerCase().includes('date');
      const displayValue = isDate ? formatDate(value) : String(value);
      return (
        <div key={key} className="detail-row d-flex justify-content-between align-items-center py-2 border-bottom">
          <div className="fw-semibold text-secondary small text-capitalize">
            {key.replace(/_/g, ' ')}
          </div>
          <div className="text-dark text-end ms-3">{displayValue}</div>
        </div>
      );
    })}
  </div>
</Modal.Body>
<Modal.Footer>
  <Button variant="outline-secondary" onClick={handleCloseModal}>
    Close
  </Button>
</Modal.Footer>
</Modal>
    </div>
  );
}

export default ProjectTable;
