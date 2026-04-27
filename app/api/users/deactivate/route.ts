import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeSessions = await prisma.session.findMany({
      where: {
        OR: [{ hostId: user.id }, { guestId: user.id }],
        status: { in: ["UPCOMING", "LIVE"] },
      },
    });

    if (activeSessions.length > 0) {
      return NextResponse.json(
        {
          error:
            "You have upcoming or active sessions. Finish or cancel them first.",
        },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}