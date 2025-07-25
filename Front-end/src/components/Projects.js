import React, { useState, useEffect } from 'react';
import { Table, Button, Modal , Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

// Icons
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 2h14a2 2 0 0 2 2h14a2-7"></path>
    <path d="M18.5 2a2.121 2.121 0 0 3 3L12 12l-4 1 1-4 9.5-9.5z"></path>
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
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

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 3H2l8 9.46V19a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-6.54L22 3z"></path>
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
          title={`CRR ${idx + 1} ${completed ? 'Completed' : 'Incomplete'}`}
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
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [filter, setFilter] = useState({ sector: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name project', direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setFilteredProjects(data);
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  useEffect(() => {
    let result = projects;
    if (filter.sector) {
      result = result.filter(project => project.sectorManager?.toLowerCase() === filter.sector.toLowerCase());
    }
    if (filter.location) {
      result = result.filter(project => project.location?.toLowerCase() === filter.location.toLowerCase());
    }
    if (searchTerm) {
      result = result.filter(project =>
        project['name project']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project['project scope']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.sectorManager?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result = [...result].sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === 'review date') {
        aValue = new Date(a[sortConfig.key] || 0);
        bValue = new Date(b[sortConfig.key] || 0);
      } else if (sortConfig.key === 'completion') {
        aValue = (a.crrs || []).reduce((sum, crr) => sum + (crr.sections.every(s => s.allQuestionsCompleted) ? 1 : 0), 0);
        bValue = (b.crrs || []).reduce((sum, crr) => sum + (crr.sections.every(s => s.allQuestionsCompleted) ? 1 : 0), 0);
      } else {
        aValue = a[sortConfig.key]?.toLowerCase() || '';
        bValue = b[sortConfig.key]?.toLowerCase() || '';
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredProjects(result);
  }, [filter, projects, searchTerm, sortConfig]);

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
    console.log('Deleting project with ID:', id); // Log the ID
    const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Fallback for non-JSON responses
      if (res.status === 404) {
        alert('Project not found, but removing from UI');
        setProjects(projects.filter(p => p._id !== id));
        setFilteredProjects(filteredProjects.filter(p => p._id !== id));
      } else {
        throw new Error(`Failed to delete project: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`);
      }
    } else {
      setProjects(projects.filter(p => p._id !== id));
      setFilteredProjects(filteredProjects.filter(p => p._id !== id));
      alert('Project deleted successfully'); // Optional
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    alert(`Failed to delete project: ${error.message}`);
  }
}
  };

  const handleExport = (e, id) => {
    e.stopPropagation();
    alert(`Exporting project ID: ${id}`);
  };

  const handleExportAll = () => {
    const csvContent = [
      ['Project Name', 'Description', 'Location', 'Sector', 'Review Date', 'Status'],
      ...filteredProjects.map(p => [
        `"${p['name project']}"`,
        `"${p['project scope']}"`,
        p.location || 'N/A',
        p.sectorManager || 'N/A',
        formatDate(p['review date']),
        p.status || 'Unknown'
      ])
    ]
      .map(row => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'projects_export.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'card' : 'table');
  };

  const handleFilterChange = (type, value) => {
    setFilter(prev => ({ ...prev, [type]: value }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const uniqueSectors = [...new Set(projects.map(p => p.sectorManager).filter(Boolean))];
  const uniqueLocations = [...new Set(projects.map(p => p.location).filter(Boolean))];

  return (
    <div className="container-fluid py-4 project-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="mb-0 dashboard-heading">Projects</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '200px' }}
          />
          <Dropdown onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle variant="outline-primary" className="action-btn filter-btn" title="Filter Projects">
              <FilterIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="filter-dropdown">
              <Dropdown.Header>Filter by Sector</Dropdown.Header>
              <Dropdown.Item onClick={() => handleFilterChange('sector', '')}>
                All Sectors
              </Dropdown.Item>
              {uniqueSectors.map(sector => (
                <Dropdown.Item key={sector} onClick={() => handleFilterChange('sector', sector)}>
                  {sector}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Header>Filter by Location</Dropdown.Header>
              <Dropdown.Item onClick={() => handleFilterChange('location', '')}>
                All Locations
              </Dropdown.Item>
              {uniqueLocations.map(location => (
                <Dropdown.Item key={location} onClick={() => handleFilterChange('location', location)}>
                  {location}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-primary" onClick={toggleViewMode}>
            {viewMode === 'table' ? 'Switch to Card View' : 'Switch to Table View'}
          </Button>
          <Button
            variant="outline-primary"
            className="export-all-btn"
            onClick={handleExportAll}
            title="Export All Projects"
          >
            <ExportIcon /> Export All
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="table-container shadow-sm">
          <Table responsive hover className="project-table align-middle">
            <thead>
              <tr>
                <th onClick={() => handleSort('name project')} style={{ cursor: 'pointer' }} className="sortable">
                  Project Name {sortConfig.key === 'name project' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Description</th>
                <th>Location</th>
                <th>Sector</th>
                <th onClick={() => handleSort('review date')} style={{ cursor: 'pointer' }} className="sortable">
                  Date {sortConfig.key === 'review date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('completion')} style={{ cursor: 'pointer' }} className="sortable">
                  Actions {sortConfig.key === 'completion' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => {
                const crrCompletions = Array(4)
                  .fill(false)
                  .map((_, idx) =>
                    project.crrs && idx < project.crrs.length
                      ? project.crrs[idx].sections
                          .map(section => section.allQuestionsCompleted)
                          .every(completed => completed)
                      : false
                  );

                return (
                  <tr
                    key={project._id}
                    onClick={() => handleRowClick(project)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{project['name project']}</td>
                    <td className="text-muted">{project['project scope']}</td>
                    <td className="text-muted">{project.location || 'N/A'}</td>
                    <td className="text-muted">{project.sectorManager || 'N/A'}</td>
                    <td className="text-muted">{formatDate(project['review date'])}</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`status-badge status-${project.status?.toLowerCase() || 'unknown'}`}>
                        {project.status || 'Unknown'}
                      </span>
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
                      <ProgressBarSegments sectionsCompleted={crrCompletions} />
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
            {filteredProjects.map(project => {
              const crrCompletions = Array(4)
                .fill(false)
                .map((_, idx) =>
                  project.crrs && idx < project.crrs.length
                    ? project.crrs[idx].sections
                        .map(section => section.allQuestionsCompleted)
                        .every(completed => completed)
                    : false
                );

              return (
                <div
                  key={project._id}
                  className="project-card"
                  onClick={() => handleRowClick(project)}
                >
                  <img
                    src={project.picture ? `http://localhost:5000${project.picture}` : '../assets/proj-img.png' }
                    alt={project['name project']}
                    className="project-card-image"
                    onError={(e) => {
                      console.log('Image load failed for:', project.picture);
                    }}
                  />
                  <div className="project-card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 className="project-card-title">{project['name project']}</h5>
                      <span className={`status-badge status-${project.status?.toLowerCase() || 'unknown'}`}>
                        {project.status || 'Unknown'}
                      </span>
                    </div>
                    <p className="project-card-description">{project['project scope']}</p>
                    <p className="project-card-date">
                      {formatDate(project['review date'])} | Location: {project.location || 'N/A'} | Sector: {project.sectorManager || 'N/A'}
                    </p>
                    <CircleProgressBar sectionsCompleted={crrCompletions} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="font-sans project-modal">
        <Modal.Header className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
          <Modal.Title className="text-2xl font-bold text-gray-800">
            Project Details
          </Modal.Title>
          <button
            type="button"
            className="btn-close bg-white/20 hover:bg-white/30 rounded-full"
            onClick={handleCloseModal}
            aria-label="Close"
          ></button>
        </Modal.Header>
        <Modal.Body className="bg-white/10 backdrop-blur-lg border-x border-white/20 p-6">
          {selectedProject ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Project Name:</strong> {selectedProject['name project']}
                  </p>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Project Number:</strong> {selectedProject['number project']}
                  </p>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Responsible Office:</strong> {selectedProject['responsible office'] || 'N/A'}
                  </p>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Project Scope:</strong> {selectedProject['project scope']}
                  </p>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Location:</strong> {selectedProject.location || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Manager:</strong> {selectedProject['manager']}
                  </p>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Manager Constructor:</strong> {selectedProject['manager constructor']}
                  </p>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Review Date:</strong> {formatDate(selectedProject['review date'])}
                  </p>
                  <p className="text-gray-800">
                    <strong className="font-semibold">Sector Manager:</strong> {selectedProject.sectorManager || 'N/A'}
                  </p>
                  {selectedProject.picture && (
                    <p className="text-gray-800">
                      <strong className="font-semibold">Project Image:</strong>{' '}
                      <img
                        src={`http://localhost:5000${selectedProject.picture}`}
                        alt={`${selectedProject['name project']} image`}
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Review Team Members</h3>
                {selectedProject['review team members']?.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-700">
                    {selectedProject['review team members'].map((member, index) => (
                      <li key={index}>{member}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 italic">No team members listed</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Members Interviewed</h3>
                {selectedProject['project members interviewed']?.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-700">
                    {selectedProject['project members interviewed'].map((member, index) => (
                      <li key={index}>{member}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 italic">No members interviewed</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">CRR Assessments</h3>
                {selectedProject.crrs?.length > 0 ? (
                  <div className="space-y-4">
                    {selectedProject.crrs.map((crr, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <p className="text-gray-800">
                          <strong className="font-semibold">CRR Title:</strong> {crr.title}
                        </p>
                        <p className="text-gray-800">
                          <strong className="font-semibold">Created At:</strong> {formatDate(crr.createdAt)}
                        </p>
                        <p className="text-gray-800">
                          <strong className="font-semibold">Sections:</strong> {crr.sections.length}
                        </p>
                        <p className="text-gray-800">
                          <strong className="font-semibold">All Sections Completed:</strong>{' '}
                          {crr.sections.every(section => section.allQuestionsCompleted) ? (
                            <span className="text-green-600">Yes</span>
                          ) : (
                            <span className="text-red-600">No</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 italic">No CRR assessments available</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 italic text-center">No project selected</p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-white/10 backdrop-blur-lg border border-white/20">
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectTable;