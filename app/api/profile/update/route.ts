import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const { firstName, lastName, bio, avatar } = await req.json();

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        bio,
        avatar,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
