"use client";

import InteractiveHeatMap from "./interactive-map";

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

export function MapContainer({ initialData }: MapContainerProps) {
  // const [mapData, setMapData] = useState(initialData);

  // const handleSelectionChange = async (
  //   selection: {
  //     type: "city" | "network";
  //     id: string;
  //   } | null
  // ) => {
  //   try {
  //     const data = await fetchEnergyData(selection);
  //     setMapData(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setMapData([]);
  //   }
  // };

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
        <InteractiveHeatMap energyData={initialData} />
      </div>
    </div>
  );
}
