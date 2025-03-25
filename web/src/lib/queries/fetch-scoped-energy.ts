import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function fetchUserType() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  return {
    role: session.user.userRole as "city" | "network",
    entityId: session.user.entityId,
  };
}
