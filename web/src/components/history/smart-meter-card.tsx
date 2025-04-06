"use client";
import {
  AreaChart,
  Area,
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
                    id="colorSmartMeters"
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
                  tickFormatter={(value) => `${value}%`}
                  width={60}
                  domain={[0, 100]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="smartMeters"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={0.4}
                  fill="url(#colorSmartMeters)"
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
