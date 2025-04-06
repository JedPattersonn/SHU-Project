import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { city, networkManager } from "@/lib/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CitiesList } from "@/components/data/cities-list";
import { NetworksList } from "@/components/data/networks-list";

export const metadata: Metadata = {
  title: "Data | Energy Dashboard",
};

export default async function DataPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    redirect("/");
  }

  // Fetch data from tables
  const cities = await db.select().from(city);
  const networks = await db.select().from(networkManager);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Energy Data</CardTitle>
          <CardDescription>
            View and manage energy data for cities and networks. This page is
            only accessible to administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Cities</h2>
              <CitiesList cities={cities} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Network Managers</h2>
              <NetworksList networks={networks} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
