import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ FIX
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = Number(decoded.id);

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    console.error("NOTIFICATION GET ERROR:", err);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}
