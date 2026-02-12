import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromRequest();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, rating, comment } = await req.json();

  if (!sessionId || !rating)
    return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.status !== "COMPLETED") {
    return NextResponse.json({ error: "Session not completed" }, { status: 400 });
  }

  // Determine who is being reviewed
  const revieweeId =
    session.hostId === user.id ? session.guestId : session.hostId;

  try {
    await prisma.review.create({
      data: {
        sessionId,
        reviewerId: user.id,
        revieweeId,
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Already rated" },
      { status: 400 }
    );
  }
}
