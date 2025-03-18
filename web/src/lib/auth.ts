import { betterAuth } from "better-auth";
import { twoFactor, admin, bearer } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const auth = betterAuth({
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          console.log("Sending OTP to user", user.email, "with OTP", otp);
        },
      },
      skipVerificationOnEnable: true,
    }),
    admin(),
    bearer(),
  ],
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});

export async function checkUserAccess(pageType: "admin" | "user") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, session.user.id));

  if (pageType === "admin" && user[0].role !== "admin") {
    redirect("/");
  } else if (pageType === "user" && user[0].role === "admin") {
    redirect("/users");
  }

  return user[0];
}
