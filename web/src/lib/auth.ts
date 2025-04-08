import { betterAuth } from "better-auth";
import { twoFactor, admin, bearer } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import OTPEmail from "@/components/emails/otp";
import ResetPasswordEmail from "@/components/emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  plugins: [
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          console.log("Sending OTP to user", user.email, "with OTP", otp);

          const { error } = await resend.emails.send({
            from: "no-reply@emails.jedpatterson.com",
            to: user.email,
            subject: "Your One-Time Password",
            react: OTPEmail({ otp, firstName: user.name.split(" ")[0] }),
          });

          if (error) {
            console.error("Error sending OTP", error);
          }
        },
        period: 10,
      },
      skipVerificationOnEnable: true,
    }),
    admin(),
    bearer(),
  ],
  user: {
    additionalFields: {
      entityId: {
        type: "string",
        required: true,
      },
      userRole: {
        type: "string",
        required: true,
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(
        "Sending reset password email to",
        user.email,
        "with URL",
        url
      );

      const { error } = await resend.emails.send({
        from: "no-reply@emails.jedpatterson.com",
        to: user.email,
        subject: "Reset Your Password",
        react: ResetPasswordEmail({
          firstName: user.name.split(" ")[0],
          resetLink: url,
        }),
      });

      if (error) {
        console.error("Error sending reset password email", error);
      }
    },
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
