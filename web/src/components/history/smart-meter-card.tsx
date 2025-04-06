"use client";
import {
  LineChart,
  Line,
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

interface SmartMeterCardProps {
  data: {
    year: number;
    avgSmartMeterPerc: number;
  }[];
}

export function SmartMeterCard({ data }: SmartMeterCardProps) {
  const chartData = data.map((item) => ({
    year: item.year.toString(),
    smartMeters: Math.round(item.avgSmartMeterPerc),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Meter Adoption</CardTitle>
        <CardDescription>
          Percentage of customers with smart meters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              smartMeters: {
                label: "Smart Meters (%)",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="year" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="smartMeters"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
