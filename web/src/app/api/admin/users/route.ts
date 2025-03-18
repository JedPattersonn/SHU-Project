import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function POST(request: NextRequest) {

    const body = await request.json()

    const {name, email, password} = body

    const user = await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
            role: "user"
        }
    })

    await auth.api.enableTwoFactor({
        body: {
            password
        },
        headers:{
            Authorization: `Bearer ${user.token}`
        }
    })

    return NextResponse.json({
        success: true
    })

}