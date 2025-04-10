"use client";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { EnergyDataWithCoordinates } from "@/lib/utils/postal-code";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
        0.4: "blue",
        0.6: "lime",
        0.8: "yellow",
        1.0: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

interface InteractiveHeatMapProps {
  energyData: EnergyDataWithCoordinates[];
}

const InteractiveHeatMap: React.FC<InteractiveHeatMapProps> = ({
  energyData,
}) => {
  const center = energyData[0]?.coordinates || [52.3567, 6.6626];
  const zoom = 13;

  const heatPoints = energyData.map((item) => [
    item.coordinates[0],
    item.coordinates[1],
    item.annualConsume / 10000,
  ]);

  const [showMarkers, setShowMarkers] = useState(true);

  return (
    <div className="p-4 h-screen z-0">
      <div className="h-full w-full rounded-lg overflow-hidden shadow-lg relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                Show Markers
              </span>
            </label>
          </div>
        </div>

        <MapContainer center={center} zoom={zoom} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <HeatmapLayer points={heatPoints} />

          {showMarkers &&
            energyData.map((item) => (
              <Marker key={item.id} position={item.coordinates}>
                <Popup>
                  <div className="min-w-[200px] font-sans">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">
                      {item.street}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-1/2">
                          Postal Code:
                        </span>
                        <span className="text-gray-800">
                          {item.zipCodeFrom}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-1/2">
                          Consumption:
                        </span>
                        <span className="text-gray-800 font-medium">
                          {item.annualConsume.toLocaleString()} kWh
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-1/2">
                          Connections:
                        </span>
                        <span className="text-gray-800">
                          {item.numConnections}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-1/2">
                          Type:
                        </span>
                        <span className="text-gray-800">
                          {item.type.charAt(0).toUpperCase() +
                            item.type.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 font-medium w-1/2">
                          Year:
                        </span>
                        <span className="text-gray-800">{item.year}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveHeatMap;
