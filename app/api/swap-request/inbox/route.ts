// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";


// export async function GET(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) {
//       return NextResponse.json({ requests: [] });
//     }

//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch {
//       return NextResponse.json({ requests: [] });
//     }

//     // 🔹 LOAD USER STATUS (IMPORTANT)
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: { status: true },
//     });

//     if (!user) {
//       return NextResponse.json({ requests: [] });
//     }

//     const requests = await prisma.swapRequest.findMany({
//       where: {
//         receiverId: decoded.id,
//       },
//       include: {
//         requester: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             avatar: true,
//           },
//         },
//         skill: {
//           select: {
//             id: true,
//             name: true,
//             level: true,
//           },
//         },
//         slot: {
//           select: {
//             id: true,
//             day: true,
//             date: true,
//             timeFrom: true,
//             timeTo: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json({
//       suspended: user.status === "SUSPENDED", // ⭐ FRONTEND CAN USE THIS
//       requests: requests.map((r) => ({
//         ...r,
//         rating: 4.5,
//         reviewsCount: 55,
//       })),
//     });

//   } catch (error) {
//     console.error("INBOX ERROR:", error);
//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }


// after review

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    /* ================= AUTH ================= */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ requests: [] });
    }

    let decoded: { id: number };

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as { id: number };
    } catch {
      return NextResponse.json({ requests: [] });
    }

    if (!decoded?.id) {
      return NextResponse.json({ requests: [] });
    }

    /* ================= LOAD USER STATUS ================= */
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { status: true },
    });

    if (!user) {
      return NextResponse.json({ requests: [] });
    }

    /* ================= LOAD REQUESTS ================= */
    const requests = await prisma.swapRequest.findMany({
      where: {
        receiverId: decoded.id,
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        skill: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        slot: {
          select: {
            id: true,
            day: true,
            date: true,
            timeFrom: true,
            timeTo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /* ================= GET RATINGS FOR REQUESTERS ================= */
    const requesterIds = [
      ...new Set(requests.map((r) => r.requester.id)),
    ];

    let ratingMap: Record<number, { sum: number; count: number }> = {};

    if (requesterIds.length > 0) {
      const reviews = await prisma.review.findMany({
        where: {
          revieweeId: { in: requesterIds },
        },
        select: {
          revieweeId: true,
          rating: true,
        },
      });

      for (const r of reviews) {
        if (!ratingMap[r.revieweeId]) {
          ratingMap[r.revieweeId] = { sum: 0, count: 0 };
        }

        ratingMap[r.revieweeId].sum += r.rating;
        ratingMap[r.revieweeId].count += 1;
      }
    }

    /* ================= FORMAT RESPONSE ================= */
    const formatted = requests.map((r) => {
      const ratingData = ratingMap[r.requester.id];

      const rating = ratingData
        ? ratingData.sum / ratingData.count
        : 0;

      const reviewsCount = ratingData
        ? ratingData.count
        : 0;

      return {
        ...r,
        rating: Number(rating.toFixed(1)),
        reviewsCount,
      };
    });

    return NextResponse.json({
      suspended: user.status === "SUSPENDED",
      requests: formatted,
    });

  } catch (error) {
    console.error("INBOX ERROR:", error);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
