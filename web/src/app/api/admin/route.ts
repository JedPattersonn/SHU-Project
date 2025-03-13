import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

// const createUserSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
//   name: z.string().min(1),
//   role: z.enum(["admin", "user"]),
// });

export async function GET(request: Request) {
  
  const email = "admin@gmail.com"
  const password = "password"
  const name = "John Doe Admin"
  const role = "admin"

  try {
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role,
      },
    });

    await auth.api.enableTwoFactor({
      body: {
        password: password,
      },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
