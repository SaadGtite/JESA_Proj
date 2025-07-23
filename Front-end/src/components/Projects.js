import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Projects.css';
// Icons
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const ExportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 8 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const ProceedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

// Progress bar component with 4 segments
const ProgressBarSegments = ({ sectionsCompleted }) => {
  return (
    <div
      className="progress-bar-segments"
      style={{
        display: 'flex',
        gap: 4,
        minWidth: 100,
        justifyContent: 'center',
        flexGrow: 1,
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      {sectionsCompleted.map((completed, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            backgroundColor: completed ? '#28a745' : '#ccc',
            transition: 'background-color 0.3s ease',
          }}
          title={`Section ${idx + 1} ${completed ? 'Completed' : 'Incomplete'}`}
        />
      ))}
    </div>
  );
};

// Circle progress bar for card view
const CircleProgressBar = ({ sectionsCompleted }) => {
  return (
    <div className="circle-progress-bar" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {sectionsCompleted.map((completed, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: completed ? '#28a745' : '#ccc',
              transition: 'background-color 0.3s ease',
            }}
            title={`Section ${idx + 1} ${completed ? 'Completed' : 'Incomplete'}`}
          />
          {idx < sectionsCompleted.length - 1 && (
            <div
              style={{
                width: 16,
                height: 2,
                backgroundColor: completed && sectionsCompleted[idx + 1] ? '#28a745' : '#ccc',
                transition: 'background-color 0.3s ease',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const handleRowClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error();
        setProjects(projects.filter(p => p._id !== id));
      } catch {
        alert('Failed to delete project');
      }
    }
  };

  const handleExport = (e, id) => {
    e.stopPropagation();
    alert(`Exporting project ID: ${id}`);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'card' : 'table');
  };

  return (
    <div className="container-fluid py-4 project-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="mb-0 dashboard-heading">Projects Dashboard</h2>
        <Button variant="outline-primary" onClick={toggleViewMode}>
          {viewMode === 'table' ? 'Switch to Card View' : 'Switch to Table View'}
        </Button>
      </div>

      {viewMode === 'table' ? (
        <div className="table-container shadow-sm">
          <Table responsive hover className="project-table align-middle">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => {
                const sectionsCompleted = project.sectionsCompleted || [true, true, false, false];

                return (
                  <tr
                    key={project._id}
                    onClick={() => handleRowClick(project)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{project['name project']}</td>
                    <td className="text-muted">{project['project scope']}</td>
                    <td className="text-muted">{formatDate(project['review date'])}</td>
                    <td style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button
                          as={Link}
                          to={`/projinfo/${project._id}`}
                          variant="link"
                          className="action-btn"
                          onClick={(e) => e.stopPropagation()}
                          title="Edit Project"
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="link"
                          className="action-btn"
                          onClick={(e) => handleDelete(e, project._id)}
                          title="Delete Project"
                        >
                          <DeleteIcon />
                        </Button>
                        <Button
                          variant="link"
                          className="action-btn"
                          onClick={(e) => handleExport(e, project._id)}
                          title="Export Project"
                        >
                          <ExportIcon />
                        </Button>
                      </div>
                      <ProgressBarSegments sectionsCompleted={sectionsCompleted} />
                      {project.crrs && project.crrs.length > 0 ? (
                        <Button
                          variant="link"
                          className="action-btn ms-auto"
                          as={Link}
                          to={`/${project._id}/crrs/${project.crrs[0]._id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Proceed <ProceedIcon />
                        </Button>
                      ) : (
                        <span className="text-muted ms-auto">No CRR available</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="card-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {projects.map(project => {
              const sectionsCompleted = project.sectionsCompleted || [true, true, false, false];
              return (
                <div
                  key={project._id}
                  className="project-card"
                  onClick={() => handleRowClick(project)}
                >
                  <img
                    src={ '../assets/proj-img.png'} // Use default image if img is not available
                    alt={project['name project']}
                    className="project-card-image"
                  />
                  <div className="project-card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 className="project-card-title">{project['name project']}</h5>
                      <Dropdown onClick={(e) => e.stopPropagation()}>
                        <Dropdown.Toggle variant="link" className="action-btn" style={{ padding: 0 }}>
                          <MenuIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item as={Link} to={`/projinfo/${project._id}`}>
                            <EditIcon style={{ marginRight: '8px' }} /> Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={(e) => handleDelete(e, project._id)}>
                            <DeleteIcon style={{ marginRight: '8px' }} /> Delete
                          </Dropdown.Item>
                          <Dropdown.Item onClick={(e) => handleExport(e, project._id)}>
                            <ExportIcon style={{ marginRight: '8px' }} /> Export
                          </Dropdown.Item>
                          {project.crrs && project.crrs.length > 0 && (
                            <Dropdown.Item as={Link} to={`/${project._id}/crrs/${project.crrs[0]._id}`}>
                              <ProceedIcon style={{ marginRight: '8px' }} /> Proceed
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <p className="project-card-description">{project['project scope']}</p>
                    <p className="project-card-date">{formatDate(project['review date'])}</p>
                    <CircleProgressBar sectionsCompleted={sectionsCompleted} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject ? (
            <div className="project-details">
              <p><strong>Project Name:</strong> {selectedProject['name project']}</p>
              <p><strong>Project Scope:</strong> {selectedProject['project scope']}</p>
              <p><strong>Responsible Office:</strong> {selectedProject['responsible office']}</p>
              <p><strong>Number:</strong> {selectedProject['number project']}</p>
              <p><strong>Manager Constructor:</strong> {selectedProject['manager constructor']}</p>
              <p><strong>Manager:</strong> {selectedProject['manager']}</p>
              <p><strong>Review Date:</strong> {formatDate(selectedProject['review date'])}</p>
            </div>
          ) : (
            <p>No project selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectTable;