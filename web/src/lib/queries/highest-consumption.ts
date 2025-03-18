import { db } from "../db";
import { energyData } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export async function getHighestConsumptionZipcodes() {
  const cityId = "56b085b2-7e5e-4982-bf58-297cfe5b3b3f";

  const highestConsumptionZipcodes = await db
    .select()
    .from(energyData)
    .where(eq(energyData.cityId, cityId))
    .orderBy(desc(energyData.annualConsume))
    .limit(5);

  return highestConsumptionZipcodes;
}
