"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
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
    <Card>
      <CardHeader>
        <CardTitle>Annual Consumption</CardTitle>
        <CardDescription>Yearly energy consumption in kWh</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            consumption: {
              label: "Consumption (kWh)",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area dataKey="consumption" type="monotone" fillOpacity={0.4} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
