"use client";
import {
  AreaChart,
  Area,
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
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Total Connections</CardTitle>
        <CardDescription>
          Number of total and active connections over time
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
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
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 60,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorConnections"
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
                    id="colorActiveConnections"
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
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={12}
                  stroke="hsl(var(--border))"
                />
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={12}
                  stroke="hsl(var(--border))"
                  tickFormatter={(value) => `${value.toLocaleString()}k`}
                  width={65}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="connections"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorConnections)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="activeConnections"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#colorActiveConnections)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
