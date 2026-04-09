// // after review

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function GET() {
//   try {
//     /* ================= AUTH ================= */
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ requests: [] });
//     }

//     let decoded: { id: number };

//     try {
//       decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET!
//       ) as { id: number };
//     } catch {
//       return NextResponse.json({ requests: [] });
//     }

//     if (!decoded?.id) {
//       return NextResponse.json({ requests: [] });
//     }

//     /* ================= LOAD USER STATUS ================= */
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: { status: true },
//     });

//     if (!user) {
//       return NextResponse.json({ requests: [] });
//     }

//     /* ================= LOAD REQUESTS ================= */
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
//         session: {
//       select: {
//         id: true,
//         status: true,
//         startedAt: true,
//         endedAt: true,
//       },
//     },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     /* ================= GET RATINGS FOR REQUESTERS ================= */
//     const requesterIds = [
//       ...new Set(requests.map((r) => r.requester.id)),
//     ];

//     let ratingMap: Record<number, { sum: number; count: number }> = {};

//     if (requesterIds.length > 0) {
//       const reviews = await prisma.review.findMany({
//         where: {
//           revieweeId: { in: requesterIds },
//         },
//         select: {
//           revieweeId: true,
//           rating: true,
//         },
//       });

//       for (const r of reviews) {
//         if (!ratingMap[r.revieweeId]) {
//           ratingMap[r.revieweeId] = { sum: 0, count: 0 };
//         }

//         ratingMap[r.revieweeId].sum += r.rating;
//         ratingMap[r.revieweeId].count += 1;
//       }
//     }

//     /* ================= FORMAT RESPONSE ================= */
//     const formatted = requests.map((r) => {
//       const ratingData = ratingMap[r.requester.id];

//       const rating = ratingData
//         ? ratingData.sum / ratingData.count
//         : 0;

//       const reviewsCount = ratingData
//         ? ratingData.count
//         : 0;

//       return {
//         ...r,
//         rating: Number(rating.toFixed(1)),
//         reviewsCount,
//       };
//     });

//     return NextResponse.json({
//       suspended: user.status === "SUSPENDED",
//       requests: formatted,
//     });

//   } catch (error) {
//     console.error("INBOX ERROR:", error);

//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }


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

    /* ================= LOAD USER ================= */

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
        session: {
          select: {
            id: true,
            status: true,
            startedAt: true,
            endedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /* ================= GET RATINGS ================= */

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

    const now = new Date();

    const formatted = requests.map((r) => {

      const ratingData = ratingMap[r.requester.id];

      const rating = ratingData
        ? ratingData.sum / ratingData.count
        : 0;

      const reviewsCount = ratingData
        ? ratingData.count
        : 0;

      // 👇 IMPORTANT FIX
      let computedStatus: string = r.status;

      /* COMPLETED */

      if (r.session && r.session.status === "COMPLETED") {
        computedStatus = "COMPLETED";
      }

      /* EXPIRED */

     else if (r.slot && r.slot.date && r.slot.timeTo) {
  const now = new Date();

  const d = new Date(r.slot.date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const slotEnd = new Date(
    `${year}-${month}-${day}T${r.slot.timeTo}:00`
  );

  if (slotEnd <= now) {
    computedStatus = "EXPIRED";
  }
}

      return {
        ...r,
        computedStatus,
        rating: Number(rating.toFixed(1)),
        reviewsCount,
      };
    });

    /* ================= RESPONSE ================= */

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