import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = Number(
      req.nextUrl.searchParams.get("sessionId")
    );

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

    const messages = await prisma.message.findMany({
      where: { sessionId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json({ messages });

  } catch (err) {
    console.error("Messages error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}