import React, { Suspense } from "react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { energyData, city, networkManager } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { enrichEnergyDataWithCoordinates } from "@/lib/utils/postal-code";
import Loading from "./loading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MapContainer } from "@/components/map/map-container";

export const metadata: Metadata = {
  title: "Map | Energy Dashboard",
};

async function MapWithData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { userRole, entityId, role } = session.user;

  const cities = await db.select().from(city);
  const networks = await db.select().from(networkManager);

  // First, find the most recent year in the energy data
  const mostRecentYearResult = await db
    .select({ maxYear: sql<number>`MAX(${energyData.year})` })
    .from(energyData);

  const mostRecentYear = mostRecentYearResult[0].maxYear;

  let rawData: (typeof energyData.$inferSelect)[] = [];
  if (userRole === "city") {
    rawData = await db
      .select()
      .from(energyData)
      .where(
        sql`${energyData.cityId} = ${entityId} AND ${energyData.year} = ${mostRecentYear}`
      );
  } else if (userRole === "network") {
    rawData = await db
      .select()
      .from(energyData)
      .where(
        sql`${energyData.networkManagerId} = ${entityId} AND ${energyData.year} = ${mostRecentYear}`
      );
  }

  const enrichedData = await enrichEnergyDataWithCoordinates(rawData);

  return (
    <MapContainer
      initialData={enrichedData}
      cities={cities}
      networks={networks}
      isAdmin={role === "admin"}
    />
  );
}

export default function Map() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <MapWithData />
      </Suspense>
    </div>
  );
}
