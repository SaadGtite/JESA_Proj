import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const moroccoBounds = [
  [27.0, -13.5],
  [36.5, -1.0],
];

const MapInitializer = ({ setMinZoom }) => {
  const map = useMap();

  useEffect(() => {
    const zoom = map.getZoom();
    map.setMinZoom(zoom);
    setMinZoom(zoom);
  }, [map, setMinZoom]);

  return null;
};

const MoroccoMap = ({ projects, onZoneClick }) => {
  const [moroccoData, setMoroccoData] = useState(null);
  const [error, setError] = useState(null);
  const [minZoom, setMinZoom] = useState(6);

  useEffect(() => {
    fetch('/assets/maroc.geojson')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMoroccoData(data);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        setError(error.message);
        setMoroccoData({});
      });
  }, []);

  const geoJSONStyle = {
    fillColor: '#bde0fe',
    weight: 1,
    color: 'white',
    fillOpacity: 0.7,
  };

  if (!moroccoData) return <div>Loading GeoJSON...</div>;

  return (
    <MapContainer
      center={[31.7917, -7.0926]}
      zoom={minZoom}
      minZoom={minZoom}
      maxZoom={20}
      maxBounds={moroccoBounds}
      maxBoundsViscosity={1.0}
      worldCopyJump={false}
      style={{ height: '500px', width: '100%' }}
      id="morocco-map"
      preferCanvas={true}

    >
      <MapInitializer setMinZoom={setMinZoom} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />

      {moroccoData && Object.keys(moroccoData).length > 0 && (
        <GeoJSON data={moroccoData} style={geoJSONStyle} />
      )}

      {projects && projects.length > 0 &&
        projects.map(project => (
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
