import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ZipcodeData {
  zipCode: string;
  consumption: number;
}

interface HighestConsumptionZipcodesCardProps {
  zipcodes: ZipcodeData[];
  year: number;
}

export function HighestConsumptionZipcodesCard({
  zipcodes,
  year,
}: HighestConsumptionZipcodesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Highest Consumption Zipcodes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground">
              {zipcodes.map((zipcode, index) => (
                <div key={index} className="flex justify-between py-1 border-b">
                  <span>{zipcode.zipCode}</span>
                  <span>{zipcode.consumption.toLocaleString()} kWh</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Data from {year}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
