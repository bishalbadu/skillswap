import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  // ❗ DEV ONLY SAFETY
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "FORBIDDEN" },
      { status: 403 }
    );
  }

  const email = "admin@skillswap.com";
  const password = "admin@123";

  const existing = await prisma.admin.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json({
      message: "Admin already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  return NextResponse.json({
    message: "Admin created successfully",
    email,
    password, // shown ONCE for dev
  });
}
