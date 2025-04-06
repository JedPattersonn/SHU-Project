"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
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

interface ConnectionsCardProps {
  data: {
    year: number;
    totalConnections: number;
    avgActiveConnectionsPerc: number;
  }[];
}

export function ConnectionsCard({ data }: ConnectionsCardProps) {
  const chartData = data.map((item) => ({
    year: item.year.toString(),
    connections: Math.round(item.totalConnections),
    activeConnections: Math.round(
      item.totalConnections * (item.avgActiveConnectionsPerc / 100)
    ),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Connections</CardTitle>
        <CardDescription>
          Number of total and active connections over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              connections: {
                label: "Total Connections",
                color: "hsl(var(--chart-1))",
              },
              activeConnections: {
                label: "Active Connections",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="year" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="connections" fill="var(--color-connections)" />
                <Bar
                  dataKey="activeConnections"
                  fill="var(--color-activeConnections)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
