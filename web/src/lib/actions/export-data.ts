"use server";

import { db } from "@/lib/db";
import { energyData } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const exportSchema = z.object({
  year: z.string(),
  type: z.enum(["gas", "electricity"]),
  userRole: z.enum(["city", "network"]),
  entityId: z.string(),
});

export async function exportEnergyData(formData: z.infer<typeof exportSchema>) {
  const { year, type, userRole, entityId } = exportSchema.parse(formData);

  const conditions = [];

  if (userRole === "city") {
    conditions.push(eq(energyData.cityId, entityId));
  } else if (userRole === "network") {
    conditions.push(eq(energyData.networkManagerId, entityId));
  }

  conditions.push(eq(energyData.type, type));

  if (year !== "all") {
    conditions.push(eq(energyData.year, parseInt(year)));
  }

  const data = await db
    .select()
    .from(energyData)
    .where(and(...conditions));

  if (!data || data.length === 0) {
    return { error: "No data found for the selected criteria" };
  }

  const headers = [
    "Purchase Area",
    "Street",
    "Zip Code From",
    "Zip Code To",
    "Number of Connections",
    "Delivery Percentage",
    "Percentage of Active Connections",
    "Type of Connection",
    "Type Connection Percentage",
    "Annual Consumption",
    "Annual Consumption Low Tariff Percentage",
    "Smart Meter Percentage",
    "Type",
    "Year",
  ];

  const rows = data.map((item) => [
    item.purchaseArea,
    item.street,
    item.zipCodeFrom,
    item.zipCodeTo,
    item.numConnections,
    item.deliveryPerc,
    item.percOfActiveConnections,
    item.typeOfConnection,
    item.typeConnPerc,
    item.annualConsume,
    item.annualConsumeLowTarifPerc,
    item.smartmeterPerc,
    item.type,
    item.year,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return { csvContent };
}

export async function getAvailableYears(
  userRole: "city" | "network",
  entityId: string
) {
  const conditions = [];

  if (userRole === "city") {
    conditions.push(eq(energyData.cityId, entityId));
  } else if (userRole === "network") {
    conditions.push(eq(energyData.networkManagerId, entityId));
  }

  const years = await db
    .select({ year: energyData.year })
    .from(energyData)
    .where(and(...conditions))
    .groupBy(energyData.year);

  return years
    .map((item) => item.year.toString())
    .sort((a, b) => parseInt(b) - parseInt(a));
}
