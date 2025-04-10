"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function updatePassword(
  currentPassword: string,
  newPassword: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const ctx = await auth.$context;

  const hash = await ctx.password.hash(newPassword);

  await ctx.internalAdapter.updatePassword(session.user.id, hash);

  await db
    .update(user)
    .set({ hasChangedPassword: true })
    .where(eq(user.id, session.user.id));

  return {
    success: true,
    error: null,
  };
}
