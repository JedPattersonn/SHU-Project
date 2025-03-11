"use client"
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HeatmapLayer = ({ points }: { points: number[][] }) => {
  const map = useMap();

  React.useEffect(() => {
    // @ts-expect-error - points is an array of numbers
    const heat = L.heatLayer(points, {
      radius: 35,
      blur: 20,
      maxZoom: 17,
      minOpacity: 0.6,
      gradient: {
        0.4: 'blue',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

const InteractiveHeatMap = () => {
  const center = [51.505, -0.09]; 
  const zoom = 13;

  const heatPoints = [
    [51.5, -0.09, 0.8],
    [51.51, -0.08, 0.6],
    [51.49, -0.1, 0.9],
    [51.505, -0.085, 0.7],
    [51.495, -0.095, 0.5],
  ];

  const markers = [
    {
      position: [51.505, -0.09],
      popup: 'Central Point',
    },
    {
      position: [51.51, -0.08],
      popup: 'North East Point',
    },
    {
      position: [51.49, -0.1],
      popup: 'South West Point',
    },
  ];

  const [selectedMarker, setSelectedMarker] = useState(null);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        // @ts-expect-error - center is an array of numbers
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <HeatmapLayer points={heatPoints} />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            // @ts-expect-error - position is an array of numbers
            position={marker.position}
            eventHandlers={{
              click: () => {
                // @ts-expect-error - selectedMarker is a number
                setSelectedMarker(index);
              },
            }}
          >
            <Popup>
              {marker.popup}
              <br />
              Coordinates: {marker.position[0]}, {marker.position[1]}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 0 5px rgba(0,0,0,0.3)',
        }}
      >
        <h3>Map Controls</h3>
        <p>Selected Marker: {selectedMarker !== null ? markers[selectedMarker].popup : 'None'}</p>
      </div>
    </div>
  );
};

export default InteractiveHeatMap;