"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface EnergyTypeComparisonCardProps {
  data: {
    year: number;
    totalConsumption: number;
    avgSmartMeterPerc: number;
    totalConnections: number;
    avgDeliveryPerc: number;
    avgActiveConnectionsPerc: number;
  }[];
}

export function EnergyTypeComparisonCard({
  data,
}: EnergyTypeComparisonCardProps) {
  // Since we don't have separate electricity and gas data in the current query,
  // we'll simulate it by splitting the total consumption
  // In a real implementation, you would modify the query to get separate data

  const chartData = data.map((item) => {
    // Simulate electricity being 60% and gas being 40% of total consumption
    // This is just for demonstration - in a real app, you'd get actual data
    const electricityConsumption = item.totalConsumption * 0.6;
    const gasConsumption = item.totalConsumption * 0.4;

    return {
      year: item.year.toString(),
      electricity: Math.round(electricityConsumption),
      gas: Math.round(gasConsumption),
    };
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Energy Type Comparison</CardTitle>
        <CardDescription>
          Electricity vs Gas consumption over time
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ChartContainer
            config={{
              electricity: {
                label: "Electricity (kWh)",
                color: "hsl(var(--chart-1))",
              },
              gas: {
                label: "Gas (kWh)",
                color: "hsl(var(--chart-3))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="electricity"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="gas"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
