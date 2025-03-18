import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHighestConsumptionZipcodes } from "@/lib/queries/highest-consumption";

export async function HighestConsumptionZipcodesCard() {
  const highestConsumptionZipcodes = await getHighestConsumptionZipcodes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Highest Consumption Zipcodes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {highestConsumptionZipcodes.map((zipcode) => (
                <div key={zipcode.zipCodeTo}>
                  {zipcode.zipCodeTo} - {zipcode.annualConsume}
                </div>
              ))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
