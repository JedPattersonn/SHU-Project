import { StatCard } from "@/components/dashboard/stat-card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HighestConsumptionZipcodesCard } from "@/components/dashboard/highest-consumption-zipcodes";
import { db } from "@/lib/db";
import { energyData, city } from "@/lib/db/schema";
import { eq, desc, max, and } from "drizzle-orm";
import { SmartMeterChart } from "@/components/dashboard/smart-meter-chart";
import { DeliveryPercentagePieChart } from "@/components/dashboard/delivery-percentage-chart";

type EnergyData = typeof energyData.$inferSelect;

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

  const userRole = session.user.userRole as "city" | "network";
  const entityId = session.user.entityId;

  // Get city name
  const cityData = await db
    .select({ name: city.name })
    .from(city)
    .where(
      userRole === "city" && entityId
        ? eq(city.id, entityId)
        : userRole === "network" && entityId
          ? eq(city.id, entityId)
          : undefined
    );

  const cityName = cityData[0]?.name || "Unknown City";

  // Get the most recent year for this city
  const maxYearResult = await db
    .select({ maxYear: max(energyData.year) })
    .from(energyData)
    .where(
      userRole === "city" && entityId
        ? eq(energyData.cityId, entityId)
        : userRole === "network" && entityId
          ? eq(energyData.networkManagerId, entityId)
          : undefined
    );

  const mostRecentYear = maxYearResult[0]?.maxYear || 0;

  // Get data for the most recent year
  const resultsAnnualConsume = await db
    .select()
    .from(energyData)
    .where(
      userRole === "city" && entityId
        ? eq(energyData.cityId, entityId)
        : userRole === "network" && entityId
          ? eq(energyData.networkManagerId, entityId)
          : undefined
    );

  let totalAnnualConsume = 0;
  resultsAnnualConsume.forEach((result: EnergyData) => {
    totalAnnualConsume += result.annualConsume;
  });

  // Calculate total connections for the most recent year
  let totalConnections = 0;
  resultsAnnualConsume.forEach((result: EnergyData) => {
    totalConnections += result.numConnections;
  });

  // Get top 5 zipcodes by consumption
  const topZipcodes = await db
    .select({
      zipCode: energyData.zipCodeFrom,
      consumption: energyData.annualConsume,
    })
    .from(energyData)
    .where(
      userRole === "city" && entityId
        ? eq(energyData.cityId, entityId)
        : userRole === "network" && entityId
          ? eq(energyData.networkManagerId, entityId)
          : undefined
    )
    .orderBy(desc(energyData.annualConsume))
    .limit(5);

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{cityName} Energy Dashboard</h1>
        <p className="text-muted-foreground">Data from {mostRecentYear}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Consumption"
          value={`${totalAnnualConsume.toLocaleString()} kwh`}
        />
        <StatCard
          title="Total Active Connections"
          value={`${totalConnections.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <HighestConsumptionZipcodesCard
          zipcodes={topZipcodes}
          year={mostRecentYear}
        />
        <SmartMeterChart data={resultsAnnualConsume} year={mostRecentYear} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <DeliveryPercentagePieChart
          data={resultsAnnualConsume}
          year={mostRecentYear}
        />
      </div>
    </div>
  );
}
