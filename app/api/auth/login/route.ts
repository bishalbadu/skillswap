import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
    }

    return NextResponse.json({ message: "Login successful!", user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
