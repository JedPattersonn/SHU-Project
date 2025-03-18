import { AnomalyAlertCard } from "@/components/dashboard/anomaly-alert-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HighestConsumptionZipcodesCard } from "@/components/dashboard/highest-consumption-zipcodes";

export const metadata: Metadata = {
  title: "Dashboard | Energy Dashboard",
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Active Connections" value={100} />
        <StatCard title="Total Active Connections" value={100} />
        <StatCard title="Total Active Connections" value={100} />
        <StatCard title="Total Active Connections" value={100} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnomalyAlertCard />
        <HighestConsumptionZipcodesCard />
      </div>
    </div>
  );
}
