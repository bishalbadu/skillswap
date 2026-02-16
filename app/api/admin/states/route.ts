

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyAdmin } from "@/lib/auth";

// export async function GET() {
//   const admin = await verifyAdmin();

//   if (!admin) {
//     return NextResponse.json(
//       { error: "UNAUTHORIZED" },
//       { status: 401 }
//     );
//   }

//   const [
//     usersCount,
//     skillsCount,
//     swapsCount,
//     premiumCount,
//     recentUsers,
//     recentSwaps,
//   ] = await Promise.all([
//     prisma.user.count(),
//     prisma.skill.count(),
//     prisma.swapRequest.count(),

//     // ⭐ premium users count
//     prisma.user.count({
//       where: { membership: "PREMIUM" },
//     }),

//     // ⭐ latest users
//     prisma.user.findMany({
//       take: 5,
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         status: true,
//         membership: true,
//       },
//     }),

//     // ⭐ latest swaps
//     prisma.swapRequest.findMany({
//       take: 5,
//       orderBy: { createdAt: "desc" },
//       include: {
//         requester: {
//           select: { firstName: true, lastName: true },
//         },
//         receiver: {
//           select: { firstName: true, lastName: true },
//         },
//       },
//     }),
//   ]);

//   return NextResponse.json({
//     users: usersCount,
//     skills: skillsCount,
//     swaps: swapsCount,
//     premium: premiumCount,
//     recentUsers,
//     recentSwaps,
//   });
// }


// AFTER PAYMNET

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    /* ================= ADMIN AUTH ================= */
    const admin = await verifyAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    /* ================= FETCH STATS ================= */
    const [
      usersCount,
      skillsCount,
      swapsCount,
      premiumCount,
      revenueResult,
      completedSessions,
      recentUsers,
      recentSwaps,
    ] = await Promise.all([
      // 👥 Total Users
      prisma.user.count(),

      // 🎯 Total Skills
      prisma.skill.count(),

      // 🔁 Total Swap Requests
      prisma.swapRequest.count(),

      // ⭐ Premium Users Count
      prisma.user.count({
        where: { membership: "PREMIUM" },
      }),

      // 💰 Total Revenue (ONLY COMPLETED PAYMENTS)
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" }, // ✅ FIXED HERE
      }),

      // ✅ Completed Sessions
      prisma.session.count({
        where: { status: "COMPLETED" },
      }),

      // 🆕 Latest Users
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          status: true,
          membership: true,
        },
      }),

      // 🔄 Latest Swap Requests
      prisma.swapRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          requester: {
            select: { firstName: true, lastName: true },
          },
          receiver: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      users: usersCount,
      skills: skillsCount,
      swaps: swapsCount,
      premium: premiumCount,
      revenue: revenueResult._sum?.amount ?? 0,
      completedSessions,
      recentUsers,
      recentSwaps,
    });

  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
