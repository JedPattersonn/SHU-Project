"use client";

import { useState } from "react";
import InteractiveHeatMap from "./interactive-map";
import { MapSelection } from "./map-selection";
import { fetchEnergyData } from "@/app/(authenticated)/map/actions";

interface City {
  id: string;
  name: string;
}

interface Network {
  id: string;
  name: string;
}

interface MapContainerProps {
  initialData: any[];
  cities: City[];
  networks: Network[];
  isAdmin: boolean;
}

export function MapContainer({
  initialData,
  cities,
  networks,
  isAdmin,
}: MapContainerProps) {
  const [mapData, setMapData] = useState(initialData);

  const handleSelectionChange = async (
    selection: {
      type: "city" | "network";
      id: string;
    } | null
  ) => {
    try {
      const data = await fetchEnergyData(selection);
      setMapData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMapData([]);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* {isAdmin && (
        <MapSelection
          cities={cities}
          networks={networks}
          onSelectionChange={handleSelectionChange}
        />
      )} */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <InteractiveHeatMap energyData={mapData} />
      </div>
    </div>
  );
}
