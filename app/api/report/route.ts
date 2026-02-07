import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];
    if (!token) {
      return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const { reportedUserId, reason, message } = await req.json();

    if (!reportedUserId || !reason || !message) {
      return NextResponse.json(
        { error: "ALL_FIELDS_REQUIRED" },
        { status: 400 }
      );
    }

    if (reportedUserId === decoded.id) {
      return NextResponse.json(
        { error: "CANNOT_REPORT_SELF" },
        { status: 400 }
      );
    }

    await prisma.report.create({
      data: {
        reporterId: decoded.id,
        reportedUserId,
        reason,
        message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("REPORT USER ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
