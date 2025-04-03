import React, { Suspense } from "react";
import InteractiveHeatMap from "@/components/map/interactive-map";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { energyData } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { enrichEnergyDataWithCoordinates } from "@/lib/utils/postal-code";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Map | Energy Dashboard",
};

async function MapWithData() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const rawData = await db
    .select()
    .from(energyData)
    .where(eq(energyData.cityId, "56b085b2-7e5e-4982-bf58-297cfe5b3b3f"));
  const enrichedData = await enrichEnergyDataWithCoordinates(rawData);

  return <InteractiveHeatMap energyData={enrichedData} />;
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
