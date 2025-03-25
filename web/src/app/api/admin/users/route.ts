import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
