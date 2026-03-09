import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session missing" }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.hostId !== userId && session.guestId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.message.updateMany({
      where: {
        sessionId,
        senderId: { not: userId },
        isRead: false
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Read error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}