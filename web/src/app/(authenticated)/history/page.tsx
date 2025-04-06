import { AnnualConsumptionCard } from "@/components/history/annual-consumption";
import { SmartMeterCard } from "@/components/history/smart-meter-card";
import { ConnectionsCard } from "@/components/history/connections-card";
import { EnergySummaryCard } from "@/components/history/energy-summary-card";
import { EnergyTypeComparisonCard } from "@/components/history/energy-type-comparison-card";
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

  const userRole = session.user.userRole as "city" | "network";
  const entityId = session.user.entityId;

  const yearlyData = await getYearlyData(userRole, entityId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Energy History</h1>
        <p className="text-muted-foreground">
          Historical data and trends for energy consumption and connections
        </p>
      </div>

      <EnergySummaryCard data={yearlyData} />

      <div className="grid gap-6 md:grid-cols-2">
        <AnnualConsumptionCard data={yearlyData} />
        <SmartMeterCard data={yearlyData} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ConnectionsCard data={yearlyData} />
        <EnergyTypeComparisonCard data={yearlyData} />
      </div>
    </div>
  );
}
