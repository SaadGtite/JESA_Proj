import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Chart, registerables } from 'chart.js';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';

Chart.register(...registerables);

// Exemples de données projet
const projectData = [
  {
    city: 'Casablanca',
    lat: 33.5731,
    lng: -7.5898,
    numberOfProjects: 12,
    completion: { '1': 4, '2': 5, '3': 2, '4': 1 },
  },
  {
    city: 'Rabat',
    lat: 34.0209,
    lng: -6.8416,
    numberOfProjects: 8,
    completion: { '1': 3, '2': 3, '3': 1, '4': 1 },
  },
];

const Dashboard = () => {
  const mapRef = useRef(null);
  const chartRef = useRef(null);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [32.0, -6.0],
        zoom: 6,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Ajouter les zones projet
      projectData.forEach((zone) => {
        const circle = L.circle([zone.lat, zone.lng], {
          color: 'blue',
          fillColor: '#3f8efc',
          fillOpacity: 0.4,
          radius: 20000,
        }).addTo(mapRef.current);

        circle.on('click', () => {
          setSelectedZone(zone);
          console.log('Zone sélectionnée :', zone);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (selectedZone && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      chartRef.current.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['CRR 1', 'CRR 2', 'CRR 3', 'CRR 4'],
          datasets: [
            {
              label: 'Projects',
              data: [
                selectedZone.completion['1'],
                selectedZone.completion['2'],
                selectedZone.completion['3'],
                selectedZone.completion['4'],
              ],
              backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
        },
      });
    }
  }, [selectedZone]);

  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <div id="map" style={{ height: '600px', borderRadius: '20px' }}></div>
        </Col>
        <Col md={4}>
          <Card className="project-details-card mt-3">
            <h4 className="text-center">Project Details</h4>
            {selectedZone ? (
              <div className="fade-in">
                <h5>{selectedZone.city}</h5>
                <p>Number of Projects: {selectedZone.numberOfProjects}</p>
                
              </div>
            ) : (
              <p className="text-center fade-in">
                Click on a project zone to see details.
              </p>
            )}
          </Card>

          {selectedZone && (
            <Card className="project-details-card mt-3">
              <h5 className="text-center">Projects by CRR</h5>
              <canvas ref={chartRef}></canvas>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
