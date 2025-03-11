import { StatCard } from "@/components/dashboard/stat-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Active Connections" value={100} />
      <StatCard title="Total Active Connections" value={100} />
      <StatCard title="Total Active Connections" value={100} />
      <StatCard title="Total Active Connections" value={100} />
    </div>
  );
}
