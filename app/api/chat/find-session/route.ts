import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(req: Request) {

  try {

    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserParam = searchParams.get("userId");

    if (!otherUserParam) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const otherUserId = Number(otherUserParam);

    if (isNaN(otherUserId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: {
        OR: [
          {
            hostId: userId,
            guestId: otherUserId,
          },
          {
            hostId: otherUserId,
            guestId: userId,
          },
        ],
      },
     orderBy: {
  updatedAt: "desc"
},
    });

    return NextResponse.json({ session });

  } catch (error) {

    console.error("find-session error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}