import { db } from "./db";
import { user, city, networkManager, energyData } from "./db/schema";
import { parse } from "csv-parse/sync";
import { v4 as uuidv4 } from "uuid";

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

async function validateAndInsertData(rows: CsvRow[], year: number) {
  const cityMap = new Map<string, string>();
  const networkManagerMap = new Map<string, string>();

  for (const row of rows) {
    if (!cityMap.has(row.city)) {
      const cityId = uuidv4();
      await db.insert(city).values({
        id: cityId,
        name: row.city,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      cityMap.set(row.city, cityId);
    }

    if (!networkManagerMap.has(row.net_manager)) {
      const networkManagerId = uuidv4();
      await db.insert(networkManager).values({
        id: networkManagerId,
        name: row.net_manager,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      networkManagerMap.set(row.net_manager, networkManagerId);
    }
  }

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
      console.error(
        `Skipping row due to missing required fields: ${JSON.stringify(row)}`
      );
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
      console.error(
        `Skipping row due to invalid numeric values: ${JSON.stringify(row)}`
      );
      continue;
    }

    try {
      await db.insert(energyData).values({
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
        type: "electricity",
        year: year,
      });
    } catch (error) {
      console.error(`Error inserting row: ${JSON.stringify(row)}`, error);
    }
  }
}

async function main() {
  try {
    const year = 2016;

    const csvContent = await Bun.file("data.csv").text();
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    await validateAndInsertData(records, year);
    console.log("Data import completed successfully");
  } catch (error) {
    console.error("Error importing data:", error);
  }
}

main();
