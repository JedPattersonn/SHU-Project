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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ConnectionTypeCardProps {
  data: {
    year: number;
    totalConsumption: number;
    avgSmartMeterPerc: number;
    totalConnections: number;
    avgDeliveryPerc: number;
    avgActiveConnectionsPerc: number;
  }[];
}

export function ConnectionTypeCard({ data }: ConnectionTypeCardProps) {
  // Since we don't have actual connection type data in the current query,
  // we'll simulate it with some reasonable values
  // In a real implementation, you would modify the query to get actual data

  const chartData = data.map((item) => {
    // Simulate different connection types
    // This is just for demonstration - in a real app, you'd get actual data
    const residential = Math.round(item.totalConnections * 0.6);
    const commercial = Math.round(item.totalConnections * 0.3);
    const industrial = Math.round(item.totalConnections * 0.1);

    return {
      year: item.year.toString(),
      residential,
      commercial,
      industrial,
    };
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Connection Types</CardTitle>
        <CardDescription>
          Distribution of connection types over time
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ChartContainer
            config={{
              residential: {
                label: "Residential",
                color: "hsl(var(--chart-1))",
              },
              commercial: {
                label: "Commercial",
                color: "hsl(var(--chart-2))",
              },
              industrial: {
                label: "Industrial",
                color: "hsl(var(--chart-3))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="colorResidential"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorCommercial"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorIndustrial"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-3))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-3))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="residential"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorResidential)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="commercial"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#colorCommercial)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="industrial"
                  stackId="1"
                  stroke="hsl(var(--chart-3))"
                  fillOpacity={1}
                  fill="url(#colorIndustrial)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
