import { AnomalyAlertCard } from "@/components/dashboard/anomaly-alert-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HighestConsumptionZipcodesCard } from "@/components/dashboard/highest-consumption-zipcodes";
import { SmartMeterChart } from "@/components/dashboard/smart-meter-chart";
import { ConnectionsChart } from "@/components/dashboard/avg-conn-chart";
import { EnergyChart } from "@/components/dashboard/chart";
import { db } from "@/lib/db";
import { city, energyData } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { number } from "better-auth";

export const metadata: Metadata = {
  title: "Dashboard | Energy Dashboard",
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const cityId = "56b085b2-7e5e-4982-bf58-297cfe5b3b3f";

  const resultsAnnualConsume = await db
    .select()
    .from(energyData)
    .where(eq(energyData.cityId, cityId));

  let totalAnnualConsume = 0;
  resultsAnnualConsume.map((result) => {
    totalAnnualConsume += result.annualConsume;
  });

  const resultsConnections = await db
    .select()
    .from(energyData)
    .where(eq(energyData.cityId, cityId));

  let totalConnections = 0;
  resultsConnections.map((result) => {
    totalConnections += result.numConnections;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Consumption"
          value={`${totalAnnualConsume} kwh`}
        />
        <StatCard
          title="Total Active Connections"
          value={`${totalConnections}`}
        />
        <StatCard title="Total Active Connections" value={`100`} />
        <StatCard title="Total Active Connections" value={`100`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* <AnomalyAlertCard /> */}
        <HighestConsumptionZipcodesCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <SmartMeterChart />
        <ConnectionsChart />
      </div>
    </div>
  );
}
