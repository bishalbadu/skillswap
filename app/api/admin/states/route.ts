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

//   const [users, skills, swaps] = await Promise.all([
//     prisma.user.count(),
//     prisma.skill.count(),
//     prisma.swapRequest.count(),
//   ]);

//   return NextResponse.json({
//     users,
//     skills,
//     swaps,
//   });
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await verifyAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const [
    usersCount,
    skillsCount,
    swapsCount,
    premiumCount,
    recentUsers,
    recentSwaps,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.skill.count(),
    prisma.swapRequest.count(),

    // ⭐ premium users count
    prisma.user.count({
      where: { membership: "PREMIUM" },
    }),

    // ⭐ latest users
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

    // ⭐ latest swaps
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
    recentUsers,
    recentSwaps,
  });
}
