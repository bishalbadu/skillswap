// single status

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

  const id = Number(params.id);
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      skill: true,
      slot: true,
      host: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      guest:{ select: { id: true, firstName: true, lastName: true, avatar: true } },
    },
  });

  if (!session) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  const allowed = session.hostId === user.id || session.guestId === user.id;
  if (!allowed) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  return NextResponse.json({ session });
}
