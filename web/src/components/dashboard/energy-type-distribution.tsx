import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface EnergyTypeData {
  type: string;
  consumption: number;
}

interface EnergyTypeDistributionProps {
  data: EnergyTypeData[];
  year: number;
}

const COLORS = ["#0088FE", "#00C49F"];

export function EnergyTypeDistribution({
  data,
  year,
}: EnergyTypeDistributionProps) {
  // Format data for the pie chart
  const chartData = data.map((item) => ({
    name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    value: item.consumption,
  }));

  // Calculate total consumption
  const totalConsumption = data.reduce(
    (sum, item) => sum + item.consumption,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Consumption by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString()} kWh`,
                  "Consumption",
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Total: {totalConsumption.toLocaleString()} kWh ({year})
        </div>
      </CardContent>
    </Card>
  );
}
