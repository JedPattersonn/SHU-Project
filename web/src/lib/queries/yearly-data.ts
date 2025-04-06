import { db } from "../db";
import { energyData } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export async function getYearlyData() {
  const cityId = "56b085b2-7e5e-4982-bf58-297cfe5b3b3f";

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
    .where(eq(energyData.cityId, cityId))
    .groupBy(energyData.year)
    .orderBy(energyData.year);

  return yearlyData;
}
