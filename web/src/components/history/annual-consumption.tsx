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

interface AnnualConsumptionCardProps {
  data: {
    year: number;
    totalConsumption: number;
  }[];
}

export function AnnualConsumptionCard({ data }: AnnualConsumptionCardProps) {
  const chartData = data.map((item) => ({
    year: item.year.toString(),
    consumption: Math.round(item.totalConsumption),
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Annual Consumption</CardTitle>
        <CardDescription>Yearly energy consumption in kWh</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ChartContainer
            config={{
              consumption: {
                label: "Consumption (kWh)",
                color: "hsl(var(--chart-1))",
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
                  bottom: 50,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorConsumption"
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
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={0.4}
                  fill="url(#colorElectricity)"
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
