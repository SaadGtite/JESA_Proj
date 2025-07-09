import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import './Dashboard.css';

const initialProjects = [
 {
 name: 'Project 1',
 id: 'HWY-2023-101',
 description: 'Expansion of Highway 101...',
 manager: 'Sarah Johnson',
 reviewDate: '2023-10-15',
 score: 85,
 status: 'In Progress',
 },
 {
 name: 'Project 2',
 id: 'BRG-2023-042',
 description: 'Structural renovation of Central Bridge...',
 manager: 'Michael Chen',
 reviewDate: '2023-11-03',
 score: null,
 status: 'Pending Review',
 },
 {
 name: 'Project 3',
 id: 'TRN-2023-078',
 description: 'New multi-modal transit hub...',
 manager: 'Emily Rodriguez',
 reviewDate: '2023-09-22',
 score: 92,
 status: 'Approved',
 },
];

const Dashboard = () => {
 const [filters, setFilters] = useState({
 name: '',
 id: '',
 reviewDate: '',
 manager: '',
 scope: '',
 });

 const [showFilters, setShowFilters] = useState(false);

 const handleFilterChange = (e) => {
 const { name, value } = e.target;
 setFilters({ ...filters, [name]: value });
 };

 const filteredProjects = initialProjects.filter((project) => {
 return (
 project.name.toLowerCase().includes(filters.name.toLowerCase()) &&
 project.id.toLowerCase().includes(filters.id.toLowerCase()) &&
 project.reviewDate.includes(filters.reviewDate) &&
 project.manager.toLowerCase().includes(filters.manager.toLowerCase()) &&
 project.description.toLowerCase().includes(filters.scope.toLowerCase())
 );
 });

 return (
  <div className="dashboard main-content">
    <h2 className="dashboard-title h">Tableau de bord des projets</h2>
    <button
      className="filter-toggle-btn"
      onClick={() => setShowFilters(!showFilters)}
    >
      {showFilters ? 'Masquer les filtres ▲' : 'Afficher les filtres ▼'}
    </button>

 {showFilters && (
 <div className="filters-container">
 <h5 className="filters-title">Filtres de recherche</h5>
 <div className="filters-row">
 <div className="filter-group">
 <label>Nom du projet</label>
 <input
 type="text"
 className="form-control"
 name="name"
 value={filters.name}
 onChange={handleFilterChange}
 />
 </div>
 <div className="filter-group">
 <label>Numéro</label>
 <input
 type="text"
 className="form-control"
 name="id"
 value={filters.id}
 onChange={handleFilterChange}
 />
 </div>
 <div className="filter-group">
 <label>Date de révision</label>
 <input
 type="date"
 className="form-control"
 name="reviewDate"
 value={filters.reviewDate}
 onChange={handleFilterChange}
 />
 </div>
 <div className="filter-group">
 <label>Bureau</label>
 <input
 type="text"
 className="form-control"
 name="manager"
 value={filters.manager}
 onChange={handleFilterChange}
 />
 </div>
 <div className="filter-group">
 <label>Portée</label>
 <input
 type="text"
 className="form-control"
 name="scope"
 value={filters.scope}
 onChange={handleFilterChange}
 />
 </div>
 </div>
 </div>
 )}

 <div className="project-grid">
 {filteredProjects.length > 0 ? (
 filteredProjects.map((project, i) => (
 <ProjectCard key={i} project={project} />
 ))
 ) : (
 <p>Aucun projet ne correspond aux filtres.</p>
 )}
 </div>
 </div>
 );
};

export default Dashboard;