import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies(); // ✅ FIX
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = Number(decoded.id);
    const notifId = Number(params.id);

    const notif = await prisma.notification.findUnique({
      where: { id: notifId },
    });

    if (!notif || notif.userId !== userId) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    await prisma.notification.update({
      where: { id: notifId },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("NOTIFICATION PATCH ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
