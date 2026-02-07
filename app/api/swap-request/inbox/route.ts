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
//   select: {
//     id: true,
//     day: true,
//     date: true,   // ⭐ ADD
//     timeFrom: true,
//     timeTo: true,
//   },
// },

//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json({
//       requests: requests.map((r) => ({
//         ...r,
//         rating: 4.5,          // dummy trust signal
//         reviewsCount: 55,     // dummy
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


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ requests: [] });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ requests: [] });
    }

    // 🔹 LOAD USER STATUS (IMPORTANT)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { status: true },
    });

    if (!user) {
      return NextResponse.json({ requests: [] });
    }

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

    return NextResponse.json({
      suspended: user.status === "SUSPENDED", // ⭐ FRONTEND CAN USE THIS
      requests: requests.map((r) => ({
        ...r,
        rating: 4.5,
        reviewsCount: 55,
      })),
    });

  } catch (error) {
    console.error("INBOX ERROR:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
