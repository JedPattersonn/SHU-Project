"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface City {
  id: string;
  name: string;
}

interface Network {
  id: string;
  name: string;
}

interface EnergyDataFilterProps {
  cities: City[];
  networks: Network[];
  onFilterChange: (filters: {
    cityId?: string;
    networkId?: string;
    year?: string;
    type?: string;
  }) => void;
}

export function EnergyDataFilter({
  cities,
  networks,
  onFilterChange,
}: EnergyDataFilterProps) {
  const [cityId, setCityId] = useState<string>("");
  const [networkId, setNetworkId] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [type, setType] = useState<string>("");

  const handleApplyFilters = () => {
    onFilterChange({
      cityId: cityId || undefined,
      networkId: networkId || undefined,
      year: year || undefined,
      type: type || undefined,
    });
  };

  const handleResetFilters = () => {
    setCityId("");
    setNetworkId("");
    setYear("");
    setType("");
    onFilterChange({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Select value={cityId} onValueChange={setCityId}>
          <SelectTrigger id="city">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="network">Network Manager</Label>
        <Select value={networkId} onValueChange={setNetworkId}>
          <SelectTrigger id="network">
            <SelectValue placeholder="Select a network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Networks</SelectItem>
            {networks.map((network) => (
              <SelectItem key={network.id} value={network.id}>
                {network.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          placeholder="Filter by year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="gas">Gas</SelectItem>
            <SelectItem value="electricity">Electricity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 col-span-1 md:col-span-2 lg:col-span-4">
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={handleResetFilters}>
          Reset
        </Button>
      </div>
    </div>
  );
}
