// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   try {
//     const cookieStore = await cookies(); 
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ user: null });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       id: number;
//     };

//     if (typeof decoded.id !== "number") {
//       return NextResponse.json({ user: null });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         bio: true,
//         avatar: true,
//       },
//     });

//     return NextResponse.json({ user });
//   } catch (err) {
//     console.error("JWT ERROR:", err);
//     return NextResponse.json({ user: null });
//   }
// }


// after review

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ user: null });
    }

    if (typeof decoded.id !== "number") {
      return NextResponse.json({ user: null });
    }

    /* ================= GET USER ================= */

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        avatar: true,
        membership: true,
        premiumUntil: true,
        completedSwaps: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    /* ================= 🔥 REAL COMPLETED COUNT ================= */

    const realCompletedCount = await prisma.session.count({
      where: {
        status: "COMPLETED",
        OR: [
          { hostId: user.id },
          { guestId: user.id },
        ],
      },
    });

    /* ================= AUTO FIX DATABASE ================= */

    if (realCompletedCount !== user.completedSwaps) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          completedSwaps: realCompletedCount,
        },
      });
    }

    /* ================= REVIEWS ================= */

    const reviews = await prisma.review.findMany({
      where: { revieweeId: user.id },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const reviewsCount = reviews.length;

    const rating =
      reviewsCount === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount;

    return NextResponse.json({
      user: {
        ...user,
        completedSwaps: realCompletedCount, // 🔥 RETURN REAL VALUE
        rating: Number(rating.toFixed(1)),
        reviewsCount,
        recentReviews: reviews.slice(0, 5),
      },
    });

  } catch (err) {
    console.error("PROFILE ME ERROR:", err);
    return NextResponse.json({ user: null });
  }
}
