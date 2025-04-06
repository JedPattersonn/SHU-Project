"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DataTable } from "@/components/data/data-table";

interface EnergyData {
  id: string;
  cityId: string;
  networkManagerId: string;
  purchaseArea: string;
  street: string;
  zipCodeFrom: string;
  zipCodeTo: string;
  numConnections: number;
  deliveryPerc: number;
  percOfActiveConnections: number;
  typeOfConnection: string;
  typeConnPerc: number;
  annualConsume: number;
  annualConsumeLowTarifPerc: number;
  smartmeterPerc: number;
  type: string;
  year: number;
}

interface CityEnergyDataProps {
  cityName: string;
  energyData: EnergyData[];
  networkManagers: { id: string; name: string }[];
}

export function CityEnergyData({
  cityName,
  energyData,
  networkManagers,
}: CityEnergyDataProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const itemsPerPage = 10;

  const years = Array.from(new Set(energyData.map((item) => item.year))).sort(
    (a, b) => b - a
  );
  const types = Array.from(new Set(energyData.map((item) => item.type)));

  const filteredData = energyData.filter((item) => {
    const matchesSearch =
      item.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purchaseArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zipCodeFrom.includes(searchQuery) ||
      item.zipCodeTo.includes(searchQuery);

    const matchesYear =
      yearFilter === "all" ? true : item.year.toString() === yearFilter;
    const matchesType = typeFilter === "all" ? true : item.type === typeFilter;

    return matchesSearch && matchesYear && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setYearFilter("all");
    setTypeFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by street, area, or zip code..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="year">Year</Label>
          <Select
            value={yearFilter}
            onValueChange={(value) => {
              setYearFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Energy Data for {cityName}</h3>
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} records
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>

      <div className="overflow-auto">
        <DataTable
          data={currentData.map((item) => ({
            ...item,
            networkManagerName:
              networkManagers.find((nm) => nm.id === item.networkManagerId)
                ?.name || item.networkManagerId,
          }))}
          columns={[
            { header: "ID", accessorKey: "id" },
            { header: "Network Manager", accessorKey: "networkManagerName" },
            { header: "Purchase Area", accessorKey: "purchaseArea" },
            { header: "Street", accessorKey: "street" },
            { header: "Zip Code", accessorKey: "zipCodeFrom" },
            { header: "Type", accessorKey: "type" },
            { header: "Year", accessorKey: "year" },
            { header: "Annual Consume", accessorKey: "annualConsume" },
            { header: "Smart Meter %", accessorKey: "smartmeterPerc" },
          ]}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
