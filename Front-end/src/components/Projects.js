import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Projects.css';
import projImg from '../assets/proj-img.png';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { utils, writeFile } from 'xlsx';

// Icons
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
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
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

// Progress bar component with 4 segments
const ProgressBarSegments = ({ sectionsCompleted, projectId, crrs }) => {
  const navigate = useNavigate();
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
            cursor: crrs && idx < crrs.length ? 'pointer' : 'default',
          }}
          title={`CRR ${idx + 1} ${completed ? 'Completed' : 'Incomplete'}`}
          onClick={() => {
            if (crrs && idx < crrs.length) {
              navigate(`/projects/${projectId}/crrs/${crrs[idx]._id}/analytics`);
            }
          }}
        />
      ))}
    </div>
  );
};

// Circle progress bar for card view
const CircleProgressBar = ({ sectionsCompleted, projectId, crrs }) => {
  const navigate = useNavigate();
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
              cursor: crrs && idx < crrs.length ? 'pointer' : 'default',
            }}
            title={`Section ${idx + 1} ${completed ? 'Completed' : 'Incomplete'}`}
            onClick={() => {
              if (crrs && idx < crrs.length) {
                navigate(`/projects/${projectId}/crrs/${crrs[idx]._id}/analytics`);
              }
            }}
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
  const [viewMode, setViewMode] = useState('table');
  const [filter, setFilter] = useState({ sector: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name project', direction: 'asc' });
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
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
    setSelectedProjectIds(prev => prev.filter(id => result.some(p => p._id === id)));
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
        const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error();
        setProjects(projects.filter(p => p._id !== id));
        setFilteredProjects(filteredProjects.filter(p => p._id !== id));
        setSelectedProjectIds(selectedProjectIds.filter(selectedId => selectedId !== id));
      } catch {
        alert('Failed to delete project');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjectIds.length === 0) {
      alert('No projects selected');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedProjectIds.length} project(s)?`)) {
      try {
        await Promise.all(
          selectedProjectIds.map(id =>
            fetch(`http://localhost:5000/api/projects/${id}`, { method: 'DELETE' })
              .then(res => {
                if (!res.ok) throw new Error(`Failed to delete project ${id}`);
                return id;
              })
          )
        );
        setProjects(projects.filter(p => !selectedProjectIds.includes(p._id)));
        setFilteredProjects(filteredProjects.filter(p => !selectedProjectIds.includes(p._id)));
        setSelectedProjectIds([]);
      } catch (error) {
        console.error('Error in bulk delete:', error);
        alert('Failed to delete some projects');
      }
    }
  };

  const handleExportPDF = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);
      const project = await res.json();

      const doc = new jsPDF();
      let yOffset = 20;

      doc.setFontSize(16);
      doc.text(`Project Report: ${project['name project'] || 'N/A'}`, 20, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      doc.text(`Project Number: ${project['number project'] || 'N/A'}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Responsible Office: ${project['responsible office'] || 'N/A'}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Project Scope: ${project['project scope'] || 'N/A'}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Location: ${project.location || 'N/A'}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Manager: ${project.manager || 'N/A'}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Constructor Manager: ${project['manager constructor'] || 'N/A'}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Review Date: ${formatDate(project['review date'])}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Sector Manager: ${project.sectorManager || 'N/A'}`, 20, yOffset);
      yOffset += 10;

      doc.text('Review Team Members:', 20, yOffset);
      yOffset += 7;
      if (project['review team members']?.length > 0) {
        project['review team members'].forEach(member => {
          doc.text(`- ${member}`, 25, yOffset);
          yOffset += 7;
        });
      } else {
        doc.text('No team members listed', 25, yOffset);
        yOffset += 7;
      }
      yOffset += 7;

      doc.text('Project Members Interviewed:', 20, yOffset);
      yOffset += 7;
      if (project['project members interviewed']?.length > 0) {
        project['project members interviewed'].forEach(member => {
          doc.text(`- ${member}`, 25, yOffset);
          yOffset += 7;
        });
      } else {
        doc.text('No members interviewed', 25, yOffset);
        yOffset += 7;
      }
      yOffset += 10;

      if (project.crrs?.length > 0) {
        project.crrs.forEach((crr, crrIndex) => {
          doc.setFontSize(14);
          doc.text(`CRR Assessment ${crrIndex + 1}: ${crr.title || 'N/A'}`, 20, yOffset);
          yOffset += 7;
          doc.setFontSize(12);
          doc.text(`Created At: ${formatDate(crr.createdAt)}`, 20, yOffset);
          yOffset += 7;

          if (crr.sections?.length > 0) {
            crr.sections.forEach((section, sectionIndex) => {
              doc.setFontSize(13);
              doc.text(`Section ${sectionIndex + 1}: ${section.title || `Section ${sectionIndex + 1}`}`, 20, yOffset);
              yOffset += 7;

              if (section.questions?.length > 0) {
                section.questions.forEach((q, qIndex) => {
                  if (yOffset > 250) {
                    doc.addPage();
                    yOffset = 20;
                  }

                  doc.setFontSize(11);
                  doc.text(`Question ${qIndex + 1}: ${q.text || 'No question text'}`, 25, yOffset);
                  yOffset += 6;
                  doc.text(`Score: ${q.isNA ? 'N/A' : q.score !== null ? q.score : 'Not scored'}`, 30, yOffset);
                  yOffset += 6;
                  doc.text(`Showstopper: ${q.showstopper ? 'Yes' : 'No'}`, 30, yOffset);
                  yOffset += 6;
                  doc.text(`Comments: ${q.comments || 'None'}`, 30, yOffset);
                  yOffset += 6;
                  doc.text(`Actions: ${q.actions || 'None'}`, 30, yOffset);
                  yOffset += 6;
                  doc.text(`Reference Document: ${q.referenceDocument || 'None'}`, 30, yOffset);
                  yOffset += 6;
                  doc.text(`Deliverable: ${q.deliverable || 'None'}`, 30, yOffset);
                  yOffset += 10;
                });
              } else {
                doc.text('No questions available', 25, yOffset);
                yOffset += 7;
              }
            });
          } else {
            doc.text('No sections available', 25, yOffset);
            yOffset += 7;
          }
        });
      } else {
        doc.text('No CRR assessments available', 20, yOffset);
        yOffset += 7;
      }

      doc.save(`Project_${project['name project'] || 'Report'}_${id}.pdf`);
    } catch (error) {
      console.error('Failed to export project to PDF:', error);
      alert('Failed to export project to PDF');
    }
  };

  const handleExportExcel = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`);
      const project = await res.json();

      const workbook = utils.book_new();
      const projectData = [];

      // Project Info Section (Horizontal Layout with Frame)
      projectData.push(['Project Information', '', '', '', '', '', '', '', '']);
      projectData.push([
        'Project Name',
        'Project Number',
        'Responsible Office',
        'Project Scope',
        'Location',
        'Manager',
        'Constructor Manager',
        'Review Date',
        'Sector Manager'
      ]);
      projectData.push([
        project['name project'] || 'N/A',
        project['number project'] || 'N/A',
        project['responsible office'] || 'N/A',
        project['project scope'] || 'N/A',
        project.location || 'N/A',
        project.manager || 'N/A',
        project['manager constructor'] || 'N/A',
        formatDate(project['review date']),
        project.sectorManager || 'N/A'
      ]);
      projectData.push(['', '', '', '', '', '', '', '', '']);

      // Review Team Members
      projectData.push(['Review Team Members']);
      if (project['review team members']?.length > 0) {
        project['review team members'].forEach(member => {
          projectData.push(['', member]);
        });
      } else {
        projectData.push(['', 'No team members listed']);
      }
      projectData.push(['']);

      // Project Members Interviewed
      projectData.push(['Project Members Interviewed']);
      if (project['project members interviewed']?.length > 0) {
        project['project members interviewed'].forEach(member => {
          projectData.push(['', member]);
        });
      } else {
        projectData.push(['', 'No members interviewed']);
      }
      projectData.push(['']);

      // CRR Assessments
      if (project.crrs?.length > 0) {
        project.crrs.forEach((crr, crrIndex) => {
          console.log(`Processing CRR ${crrIndex + 1}:`, crr);
          projectData.push([`CRR Assessment ${crrIndex + 1}: ${crr.title || 'N/A'}`]);
          projectData.push(['', 'Created At', formatDate(crr.createdAt || '')]);
          if (Array.isArray(crr.sections) && crr.sections.length > 0) {
            crr.sections.forEach((section, sectionIndex) => {
              console.log(`Processing Section ${sectionIndex + 1} in CRR ${crrIndex + 1}:`, section);
              projectData.push(['']);
              projectData.push([`Section ${sectionIndex + 1}: ${section.title || `Section ${sectionIndex + 1}`}`]);
              if (Array.isArray(section.questions) && section.questions.length > 0) {
                projectData.push([
                  '',
                  'Question Number',
                  'Question Text',
                  'Score',
                  'Showstopper',
                  'Comments',
                  'Actions',
                  'Reference Document',
                  'Deliverable'
                ]);
                section.questions.forEach((q, qIndex) => {
                  console.log(`Processing Question ${qIndex + 1} in Section ${sectionIndex + 1}:`, q);
                  projectData.push([
                    '',
                    `Question ${qIndex + 1}`,
                    q.text || 'No question text',
                    q.isNA === true ? 'N/A' : (q.score !== null && q.score !== undefined ? q.score : 'Not scored'),
                    q.showstopper === true ? 'Yes' : q.showstopper === false ? 'No' : 'N/A',
                    q.comments || 'None',
                    q.actions || 'None',
                    q.referenceDocument || 'None',
                    q.deliverable || 'None'
                  ]);
                });
              } else {
                projectData.push(['', 'No questions available']);
                console.log(`No questions or invalid questions array in Section ${sectionIndex + 1} of CRR ${crrIndex + 1}`);
              }
            });
          } else {
            projectData.push(['', 'No sections or invalid sections array']);
            console.log(`No sections or invalid sections array in CRR ${crrIndex + 1}`);
          }
          projectData.push(['']);
        });
      } else {
        projectData.push(['No CRR assessments available']);
        console.log('No CRR assessments found for project');
      }

      const worksheet = utils.aoa_to_sheet(projectData);

      // Apply styling: colored title cells and borders for project info
      worksheet['!cols'] = [
        { wch: 20 }, // Spacer column
        { wch: 30 }, // Project Name, Question Number
        { wch: 50 }, // Project Scope, Question Text
        { wch: 15 }, // Score
        { wch: 15 }, // Showstopper
        { wch: 30 }, // Comments
        { wch: 30 }, // Actions
        { wch: 30 }, // Reference Document
        { wch: 30 }  // Deliverable
      ];

      // Style for headers (colored title cells)
      const headerStyle = {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'ADD8E6' } }, // Light blue background
        font: { bold: true },
        alignment: { horizontal: 'left', vertical: 'center' }
      };

      // Style for project info cells
      const projectInfoStyle = {
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        },
        alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
      };

      // Apply styles to cells
      Object.keys(worksheet).forEach(cell => {
        if (cell[0] === '!') return; // Skip metadata
        const rowIndex = parseInt(cell.match(/\d+/)[0], 10) - 1;
        const col = cell.match(/[A-Z]+/)[0];
        const cellValue = worksheet[cell].v;

        // Log the cell value for debugging
        console.log(`Processing cell ${cell}:`, { value: cellValue, type: typeof cellValue });

        // Project Information header (row 1)
        if (rowIndex === 0 && col === 'A') {
          worksheet[cell].s = headerStyle;
        }

        // Project Info labels and data (rows 2-3, columns B-I)
        if (rowIndex >= 1 && rowIndex <= 2 && col >= 'B' && col <= 'I') {
          worksheet[cell].s = projectInfoStyle;
          if (rowIndex === 1) {
            worksheet[cell].s = { ...projectInfoStyle, ...headerStyle };
          }
        }

        // Other headers (Review Team Members, Project Members Interviewed, CRR Assessments, Sections)
        if (
          rowIndex > 3 && col === 'A' &&
          typeof cellValue === 'string' &&
          (
            cellValue.startsWith('Review Team Members') ||
            cellValue.startsWith('Project Members Interviewed') ||
            cellValue.startsWith('CRR Assessment') ||
            cellValue.startsWith('Section ')
          ) ||
          (typeof cellValue === 'string' && cellValue === 'Question Number' && col === 'B')
        ) {
          worksheet[cell].s = headerStyle;
        }
      });

      utils.book_append_sheet(workbook, worksheet, 'Project Report');
      writeFile(workbook, `Project_${project['name project'] || 'Report'}_${id}.xlsx`);
    } catch (error) {
      console.error('Failed to export project to Excel:', error);
      alert(`Failed to export project to Excel. Error: ${error.message}`);
    }
  };

  const handleExportAllExcel = () => {
    const projectData = [
      ['Project Name', 'Project Number', 'Responsible Office', 'Project Scope', 'Location', 'Manager', 'Constructor Manager', 'Review Date', 'Sector Manager']
    ];

    filteredProjects.forEach(project => {
      projectData.push([
        project['name project'] || 'N/A',
        project['number project'] || 'N/A',
        project['responsible office'] || 'N/A',
        project['project scope'] || 'N/A',
        project.location || 'N/A',
        project.manager || 'N/A',
        project['manager constructor'] || 'N/A',
        formatDate(project['review date']),
        project.sectorManager || 'N/A'
      ]);
    });

    const worksheet = utils.aoa_to_sheet(projectData);
    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'All Projects');
    writeFile(workbook, 'all_projects.xlsx');
  };

  const handleBulkExportExcel = () => {
    if (selectedProjectIds.length === 0) {
      alert('No projects selected');
      return;
    }
    const selectedProjects = filteredProjects.filter(p => selectedProjectIds.includes(p._id));
    const projectData = [
      ['Project Name', 'Project Number', 'Responsible Office', 'Project Scope', 'Location', 'Manager', 'Constructor Manager', 'Review Date', 'Sector Manager']
    ];

    selectedProjects.forEach(project => {
      projectData.push([
        project['name project'] || 'N/A',
        project['number project'] || 'N/A',
        project['responsible office'] || 'N/A',
        project['project scope'] || 'N/A',
        project.location || 'N/A',
        project.manager || 'N/A',
        project['manager constructor'] || 'N/A',
        formatDate(project['review date']),
        project.sectorManager || 'N/A'
      ]);
    });

    const worksheet = utils.aoa_to_sheet(projectData);
    worksheet['!cols'] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Selected Projects');
    writeFile(workbook, 'selected_projects.xlsx');
  };

  const handleBulkExportPDF = () => {
    if (selectedProjectIds.length === 0) {
      alert('No projects selected');
      return;
    }
    selectedProjectIds.forEach(id => {
      handleExportPDF(new Event('click'), id);
    });
  };

  const handleExportAllPDF = () => {
    filteredProjects.forEach(project => {
      handleExportPDF(new Event('click'), project._id);
    });
  };

  const handleSelectProject = (e, id) => {
    e.stopPropagation();
    setSelectedProjectIds(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedProjectIds(filteredProjects.map(p => p._id));
    } else {
      setSelectedProjectIds([]);
    }
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
            <Dropdown.Menu align="end" className="filter-dropdown" style={{ zIndex: 1000 }}>
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
          <Dropdown onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle variant="outline-primary" className="export-all-btn" title="Export All Projects">
              <ExportIcon /> Export All
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" style={{ zIndex: 1000 }}>
              <Dropdown.Item onClick={handleExportAllExcel}>
                Export All to Excel
              </Dropdown.Item>
              <Dropdown.Item onClick={handleExportAllPDF}>
                Export All to PDF
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {viewMode === 'table' && (
            <>
              <Button
                variant="outline-danger"
                className="bulk-action-btn"
                onClick={handleBulkDelete}
                disabled={selectedProjectIds.length === 0}
                title="Delete Selected Projects"
              >
                <DeleteIcon /> Delete Selected
              </Button>
              <Dropdown onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle
                  variant="outline-primary"
                  className="bulk-action-btn"
                  disabled={selectedProjectIds.length === 0}
                  title="Export Selected Projects"
                >
                  <ExportIcon /> Export Selected
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" style={{ zIndex: 1000 }}>
                  <Dropdown.Item onClick={handleBulkExportExcel}>
                    Export Selected to Excel
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleBulkExportPDF}>
                    Export Selected to PDF
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="table-container shadow-sm">
          <Table responsive hover className="project-table align-middle">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    checked={selectedProjectIds.length === filteredProjects.length && filteredProjects.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
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
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedProjectIds.includes(project._id)}
                        onChange={(e) => handleSelectProject(e, project._id)}
                      />
                    </td>
                    <td>{project['name project']}</td>
                    <td className="text-muted">{project['project scope']}</td>
                    <td className="text-muted">{project.location || 'N/A'}</td>
                    <td className="text-muted">{project.sectorManager || 'N/A'}</td>
                    <td className="text-muted">{formatDate(project['review date'])}</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                        <Dropdown onClick={(e) => e.stopPropagation()}>
                          <Dropdown.Toggle variant="link" className="action-btn" title="Export Project">
                            <ExportIcon />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end" style={{ zIndex: 1000 }}>
                            <Dropdown.Item onClick={(e) => handleExportPDF(e, project._id)}>
                              Export to PDF
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(e) => handleExportExcel(e, project._id)}>
                              Export to Excel
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <ProgressBarSegments
                        sectionsCompleted={crrCompletions}
                        projectId={project._id}
                        crrs={project.crrs}
                      />
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
                    src={project.picture ? `http://localhost:5000${project.picture}` : projImg}
                    alt={project['name project']}
                    className="project-card-image"
                    onError={(e) => {
                      console.log('Image load failed for:', project.picture);
                      e.target.src = projImg;
                    }}
                  />
                  <div className="project-card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5 className="project-card-title">{project['name project']}</h5>
                    </div>
                    <p className="project-card-description">{project['project scope']}</p>
                    <p className="project-card-date">
                      {formatDate(project['review date'])} | Location: {project.location || 'N/A'} | Sector: {project.sectorManager || 'N/A'}
                    </p>
                    <CircleProgressBar
                      sectionsCompleted={crrCompletions}
                      projectId={project._id}
                      crrs={project.crrs}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <Dropdown onClick={(e) => e.stopPropagation()}>
                        <Dropdown.Toggle variant="link" className="action-btn" style={{ padding: 0 }}>
                          <MenuIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" style={{ zIndex: 1000 }}>
                          <Dropdown.Item as={Link} to={`/projinfo/${project._id}`}>
                            <EditIcon style={{ marginRight: '8px' }} /> Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={(e) => handleDelete(e, project._id)}>
                            <DeleteIcon style={{ marginRight: '8px' }} /> Delete
                          </Dropdown.Item>
                          <Dropdown.Item onClick={(e) => handleExportPDF(e, project._id)}>
                            <ExportIcon style={{ marginRight: '8px' }} /> Export to PDF
                          </Dropdown.Item>
                          <Dropdown.Item onClick={(e) => handleExportExcel(e, project._id)}>
                            <ExportIcon style={{ marginRight: '8px' }} /> Export to Excel
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
      <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', alignItems: 'stretch', flexWrap: 'nowrap', height: '100%' }}>
        {/* Left column: Project Info and Image */}
        <div style={{ flex: 1, minWidth: 260, maxWidth: 400, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 20, height: 'auto', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#3b3b3b', marginBottom: 12 }}>Project Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span><strong>Name:</strong> {selectedProject['name project']}</span>
            <span><strong>Number:</strong> {selectedProject['number project']}</span>
            <span><strong>Responsible Office:</strong> {selectedProject['responsible office'] || 'N/A'}</span>
            <span><strong>Scope:</strong> {selectedProject['project scope']}</span>
            <span><strong>Location:</strong> {selectedProject.location || 'N/A'}</span>
            <span><strong>Manager:</strong> {selectedProject['manager']}</span>
            <span><strong>Manager Constructor:</strong> {selectedProject['manager constructor']}</span>
            <span><strong>Review Date:</strong> {formatDate(selectedProject['review date'])}</span>
            <span><strong>Sector Manager:</strong> {selectedProject.sectorManager || 'N/A'}</span>
          </div>
        </div>
        {/* Right column: Team, Interviewed, CRR */}
        <div style={{ flex: 2, minWidth: 260, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 20, display: 'flex', flexDirection: 'column', gap: 18, height: 'auto', justifyContent: 'stretch' }}>
          {/* Helper function to parse team data */}
          {(() => {
            // Robust team member parser
            const parseTeamData = (data) => {
              if (!data) return [];
              if (Array.isArray(data)) {
                // Array of objects or strings
                if (data.every(item => item && typeof item === 'object' && 'name' in item && 'role' in item)) {
                  return data.map(item => ({
                    name: item.name,
                    role: item.role === 'Other' ? '' : item.role
                  }));
                }
                // Array of strings (legacy)
                return data.map(item => {
                  if (typeof item === 'string') {
                    const [name, role] = item.split(':').map(str => str.trim());
                    return { name, role: role === 'Other' ? '' : role };
                  }
                  return item;
                }).filter(item => item.name);
              }
              // JSON string
              if (typeof data === 'string') {
                try {
                  const parsed = JSON.parse(data);
                  if (Array.isArray(parsed)) {
                    return parsed.map(item => {
                      if (typeof item === 'object' && 'name' in item && 'role' in item) {
                        return { name: item.name, role: item.role === 'Other' ? '' : item.role };
                      }
                      if (typeof item === 'string') {
                        const [name, role] = item.split(':').map(str => str.trim());
                        return { name, role: role === 'Other' ? '' : role };
                      }
                      return null;
                    }).filter(item => item && item.name);
                  }
                } catch (e) {
                  // Not a valid JSON string, try legacy format
                }
                // Legacy string format
                return data.split(',').map(item => {
                  const [name, role] = item.split(':').map(str => str.trim());
                  return { name, role: role === 'Other' ? '' : role };
                }).filter(item => item.name);
              }
              return [];
            };

            const reviewTeam = parseTeamData(selectedProject['review team members']);
            const interviewTeam = parseTeamData(selectedProject['project members interviewed']);

            return (
              <>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#3b3b3b', marginBottom: 8 }}>Review Team Members</h3>
                  {reviewTeam.length > 0 ? (
                    <ul style={{ paddingLeft: 18, margin: 0, color: '#444', fontSize: '1rem' }}>
                      {reviewTeam.map((member, index) => (
                        <li key={index}>
                          {member.name}
                          {member.role ? <span style={{ color: '#3b82f6', fontWeight: 500 }}> ({member.role})</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#888', fontStyle: 'italic' }}>No team members listed</span>
                  )}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#3b3b3b', marginBottom: 8 }}>Project Members Interviewed</h3>
                  {interviewTeam.length > 0 ? (
                    <ul style={{ paddingLeft: 18, margin: 0, color: '#444', fontSize: '1rem' }}>
                      {interviewTeam.map((member, index) => (
                        <li key={index}>
                          {member.name}
                          {member.role ? <span style={{ color: '#3b82f6', fontWeight: 500 }}> ({member.role})</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: '#888', fontStyle: 'italic' }}>No members interviewed</span>
                  )}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#3b3b3b', marginBottom: 8 }}>CRR Assessments</h3>
                  {selectedProject.crrs?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {selectedProject.crrs.map((crr, index) => (
                        <div key={index} style={{ borderLeft: '4px solid #3b82f6', background: '#eef6fd', borderRadius: 6, padding: '8px 14px', marginBottom: 4 }}>
                          <span style={{ color: '#222', fontWeight: 600 }}>CRR Title:</span> {crr.title}<br />
                          <span style={{ color: '#222', fontWeight: 600 }}>Created At:</span> {formatDate(crr.createdAt)}<br />
                          <span style={{ color: '#222', fontWeight: 600 }}>Sections:</span> {crr.sections.length}<br />
                          <span style={{ color: '#222', fontWeight: 600 }}>All Sections Completed:</span> {crr.sections.every(section => section.allQuestionsCompleted) ? (
                            <span style={{ color: '#22c55e', fontWeight: 600 }}>Yes</span>
                          ) : (
                            <span style={{ color: '#ef4444', fontWeight: 600 }}>No</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#888', fontStyle: 'italic' }}>No CRR assessments available</span>
                  )}
                </div>
              </>
            );
          })()}
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