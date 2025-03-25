import { city, networkManager, user as UserSchema } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { UsersTable } from "@/components/users/users-table";
import { NewUserDialog } from "@/components/users/new-user-dialog";
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
    <div>
      <NewUserDialog data={data} />
      <UsersTable users={users} />
    </div>
  );
}
