import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { city, energyData, networkManager } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CityEnergyData } from "@/components/data/city-energy-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "City Energy Data | Energy Dashboard",
};

interface CityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CityDetailPage(props: CityDetailPageProps) {
  const params = await props.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const cityId = params.id;

  const cityData = await db
    .select()
    .from(city)
    .where(eq(city.id, cityId))
    .then((res) => res[0]);

  if (!cityData) {
    redirect("/data");
  }

  const cityEnergyData = await db
    .select()
    .from(energyData)
    .where(eq(energyData.cityId, cityId));

  const networkManagers = await db.select().from(networkManager);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/data">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Data
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{cityData.name} Energy Data</CardTitle>
          <CardDescription>
            View and manage energy data for {cityData.name}. This page is only
            accessible to administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CityEnergyData
            cityName={cityData.name}
            energyData={cityEnergyData}
            networkManagers={networkManagers}
          />
        </CardContent>
      </Card>
    </div>
  );
}
