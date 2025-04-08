"use server";

import { db } from "@/lib/db";
import { energyData } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { enrichEnergyDataWithCoordinates } from "@/lib/utils/postal-code";

export async function fetchEnergyData(
  selection: {
    type: "city" | "network";
    id: string;
  } | null
) {
  if (!selection) {
    return [];
  }

  let data;
  if (selection.type === "city") {
    data = await db
      .select()
      .from(energyData)
      .where(eq(energyData.cityId, selection.id));
  } else {
    data = await db
      .select()
      .from(energyData)
      .where(eq(energyData.networkManagerId, selection.id));
  }

  return enrichEnergyDataWithCoordinates(data);
}
