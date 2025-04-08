import { db } from "../db";
import { energyData } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export async function getYearlyData(userRole?: string, entityId?: string) {
  const yearlyData = await db
    .select({
      year: energyData.year,
      totalConsumption: sql<number>`SUM(${energyData.annualConsume})`,
      avgSmartMeterPerc: sql<number>`AVG(${energyData.smartmeterPerc})`,
      totalConnections: sql<number>`SUM(${energyData.numConnections})`,
      avgDeliveryPerc: sql<number>`AVG(${energyData.deliveryPerc})`,
      avgActiveConnectionsPerc: sql<number>`AVG(${energyData.percOfActiveConnections})`,
    })
    .from(energyData)
    .where(
      userRole === "city" && entityId
        ? eq(energyData.cityId, entityId)
        : userRole === "network" && entityId
          ? eq(energyData.networkManagerId, entityId)
          : undefined
    )
    .groupBy(energyData.year)
    .orderBy(energyData.year);

  return yearlyData;
}
