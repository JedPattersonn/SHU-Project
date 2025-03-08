import { betterAuth } from "better-auth";
import { twoFactor, admin, bearer } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

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
    sendResetPassword: async ({user, url, token}, request) => {
      console.log("Reset Password Link", url)
    }
  },
});
