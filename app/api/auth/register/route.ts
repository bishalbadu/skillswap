import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "Registration successful!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
