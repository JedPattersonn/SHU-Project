import { db } from "./db";
import { user, city, networkManager, energyData } from "./db/schema";
import { parse } from "csv-parse/sync";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

interface CsvRow {
  net_manager: string;
  purchase_area: string;
  street: string;
  zipcode_from: string;
  zipcode_to: string;
  city: string;
  num_connections: string;
  delivery_perc: string;
  perc_of_active_connections: string;
  type_conn_perc: string;
  type_of_connection: string;
  annual_consume: string;
  annual_consume_lowtarif_perc: string;
  smartmeter_perc: string;
}

const BATCH_SIZE = 500;

async function validateAndInsertData(
  rows: CsvRow[],
  year: number,
  energyType: "gas" | "electricity"
) {
  console.log(`Processing ${rows.length} records...`);

  const uniqueCities = new Set<string>();
  const uniqueNetworkManagers = new Set<string>();

  rows.forEach((row) => {
    uniqueCities.add(row.city);
    uniqueNetworkManagers.add(row.net_manager);
  });

  console.log(
    `Found ${uniqueCities.size} unique cities and ${uniqueNetworkManagers.size} unique network managers`
  );

  const cityMap = new Map<string, string>();

  const existingCities = await db.select().from(city);
  const existingCityNames = new Set(existingCities.map((c) => c.name));

  const newCities = Array.from(uniqueCities).filter(
    (cityName) => !existingCityNames.has(cityName)
  );

  console.log(
    `Found ${existingCities.length} existing cities, ${newCities.length} new cities to insert`
  );

  existingCities.forEach((cityData) => {
    cityMap.set(cityData.name, cityData.id);
  });

  if (newCities.length > 0) {
    const cityBatches = newCities.map((cityName) => ({
      id: uuidv4(),
      name: cityName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    console.log(`Inserting ${cityBatches.length} new cities...`);
    for (let i = 0; i < cityBatches.length; i += BATCH_SIZE) {
      const batch = cityBatches.slice(i, i + BATCH_SIZE);
      await db.insert(city).values(batch);
      batch.forEach((cityData) => cityMap.set(cityData.name, cityData.id));
      console.log(
        `Inserted cities batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(cityBatches.length / BATCH_SIZE)}`
      );
    }
  }

  const networkManagerMap = new Map<string, string>();

  const existingNetworkManagers = await db.select().from(networkManager);
  const existingNetworkManagerNames = new Set(
    existingNetworkManagers.map((nm) => nm.name)
  );

  const newNetworkManagers = Array.from(uniqueNetworkManagers).filter(
    (managerName) => !existingNetworkManagerNames.has(managerName)
  );

  console.log(
    `Found ${existingNetworkManagers.length} existing network managers, ${newNetworkManagers.length} new ones to insert`
  );

  existingNetworkManagers.forEach((managerData) => {
    networkManagerMap.set(managerData.name, managerData.id);
  });

  if (newNetworkManagers.length > 0) {
    const networkManagerBatches = newNetworkManagers.map((managerName) => ({
      id: uuidv4(),
      name: managerName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    console.log(
      `Inserting ${networkManagerBatches.length} new network managers...`
    );
    for (let i = 0; i < networkManagerBatches.length; i += BATCH_SIZE) {
      const batch = networkManagerBatches.slice(i, i + BATCH_SIZE);
      await db.insert(networkManager).values(batch);
      batch.forEach((managerData) =>
        networkManagerMap.set(managerData.name, managerData.id)
      );
      console.log(
        `Inserted network managers batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(networkManagerBatches.length / BATCH_SIZE)}`
      );
    }
  }

  const validEnergyDataRows = [];
  let skippedRows = 0;

  for (const row of rows) {
    const numConnections = parseFloat(row.num_connections);
    const deliveryPerc = parseFloat(row.delivery_perc);
    const percOfActiveConnections = parseFloat(row.perc_of_active_connections);
    const typeConnPerc = parseFloat(row.type_conn_perc);
    const annualConsume = parseFloat(row.annual_consume);
    const annualConsumeLowTarifPerc = parseFloat(
      row.annual_consume_lowtarif_perc
    );
    const smartmeterPerc = parseFloat(row.smartmeter_perc);

    if (
      !row.purchase_area ||
      !row.street ||
      !row.zipcode_from ||
      !row.zipcode_to ||
      !row.type_of_connection
    ) {
      skippedRows++;
      continue;
    }

    if (
      isNaN(numConnections) ||
      isNaN(deliveryPerc) ||
      isNaN(percOfActiveConnections) ||
      isNaN(typeConnPerc) ||
      isNaN(annualConsume) ||
      isNaN(annualConsumeLowTarifPerc) ||
      isNaN(smartmeterPerc)
    ) {
      skippedRows++;
      continue;
    }

    validEnergyDataRows.push({
      id: uuidv4(),
      cityId: cityMap.get(row.city)!,
      networkManagerId: networkManagerMap.get(row.net_manager)!,
      purchaseArea: row.purchase_area,
      street: row.street,
      zipCodeFrom: row.zipcode_from,
      zipCodeTo: row.zipcode_to,
      numConnections,
      deliveryPerc,
      percOfActiveConnections,
      typeOfConnection: row.type_of_connection,
      typeConnPerc,
      annualConsume,
      annualConsumeLowTarifPerc,
      smartmeterPerc,
      type: energyType,
      year: year,
    });
  }

  console.log(
    `Prepared ${validEnergyDataRows.length} valid energy data records (skipped ${skippedRows} invalid rows)`
  );

  console.log(`Inserting ${validEnergyDataRows.length} energy data records...`);
  for (let i = 0; i < validEnergyDataRows.length; i += BATCH_SIZE) {
    const batch = validEnergyDataRows.slice(i, i + BATCH_SIZE);
    await db.insert(energyData).values(batch);
    console.log(
      `Inserted energy data batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(validEnergyDataRows.length / BATCH_SIZE)}`
    );
  }

  console.log(
    `Data import completed. Inserted ${newCities.length} new cities, ${newNetworkManagers.length} new network managers, and ${validEnergyDataRows.length} energy data records.`
  );
}

async function main() {
  try {
    const year = 2020;
    const energyType = "gas" as const;
    console.log(`Starting data import for year ${year} (${energyType})...`);

    const csvContent = await Bun.file("data.csv").text();
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`Parsed ${records.length} records from CSV`);
    await validateAndInsertData(records, year, energyType);
  } catch (error) {
    console.error("Error importing data:", error);
  }
}

main();
