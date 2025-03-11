import { AnomalyAlertCard } from "@/components/dashboard/anomaly-alert-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard"
}

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
    <AnomalyAlertCard />
    </div>
  );
}
