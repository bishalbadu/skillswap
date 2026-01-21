
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 400 }
      );
    }

    // 🔐 2.5️⃣ Block login if email not verified (EMAIL USERS ONLY)
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error:
            "Please verify your email before logging in. Check your inbox.",
        },
        { status: 403 }
      );
    }

    // 3️⃣ Block Google-only accounts
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            "This account uses Google Sign-In. Please continue with Google.",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 400 }
      );
    }

    // 5️⃣ Generate JWT
   const token = jwt.sign(
  { id: Number(user.id) }, 
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

    // 6️⃣ Set cookie
    const res = NextResponse.json({ message: "Login successful" });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
