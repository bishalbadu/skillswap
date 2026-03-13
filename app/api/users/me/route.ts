// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { getUserFromRequest } from "@/lib/auth";
// import { Membership } from "@prisma/client";

// export async function GET() {
//   try {
//     const user = await getUserFromRequest();

//     if (!user) {
//       return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
//     }

//     // ✅ real completed swaps count from Session table (source of truth)
//     const realCompletedCount = await prisma.session.count({
//       where: {
//         status: "COMPLETED",
//         OR: [{ hostId: user.id }, { guestId: user.id }],
//       },
//     });

//     const dbUser = await prisma.user.findUnique({
//       where: { id: user.id },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         membership: true,
//         premiumUntil: true,
//         completedSwaps: true,
//       },
//     });

//     if (!dbUser) {
//       return NextResponse.json({ user: null });
//     }

//     // ✅ auto-fix completedSwaps if mismatch
//     if (dbUser.completedSwaps !== realCompletedCount) {
//       await prisma.user.update({
//         where: { id: user.id },
//         data: { completedSwaps: realCompletedCount },
//       });
//     }

//     // ✅ auto downgrade if premium expired
//     const now = new Date();
//     const isPremiumValid =
//       dbUser.membership === Membership.PREMIUM &&
//       dbUser.premiumUntil &&
//       new Date(dbUser.premiumUntil) > now;

//     if (dbUser.membership === Membership.PREMIUM && !isPremiumValid) {
//       await prisma.user.update({
//         where: { id: user.id },
//         data: { membership: Membership.FREE, premiumUntil: null },
//       });
//     }

//     // ✅ return fresh values (after auto-fixes)
//     const freshUser = await prisma.user.findUnique({
//       where: { id: user.id },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         membership: true,
//         premiumUntil: true,
//         completedSwaps: true,
//       },
//     });

//     return NextResponse.json({ user: freshUser });
//   } catch (error) {
//     console.error("USER ME ERROR:", error);
//     return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
//   }
// }


import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { Membership, NotificationType } from "@prisma/client";

export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // real completed swaps count
    const realCompletedCount = await prisma.session.count({
      where: {
        status: "COMPLETED",
        OR: [{ hostId: user.id }, { guestId: user.id }],
      },
    });

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        membership: true,
        premiumUntil: true,
        completedSwaps: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    // fix completed swaps if mismatch
    if (dbUser.completedSwaps !== realCompletedCount) {
      await prisma.user.update({
        where: { id: user.id },
        data: { completedSwaps: realCompletedCount },
      });
    }

    const now = new Date();

    const premiumExpired =
      dbUser.membership === Membership.PREMIUM &&
      dbUser.premiumUntil &&
      new Date(dbUser.premiumUntil) <= now;

    if (premiumExpired) {

      // downgrade membership but KEEP premiumUntil
      await prisma.user.update({
        where: { id: user.id },
        data: {
          membership: Membership.FREE,
        },
      });

      // create notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: NotificationType.GENERAL,
          title: "Premium expired",
          message:
            "Your premium subscription has expired. Renew to continue unlimited swaps.",
          link: "/dashboard",
        },
      });
    }

    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        membership: true,
        premiumUntil: true,
        completedSwaps: true,
      },
    });

    return NextResponse.json({ user: freshUser });
  } catch (error) {
    console.error("USER ME ERROR:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}