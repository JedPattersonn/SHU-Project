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

//decides the colour and what the label says
const chartConfig = {
  Delivered: {
    label: "Delivered",
    color: "rgb(0, 0, 0)",
  },
  NotDelivered: {
    label: "Not Delivered",
    color: "rgb(255, 255, 255)",
  },
} satisfies ChartConfig;

interface DeliveryPercentagePieChartProps {
  data: EnergyData[];
  year: number;
}

export function DeliveryPercentagePieChart({
  data,
  year,
}: DeliveryPercentagePieChartProps) {
  const chartData = React.useMemo(() => {
    let totalDelivered = 0;
    let totalConnections = 0;

    data.forEach((item) => {
      if (item.deliveryPerc && item.numConnections) {
        const deliveredCount = Math.round(
          (item.deliveryPerc / 100) * item.numConnections
        );
        totalDelivered += deliveredCount;
        totalConnections += item.numConnections;
      }
    });

    const deliveredPercentage =
      totalConnections > 0
        ? Math.round((totalDelivered / totalConnections) * 100)
        : 0;
    const notDeliveredPercentage = 100 - deliveredPercentage;

    return [
      {
        browser: "Delivered",
        visitors: deliveredPercentage,
        fill: "var(--color-Delivered)",
      },
      {
        browser: "NotDelivered",
        visitors: notDeliveredPercentage,
        fill: "var(--color-NotDelivered)",
      },
    ];
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Energy Delivery Distribution</CardTitle>
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
              {/*centers the label in the middle of the chart*/}
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
                          {chartData.find(
                            (item) => item.browser === "Delivered"
                          )?.visitors || 0}
                          %
                        </tspan>
                        {/* <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Energy Delivered
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
