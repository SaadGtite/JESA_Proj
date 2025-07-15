import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MoroccoMap = ({ projects, onZoneClick }) => {
  const mapCenter = [32.5, -6.0]; // Center of Morocco
  const mapZoom = 6;
  const [moroccoData, setMoroccoData] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    fetch('/assets/maroc.geojson')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('GeoJSON Data:', data);
        setMoroccoData(data);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        setError(error.message);
        setMoroccoData({}); // Fallback to empty object to trigger error display
      });
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [moroccoData]);

  const geoJSONStyle = {
    fillColor: '#bde0fe',
    weight: 1,
    color: 'white',
    fillOpacity: 0.7,
  };

  // Morocco bounding box: Southwest and Northeast corners
  const moroccoBounds = [
    [27.5, -13.0],
    [36.0, -0.5],
  ];

  if (!moroccoData) return <div>Loading GeoJSON...</div>;

  if (error || Object.keys(moroccoData).length === 0) {
    console.log('Error or empty GeoJSON:', error);
    return (
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '600px', width: '100%' }}
        ref={mapRef}
        maxBounds={moroccoBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {projects.map(project => (
          <CircleMarker
            key={project.id}
            center={[project.lat, project.lng]}
            radius={Math.sqrt(project.numberOfProjects) * 4}
            fillColor="#f77f00"
            color="#f77f00"
            weight={1}
            fillOpacity={0.6}
            eventHandlers={{
              click: () => {
                onZoneClick(project);
              },
            }}
          >
            <Popup>
              <b>{project.city}</b><br />
              Number of Projects: {project.numberOfProjects}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '500px', width: '100%' }}
      ref={mapRef}
      id="morocco-map"
      maxBounds={moroccoBounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={moroccoData} style={geoJSONStyle} />
      {projects.map(project => (
        <CircleMarker
          key={project.id}
          center={[project.lat, project.lng]}
          radius={Math.sqrt(project.numberOfProjects) * 4}
          fillColor="#f77f00"
          color="#f77f00"
          weight={1}
          fillOpacity={0.6}
          eventHandlers={{
            click: () => {
              onZoneClick(project);
            },
          }}
        >
          <Popup>
            <b>{project.city}</b><br />
            Number of Projects: {project.numberOfProjects}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MoroccoMap;
