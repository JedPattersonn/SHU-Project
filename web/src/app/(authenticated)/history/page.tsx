import { AnnualConsumptionCard } from "@/components/history/annual-consumption";
import { SmartMeterCard } from "@/components/history/smart-meter-card";
import { ConnectionsCard } from "@/components/history/connections-card";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getYearlyData } from "@/lib/queries/yearly-data";

export const metadata: Metadata = {
  title: "History | Energy Dashboard",
};

export default async function HistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const yearlyData = await getYearlyData();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnnualConsumptionCard data={yearlyData} />
      <SmartMeterCard data={yearlyData} />
      <ConnectionsCard data={yearlyData} />
    </div>
  );
}
