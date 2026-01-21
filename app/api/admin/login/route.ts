import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    /* ============================
       BASIC VALIDATION
    ============================ */
    if (!email || !password) {
      return NextResponse.json(
        { error: "EMAIL_AND_PASSWORD_REQUIRED" },
        { status: 400 }
      );
    }

    /* ============================
       FIND ADMIN
    ============================ */
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    /* ============================
       PASSWORD CHECK
    ============================ */
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json(
        { error: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    /* ============================
       CREATE ADMIN JWT (NAMESPACED)
    ============================ */
    const token = jwt.sign(
      {
        adminId: admin.id,     // ✅ explicit admin id
        role: "ADMIN",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    /* ============================
       SET COOKIE
    ============================ */
    const res = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "LOGIN_FAILED" },
      { status: 500 }
    );
  }
}
