import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Chart, registerables } from 'chart.js';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';
import regions from '../assets/maroc.json';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

Chart.register(...registerables);

// Project data
const projectData = [
  { city: 'Casablanca', lat: 33.5731, lng: -7.5898, numberOfProjects: 12, completion: { '1': 4, '2': 5, '3': 2, '4': 1 }, crrDates: [{ date: new Date(2025, 6, 10), status: 'completed' }, { date: new Date(2025, 6, 15), status: 'ongoing' }, { date: new Date(2025, 6, 20), status: 'scheduled' }, { date: new Date(2025, 6, 25), status: 'not_started' }] },
  { city: 'Rabat', lat: 34.0209, lng: -6.8416, numberOfProjects: 8, completion: { '1': 3, '2': 3, '3': 1, '4': 1 }, crrDates: [{ date: new Date(2025, 6, 12), status: 'completed' }, { date: new Date(2025, 6, 18), status: 'ongoing' }, { date: new Date(2025, 6, 22), status: 'scheduled' }, { date: new Date(2025, 6, 28), status: 'not_started' }] },
  { city: 'Marrakech', lat: 31.6295, lng: -7.9811, numberOfProjects: 10, completion: { '1': 2, '2': 4, '3': 3, '4': 1 }, crrDates: [{ date: new Date(2025, 6, 5), status: 'completed' }, { date: new Date(2025, 6, 14), status: 'ongoing' }, { date: new Date(2025, 6, 19), status: 'scheduled' }] },
  { city: 'Fes', lat: 34.0181, lng: -5.0078, numberOfProjects: 7, completion: { '1': 1, '2': 2, '3': 3, '4': 1 }, crrDates: [{ date: new Date(2025, 6, 8), status: 'not_started' }, { date: new Date(2025, 6, 16), status: 'ongoing' }, { date: new Date(2025, 6, 23), status: 'completed' }] },
  { city: 'Tangier', lat: 35.7595, lng: -5.8340, numberOfProjects: 9, completion: { '1': 2, '2': 3, '3': 2, '4': 2 }, crrDates: [{ date: new Date(2025, 6, 11), status: 'ongoing' }, { date: new Date(2025, 6, 17), status: 'ongoing' }, { date: new Date(2025, 6, 24), status: 'scheduled' }] },
  { city: 'Agadir', lat: 30.4278, lng: -9.5981, numberOfProjects: 6, completion: { '1': 1, '2': 2, '3': 2, '4': 1 }, crrDates: [{ date: new Date(2025, 6, 9), status: 'scheduled' }, { date: new Date(2025, 6, 13), status: 'scheduled' }, { date: new Date(2025, 6, 21), status: 'completed' }] },
];

const getOverallData = () => {
  const totalProjects = projectData.reduce((sum, zone) => sum + zone.numberOfProjects, 0);
  const totalCompletion = { '1': 0, '2': 0, '3': 0, '4': 0 };
  projectData.forEach((zone) => {
    Object.keys(totalCompletion).forEach((key) => {
      totalCompletion[key] += zone.completion[key] || 0;
    });
  });
  const allCrrDates = projectData.flatMap((zone) =>
    zone.crrDates.map((crr) => ({ ...crr, city: zone.city }))
  );
  return { city: 'Overall', numberOfProjects: totalProjects, completion: totalCompletion, crrDates: allCrrDates };
};

const Dashboard = () => {
  const mapRef = useRef(null);
  const pieChartRef = useRef(null);
  const [selectedZone, setSelectedZone] = useState(getOverallData());
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
      center: [30.994053, -15.867001],  // Move slightly east
      zoom: 5.5,                // Zoom in a bit for clarity
      maxBoundsViscosity: 1.0,
      worldCopyJump: false,
      minZoom: 5,
      zoomControl: true,
    });

      // No tile layer → nothing else appears except Morocco
      // Show only Morocco from the GeoJSON
      L.geoJSON(regions, {
        style: {
          color: '#0d6efd',       // Blue border
          weight: 3,
          fillColor: '#e0f7fa',   // Soft turquoise fill
          fillOpacity: 1,
          dashArray: '5,5',       // Dotted outline for effect
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(feature.properties['name:en']);
        },
      }).addTo(mapRef.current);

      // Add city markers and labels
      projectData.forEach((zone) => {
        const status = zone.crrDates[0]?.status || 'not_started';
        const colorMap = {
          completed: { color: 'green', fillColor: '#28a745' },
          ongoing: { color: 'orange', fillColor: '#ffc107' },
          scheduled: { color: 'blue', fillColor: '#3f8efc' },
          not_started: { color: 'red', fillColor: '#dc3545' },
        };
        const { color, fillColor } = colorMap[status] || colorMap['not_started'];

        const circle = L.circle([zone.lat, zone.lng], {
          color,
          fillColor,
          fillOpacity: 0.4,
          radius: 20000,
        }).addTo(mapRef.current);

        circle.bindTooltip(zone.city, {
          permanent: true,
          direction: 'top',
          className: 'city-label',
          offset: [0, -10],
        });

        circle.on('click', () => {
          setSelectedZone(zone);
          setStatusFilter('all');
        });
      });

      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      if (pieChartRef.current.chart) pieChartRef.current.chart.destroy();

      pieChartRef.current.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['CRR 1', 'CRR 2', 'CRR 3', 'CRR 4'],
          datasets: [{
            label: 'Projects by CRR',
            data: [
              selectedZone.completion['1'],
              selectedZone.completion['2'],
              selectedZone.completion['3'],
              selectedZone.completion['4'],
            ],
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }
  }, [selectedZone]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFilteredCrrDates = () => {
    return selectedZone.crrDates
      .filter((crr) => statusFilter === 'all' || crr.status === statusFilter)
      .sort((a, b) => a.date - b.date);
  };

  return (
    <Container fluid className="p-0 position-relative">
      <div id="map" className="map-container"></div>
      <div className="overlay-container">
        <Row>
          <Col xs={12} className="mb-3">
            <div className="modern-container">
              <h4 className="text-center">Project Overview</h4>
              <div className="fade-in">
                <h5>{selectedZone.city}</h5>
                <p>Number of Projects: {selectedZone.numberOfProjects}</p>
                <canvas ref={pieChartRef} style={{ maxHeight: '250px' }}></canvas>
              </div>
            </div>
          </Col>
          <Col xs={12}>
            <div className="modern-container">
              <h4 className="text-center">CRR Dates</h4>
              <Form.Group className="mb-3" style={{ maxWidth: '180px' }}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="not_started">Not Started</option>
                </Form.Select>
              </Form.Group>
              <div className="crr-list">
                {getFilteredCrrDates().length > 0 ? (
                  <ul>
                    {getFilteredCrrDates().map((crr, index) => {
                      const statusText = crr.status.replace('_', ' ').toUpperCase();
                      const city = selectedZone.city === 'Overall' ? crr.city : selectedZone.city;
                      return (
                        <li key={index} className={`crr-item ${crr.status}`}>
                          <span className={`status-indicator bg-${crr.status}`}></span>
                          {formatDate(crr.date)} - {statusText} - {city}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-center">No CRR dates match the selected filter.</p>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Dashboard;
