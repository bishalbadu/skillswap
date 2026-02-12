import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ error: "SESSION_ID_REQUIRED" }, { status: 400 });

  const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
  if (!session) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  if (session.hostId !== user.id) {
    return NextResponse.json({ error: "ONLY_HOST_CAN_END" }, { status: 403 });
  }

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: { status: "COMPLETED", endedAt: new Date() },
  });

  return NextResponse.json({ success: true, session: updated });
}
