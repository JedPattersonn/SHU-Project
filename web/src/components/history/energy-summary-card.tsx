"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnergySummaryCardProps {
  data: {
    year: number;
    totalConsumption: number;
    avgSmartMeterPerc: number;
    totalConnections: number;
    avgDeliveryPerc: number;
    avgActiveConnectionsPerc: number;
  }[];
}

export function EnergySummaryCard({ data }: EnergySummaryCardProps) {
  const [comparisonYear, setComparisonYear] = useState<number>(
    data.length >= 2 ? data[data.length - 2].year : 0
  );

  useEffect(() => {
    if (data.length >= 2) {
      setComparisonYear(data[data.length - 2].year);
    }
  }, [data]);

  if (data.length < 2) return null;

  const latestYear = data[data.length - 1];

  const comparisonYearData =
    data.find((item) => item.year === comparisonYear) || data[data.length - 2];

  const consumptionChange =
    ((latestYear.totalConsumption - comparisonYearData.totalConsumption) /
      comparisonYearData.totalConsumption) *
    100;
  const smartMeterChange =
    latestYear.avgSmartMeterPerc - comparisonYearData.avgSmartMeterPerc;
  const connectionsChange =
    ((latestYear.totalConnections - comparisonYearData.totalConnections) /
      comparisonYearData.totalConnections) *
    100;
  const activeConnectionsChange =
    latestYear.avgActiveConnectionsPerc -
    comparisonYearData.avgActiveConnectionsPerc;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toFixed(0);
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + "%";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    return <MinusIcon className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Energy Summary</CardTitle>
          <CardDescription>Key metrics for {latestYear.year}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Compare with:</span>
          <Select
            value={comparisonYear.toString()}
            onValueChange={(value) => setComparisonYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {data
                .filter((item) => item.year !== latestYear.year)
                .map((item) => (
                  <SelectItem key={item.year} value={item.year.toString()}>
                    {item.year}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Consumption
              </h3>
              <div
                className={`flex items-center ${getChangeColor(consumptionChange)}`}
              >
                {getChangeIcon(consumptionChange)}
                <span className="ml-1 text-xs font-medium">
                  {Math.abs(consumptionChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatNumber(latestYear.totalConsumption)} kWh
            </p>
            <p className="text-xs text-muted-foreground">
              vs {comparisonYearData.year}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Smart Meter Adoption
              </h3>
              <div
                className={`flex items-center ${getChangeColor(smartMeterChange)}`}
              >
                {getChangeIcon(smartMeterChange)}
                <span className="ml-1 text-xs font-medium">
                  {Math.abs(smartMeterChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatPercentage(latestYear.avgSmartMeterPerc)}
            </p>
            <p className="text-xs text-muted-foreground">
              vs {comparisonYearData.year}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Connections
              </h3>
              <div
                className={`flex items-center ${getChangeColor(connectionsChange)}`}
              >
                {getChangeIcon(connectionsChange)}
                <span className="ml-1 text-xs font-medium">
                  {Math.abs(connectionsChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatNumber(latestYear.totalConnections)}
            </p>
            <p className="text-xs text-muted-foreground">
              vs {comparisonYearData.year}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Active Connections
              </h3>
              <div
                className={`flex items-center ${getChangeColor(activeConnectionsChange)}`}
              >
                {getChangeIcon(activeConnectionsChange)}
                <span className="ml-1 text-xs font-medium">
                  {Math.abs(activeConnectionsChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {formatPercentage(latestYear.avgActiveConnectionsPerc)}
            </p>
            <p className="text-xs text-muted-foreground">
              vs {comparisonYearData.year}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
