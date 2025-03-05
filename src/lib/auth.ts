import { betterAuth } from "better-auth";
import { twoFactor, admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  plugins: [twoFactor(), admin()],
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
