import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.match(/admin_token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json({ admin: null });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ admin: null });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({ admin });
  } catch {
    return NextResponse.json({ admin: null });
  }
}
