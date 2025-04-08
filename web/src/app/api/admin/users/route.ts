import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import NewUserEmail from "@/components/emails/new-user";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, entityId, userRole } = body;

    if (!name || !email || !password || !entityId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "user",
        entityId,
        userRole,
      },
    });

    await auth.api.enableTwoFactor({
      body: {
        password,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const firstName = name.split(" ")[0];
    const { error } = await resend.emails.send({
      from: "no-reply@emails.jedpatterson.com",
      to: email,
      subject: "Your Smart Energy Dashboard account has been created",
      react: NewUserEmail({
        email,
        password,
        firstName,
      }),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
    }

    revalidatePath("/users");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
