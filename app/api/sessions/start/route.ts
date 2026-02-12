import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ error: "SESSION_ID_REQUIRED" }, { status: 400 });

  const session = await prisma.session.findUnique({
    where: { id: Number(sessionId) },
    include: { skill: true },
  });

  if (!session) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  // ✅ Only host can start
  if (session.hostId !== user.id) {
    return NextResponse.json({ error: "ONLY_HOST_CAN_START" }, { status: 403 });
  }

  if (session.status !== "UPCOMING") {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const roomName = `SkillSwap-Session-${session.id}`;

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: {
      status: "LIVE",
      meetingRoom: roomName,
      startedAt: new Date(),
    },
  });

  // notify guest
  await prisma.notification.create({
    data: {
      userId: session.guestId,
      type: "MEETING_LINK_SHARED",
      title: "Class is started",
      message: `Your session is live now. You can join the class.`,
      link: "/dashboard/skillmeet",

    },
  });

  return NextResponse.json({ success: true, session: updated });
}
