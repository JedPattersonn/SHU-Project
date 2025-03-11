import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["admin", "user"]),
});

export async function POST(request: Request) {
  const { email, password, name, role } = await request.json();

  const parsed = createUserSchema.safeParse({ email, password, name, role });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  try {
    const user = await auth.api.signUpEmail({
      body: parsed.data,
    });

    await auth.api.enableTwoFactor({
      body: {
        password: parsed.data.password,
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
