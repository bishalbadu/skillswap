import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: {
        OR: [
          { hostId: userId },
          { guestId: userId }
        ]
      },
      orderBy: {
        updatedAt: "desc"
      },
      include: {
        host: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    const conversationsMap = new Map();

    for (const session of sessions) {
      const otherUser =
        session.hostId === userId
          ? session.guest
          : session.host;

      // Skip if we already created a conversation for this user
      if (conversationsMap.has(otherUser.id)) continue;

      const unreadCount = await prisma.message.count({
        where: {
          sessionId: session.id,
          senderId: { not: userId },
          isRead: false
        }
      });

      conversationsMap.set(otherUser.id, {
        sessionId: session.id,
        otherUser,
        lastMessage: session.messages[0]?.content || "",
        unread: unreadCount
      });
    }

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ conversations });

  } catch (err) {
    console.error("Conversation route error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}