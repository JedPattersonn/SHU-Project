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
  const chartData = data.map((item) => {
    const electricityConsumption =
      item.totalConsumption * (item.avgDeliveryPerc / 100);
    const gasConsumption =
      item.totalConsumption * ((100 - item.avgDeliveryPerc) / 100);

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
                    id="colorElectricity"
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
                  <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
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
                  axisLine={true}
                  tickMargin={12}
                  stroke="hsl(var(--border))"
                />
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={12}
                  stroke="hsl(var(--border))"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  width={65}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="electricity"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={0.4}
                  fill="url(#colorElectricity)"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="gas"
                  stroke="hsl(var(--chart-3))"
                  fillOpacity={0.4}
                  fill="url(#colorGas)"
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
