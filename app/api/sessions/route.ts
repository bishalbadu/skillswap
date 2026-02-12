// (list for My SkillClasses)

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getUserFromRequest } from "@/lib/auth";

// export async function GET(req: Request) {
//   const user = await getUserFromRequest();
//   if (!user) return NextResponse.json({ sessions: [] }, { status: 401 });

//   const { searchParams } = new URL(req.url);
//   const status = (searchParams.get("status") || "UPCOMING").toUpperCase();

//   const sessions = await prisma.session.findMany({
//   where: {
//     OR: [
//       { hostId: user.id },
//       { guestId: user.id }
//     ],
//     ...(status === "UPCOMING"
//       ? { status: { in: ["UPCOMING", "LIVE"] } }
//       : status === "COMPLETED"
//       ? { status: "COMPLETED" }
//       : status === "CANCELLED"
//       ? { status: "CANCELLED" }
//       : {}),
//   },
//   include: {
//     skill: true,
//     slot: true,
//     host: {
//       select: { id: true, firstName: true, lastName: true, avatar: true }
//     },
//     guest: {
//       select: { id: true, firstName: true, lastName: true, avatar: true }
//     },
//   },
//   orderBy: { id: "desc" },
// });


//   return NextResponse.json({ sessions });
// }



import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import dayjs from "dayjs";

export async function GET(req: Request) {
  const user = await getUserFromRequest();
  if (!user)
    return NextResponse.json({ sessions: [] }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") || "UPCOMING").toUpperCase();

  /* =====================================================
     🔥 AUTO EXPIRE LOGIC (END TIME + 30 MIN GRACE)
  ===================================================== */

  const upcomingSessions = await prisma.session.findMany({
    where: {
      status: "UPCOMING",
      startedAt: null,
    },
    include: {
      slot: true,
    },
  });

  const now = dayjs();

  for (const s of upcomingSessions) {
    if (!s.slot?.date || !s.slot?.timeTo) continue;

    // Combine date + timeTo
    const [hour, minute] = s.slot.timeTo.split(":");

    const sessionEnd = dayjs(s.slot.date)
      .hour(parseInt(hour))
      .minute(parseInt(minute))
      .second(0);

    const expireTime = sessionEnd.add(30, "minute"); // 30 min grace

    if (now.isAfter(expireTime)) {
      await prisma.session.update({
        where: { id: s.id },
        data: { status: "EXPIRED" },
      });

      await prisma.notification.createMany({
        data: [
          {
            userId: s.hostId,
            type: "GENERAL",
            title: "Session Expired",
            message:
              "Your session expired because no one joined within 30 minutes after the scheduled end time.",
            link: "/dashboard/skillmeet",
          },
          {
            userId: s.guestId,
            type: "GENERAL",
            title: "Session Expired",
            message:
              "Your session expired because no one joined within 30 minutes after the scheduled end time.",
            link: "/dashboard/skillmeet",
          },
        ],
      });
    }
  }

  /* =====================================================
     FETCH SESSIONS AFTER EXPIRY CHECK
  ===================================================== */

  const sessions = await prisma.session.findMany({
    where: {
      OR: [{ hostId: user.id }, { guestId: user.id }],
      ...(status === "UPCOMING"
        ? { status: { in: ["UPCOMING", "LIVE"] } }
        : status === "COMPLETED"
        ? { status: "COMPLETED" }
        : status === "CANCELLED"
        ? { status: "CANCELLED" }
        : status === "EXPIRED"
        ? { status: "EXPIRED" }
        : {}),
    },
    include: {
      skill: true,
      slot: true,
      host: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      guest: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json({ sessions });
}
