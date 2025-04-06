"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield } from "lucide-react";

interface City {
  id: string;
  name: string;
}

interface Network {
  id: string;
  name: string;
}

interface MapSelectionProps {
  cities: City[];
  networks: Network[];
  onSelectionChange: (
    selection: {
      type: "city" | "network";
      id: string;
    } | null
  ) => void;
}

export function MapSelection({
  cities,
  networks,
  onSelectionChange,
}: MapSelectionProps) {
  const [selectedType, setSelectedType] = useState<"city" | "network">("city");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleTypeChange = (value: "city" | "network") => {
    setSelectedType(value);
    setSelectedId(null);
    onSelectionChange(null);
  };

  const handleIdChange = (value: string) => {
    setSelectedId(value);
    if (value === "all") {
      onSelectionChange(null);
    } else {
      onSelectionChange({ type: selectedType, id: value });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-blue-800">Admin Controls</h2>
      </div>
      <p className="text-sm text-blue-700 mb-2">
        Select a city or network to view its energy data on the map.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-blue-700 font-medium">
            Select Entity Type
          </Label>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="city">City</SelectItem>
              <SelectItem value="network">Network</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-700 font-medium">
            Select {selectedType === "city" ? "City" : "Network"}
          </Label>
          <Select value={selectedId || "all"} onValueChange={handleIdChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={`Select ${selectedType}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All {selectedType === "city" ? "Cities" : "Networks"}
              </SelectItem>
              {(selectedType === "city" ? cities : networks).map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
