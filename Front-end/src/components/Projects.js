import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
// Import your new custom CSS file
import './Projects.css';

// Mock data (remains the same)
const initialProjects = [
    {
        id: 1,
        name: 'QuantumLeap CRM',
        description: 'A next-gen CRM platform using AI.',
        date: '2025-07-15',
        fullDetails: 'QuantumLeap CRM is a cutting-edge customer relationship management platform designed to leverage artificial intelligence for predictive analytics, lead scoring, and automated customer communication. Built with a microservices architecture.'
    },
    {
        id: 2,
        name: 'Nova Wallet App',
        description: 'Mobile wallet for seamless payments.',
        date: '2025-06-28',
        fullDetails: 'Nova Wallet is a secure and user-friendly mobile application for iOS and Android that allows users to store digital currency, make peer-to-peer transfers, and pay at partnered retail locations using NFC technology.'
    },
    {
        id: 3,
        name: 'Project Phoenix',
        description: 'Internal tool for project management.',
        date: '2025-05-10',
        fullDetails: 'Project Phoenix is an internal-facing web application that helps our teams manage tasks, track progress, and collaborate effectively. It features Kanban boards, Gantt charts, and resource allocation tools.'
    },
];

// SVG Icons (remains the same)
const EditIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const ExportIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;


function ProjectTable() {
    const [projects, setProjects] = useState(initialProjects);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleShowModal = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProject(null);
    };

    // Action handlers remain the same...
    const handleEdit = (e, projectId) => { e.stopPropagation(); alert(`Editing project ID: ${projectId}`); };
    const handleDelete = (e, projectId) => { e.stopPropagation(); if (window.confirm('Are you sure?')) { setProjects(projects.filter(p => p.id !== projectId)); } };
    const handleExport = (e, projectId) => { e.stopPropagation(); alert(`Exporting project ID: ${projectId}`); };

    return (
        <div className="container-fluid py-4 project-dashboard">
            <h2 className="mb-4 dashboard-heading">Projects Dashboard</h2>
            {/* Added custom class 'table-container' */}
            <div className="table-container shadow-sm">
                <Table responsive hover className="project-table align-middle">
                    {/* Added custom class 'table-header' */}
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
                            <tr key={project.id} onClick={() => handleShowModal(project)}>
                                <td className="project-name-cell">{project.name}</td>
                                <td className="text-muted">{project.description}</td>
                                <td className="text-muted">{project.date}</td>
                                <td>
                                    {/* Added custom class 'action-btn' */}
                                    <Button variant="link" className="action-btn" onClick={(e) => handleEdit(e, project.id)}>
                                        <EditIcon />
                                    </Button>
                                    <Button variant="link" className="action-btn" onClick={(e) => handleDelete(e, project.id)}>
                                        <DeleteIcon />
                                    </Button>
                                    <Button variant="link" className="action-btn" onClick={(e) => handleExport(e, project.id)}>
                                        <ExportIcon />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Added custom class 'project-modal' to the Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered className="project-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProject?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="details-heading">Full Project Details</h5>
                    <p className="text-muted">{selectedProject?.fullDetails}</p>
                    <hr />
                    <small className="d-block text-end text-muted">
                        <strong>Date Created:</strong> {selectedProject?.date}
                    </small>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ProjectTable;