// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) return NextResponse.json({ requests: [] });

//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch {
//       return NextResponse.json({ requests: [] });
//     }

//     const requests = await prisma.swapRequest.findMany({
//       where: { receiverId: decoded.id },
//       include: {
//         requester: {
//           select: { id: true, firstName: true, lastName: true, avatar: true },
//         },
//         skill: {
//           select: { id: true, name: true },
//         },
//         // ✅ include slot so frontend can show day/time
//         slot: {
//           select: {
//             id: true,
//             day: true,
//             timeFrom: true,
//             timeTo: true,
//             isBooked: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ requests });
//   } catch (error) {
//     console.error("INBOX ERROR:", error);
//     return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
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
      requests: requests.map((r) => ({
        ...r,
        rating: 4.5,          // dummy trust signal
        reviewsCount: 55,     // dummy
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
