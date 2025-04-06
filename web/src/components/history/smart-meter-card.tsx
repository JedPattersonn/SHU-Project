"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
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
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Smart Meter Adoption</CardTitle>
        <CardDescription>
          Percentage of customers with smart meters
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
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
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="smartMeters"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                  activeDot={{ r: 6, fill: "hsl(var(--chart-2))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
