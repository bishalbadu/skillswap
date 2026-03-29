// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getUserFromRequest } from "@/lib/auth";

// export async function POST(req: Request) {
//   const user = await getUserFromRequest();
//   if (!user) return NextResponse.json({ error: "UNAUTH" }, { status: 401 });

//   const { sessionId } = await req.json();
//   if (!sessionId) return NextResponse.json({ error: "SESSION_ID_REQUIRED" }, { status: 400 });

//   const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
//   if (!session) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

//   if (session.hostId !== user.id) {
//     return NextResponse.json({ error: "ONLY_HOST_CAN_END" }, { status: 403 });
//   }

//   const updated = await prisma.session.update({
//     where: { id: session.id },
//     data: { status: "COMPLETED", endedAt: new Date() },
//   });

//   return NextResponse.json({ success: true, session: updated });
// }



// after premium

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "UNAUTH" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json(
        { error: "SESSION_ID_REQUIRED" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: Number(sessionId) },
    });

    if (!session) {
      return NextResponse.json(
        { error: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (session.hostId !== user.id) {
      return NextResponse.json(
        { error: "ONLY_HOST_CAN_END" },
        { status: 403 }
      );
    }

    if (session.status === "COMPLETED") {
      return NextResponse.json(
        { error: "ALREADY_COMPLETED" },
        { status: 400 }
      );
    }

    if (session.status !== "LIVE") {
      return NextResponse.json(
        { error: "SESSION_NOT_ACTIVE" },
        { status: 400 }
      );
    }

    /* ===============================
       TRANSACTION (IMPORTANT)
    =============================== */
   const updated = await prisma.$transaction(async (tx) => {
  const completedSession = await tx.session.update({
    where: { id: session.id },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
    },
  });

  await tx.user.updateMany({
    where: {
      id: { in: [session.hostId, session.guestId] },
    },
    data: {
      completedSwaps: { increment: 1 },
    },
  });

  return completedSession;
});


    return NextResponse.json({
      success: true,
      session: updated,
    });

  } catch (error) {
    console.error("Session End Error:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
