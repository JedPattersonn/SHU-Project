import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ClientLayout } from "./client-layout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { user as UserSchema } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const user = await db.select().from(UserSchema).where(eq(UserSchema.id, session.user.id));


  return (
    <SidebarProvider>
      <AppSidebar user={user[0]} />
      <SidebarInset>
        <ClientLayout />
        <div className="flex-1 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
