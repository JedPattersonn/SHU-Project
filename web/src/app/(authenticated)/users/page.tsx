import { city, networkManager, user as UserSchema } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { UsersTable } from "@/components/users/users-table";
import { NewUserDialog } from "@/components/users/new-user-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default async function UsersPage() {
  const users = await db
    .select({
      id: UserSchema.id,
      name: UserSchema.name,
      email: UserSchema.email,
      role: UserSchema.role,
    })
    .from(UserSchema);

  const cities = await db.select().from(city);
  const networks = await db.select().from(networkManager);

  const data = [
    ...cities.map((city) => ({
      name: city.name,
      id: city.id,
      type: "city" as const,
    })),
    ...networks.map((network) => ({
      name: network.name,
      id: network.id,
      type: "network" as const,
    })),
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all users in the system
          </p>
        </div>
        <NewUserDialog data={data} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            A list of all users in the system with their details and actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
