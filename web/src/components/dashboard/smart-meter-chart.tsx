"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { energyData } from "@/lib/db/schema";

type EnergyData = typeof energyData.$inferSelect;

const chartConfig = {
  HasSmart: {
    label: "Has Smart Meter",
    color: "rgb(0, 0, 0)",
  },
  NoSmart: {
    label: "No Smart Meter",
    color: "rgb(255, 255, 255)",
  },
} satisfies ChartConfig;

interface SmartMeterChartProps {
  data: EnergyData[];
  year: number;
}

export function SmartMeterChart({ data, year }: SmartMeterChartProps) {
  const chartData = React.useMemo(() => {
    let totalSmartMeters = 0;
    let totalConnections = 0;

    data.forEach((item) => {
      if (item.smartmeterPerc && item.numConnections) {
        const smartMeterCount = Math.round(
          (item.smartmeterPerc / 100) * item.numConnections
        );
        totalSmartMeters += smartMeterCount;
        totalConnections += item.numConnections;
      }
    });

    const smartMeterPercentage =
      totalConnections > 0
        ? Math.round((totalSmartMeters / totalConnections) * 100)
        : 0;
    const noSmartMeterPercentage = 100 - smartMeterPercentage;

    return [
      {
        browser: "HasSmart",
        visitors: smartMeterPercentage,
        fill: "var(--color-HasSmart)",
      },
      {
        browser: "NoSmart",
        visitors: noSmartMeterPercentage,
        fill: "var(--color-NoSmart)",
      },
    ];
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Smart Meter Distribution</CardTitle>
        <CardDescription>Year: {year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
              startAngle={0}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {chartData.find((item) => item.browser === "HasSmart")
                            ?.visitors || 0}
                          %
                        </tspan>
                        {/* <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Smart Meter Adoption
                        </tspan> */}
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
