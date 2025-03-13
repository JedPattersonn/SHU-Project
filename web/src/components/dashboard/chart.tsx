"use client"

import { Bar, BarChart } from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"

import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"

<ChartLegend content={<ChartLegendContent nameKey="EnergyType" />} />


const chartData = [
  { EnergyType: "January", Electricity: 186, Gas: 80 },
  { EnergyType: "February", Electricity: 305, Gas: 200 },
  { EnergyType: "March", Electricity: 237, Gas: 120 },
  { EnergyType: "April", Electricity: 73, Gas: 190 },
  { EnergyType: "May", Electricity: 209, Gas: 130 },
  { EnergyType: "June", Electricity: 214, Gas: 140 },
]

const chartConfig = {
  electricity: {
    label: "Electricity",
    color: "#2563eb",
  },
  gas: {
    label: "Gas",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function EnergyChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <Bar dataKey="Electricity" fill="var(--color-electricity)" radius={4} />
        <Bar dataKey="Gas" fill="var(--color-gas)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
