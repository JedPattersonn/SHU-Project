import { energyData } from '@/lib/db/schema';

interface PDOKResponse {
  response: {
    docs: Array<{
      centroide_ll: string;
      straatnaam: string;
      woonplaatsnaam: string;
    }>;
  };
}

const PDOK_CACHE: Record<string, [number, number]> = {};

// Fallback coordinates for Dutch postal codes based on region
const FALLBACK_COORDINATES: Record<string, [number, number]> = {
  "76": [52.3567, 6.6626], // Almelo region
  "77": [52.2215, 6.8937], // Enschede region
  "74": [52.2167, 6.9000], // Hengelo region
  "75": [52.2583, 6.7917], // Borne region
  "default": [52.1326, 5.2913], // Center of Netherlands
};

function getFallbackCoordinates(postalCode: string): [number, number] {
  const prefix = postalCode.substring(0, 2);
  return FALLBACK_COORDINATES[prefix] || FALLBACK_COORDINATES.default;
}

export async function getCoordinatesForPostalCode(postalCode: string): Promise<[number, number]> {
  try {
    if (PDOK_CACHE[postalCode]) {
      return PDOK_CACHE[postalCode];
    }

    const formattedPostcode = postalCode.replace(/\s+/g, '').toUpperCase();
    
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${formattedPostcode}&fq=type:postcode`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'EnergyDashboard/1.0'
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    );

    if (!response.ok) {
      throw new Error(`PDOK API error: ${response.statusText}`);
    }

    const data: PDOKResponse = await response.json();

    if (!data.response.docs || data.response.docs.length === 0) {
      return getFallbackCoordinates(postalCode);
    }

    const match = data.response.docs[0].centroide_ll.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    
    if (!match) {
      return getFallbackCoordinates(postalCode);
    }

    const coordinates: [number, number] = [parseFloat(match[2]), parseFloat(match[1])];
    
    PDOK_CACHE[postalCode] = coordinates;
    
    return coordinates;
  } catch (error) {
    console.warn(`Using fallback coordinates for postal code ${postalCode}:`, error);
    return getFallbackCoordinates(postalCode);
  }
}

export type EnergyDataWithCoordinates = typeof energyData.$inferSelect & {
  coordinates: [number, number];
};

export async function enrichEnergyDataWithCoordinates(data: typeof energyData.$inferSelect[]): Promise<EnergyDataWithCoordinates[]> {
  const postalCodeGroups = new Map<string, typeof energyData.$inferSelect[]>();
  
  data.forEach(item => {
    const existing = postalCodeGroups.get(item.zipCodeFrom) || [];
    postalCodeGroups.set(item.zipCodeFrom, [...existing, item]);
  });

  const enrichedData: EnergyDataWithCoordinates[] = [];
  
  const batchSize = 500;
  const batches = Array.from(postalCodeGroups.entries()).reduce((acc, _, i) => {
    if (i % batchSize === 0) acc.push([]);
    acc[acc.length - 1].push(_);
    return acc;
  }, [] as Array<[string, typeof energyData.$inferSelect[]][]>);

  for (const batch of batches) {
    const batchResults = await Promise.all(
      batch.map(async ([postalCode, items]) => {
        const coordinates = await getCoordinatesForPostalCode(postalCode);
        return items.map(item => ({
          ...item,
          coordinates,
        }));
      })
    );

    enrichedData.push(...batchResults.flat());
  }

  return enrichedData;
} 