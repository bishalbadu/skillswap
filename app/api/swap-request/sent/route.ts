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
//         requesterId: decoded.id, // ✅ THIS IS THE ONLY LOGIC CHANGE
//       },
//       include: {
//         receiver: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             avatar: true,
//           },
//         },
//         skill: {
//           select: {
//             name: true,
//             level: true,
//           },
//         },
//         slot: {
//           select: {
//             day: true,
//             timeFrom: true,
//             timeTo: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ requests });
//   } catch (err) {
//     console.error("SENT REQUESTS ERROR:", err);
//     return NextResponse.json({ requests: [] });
//   }
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {

    /* ================= AUTH ================= */

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

    /* ================= LOAD REQUESTS ================= */

    const requests = await prisma.swapRequest.findMany({
      where: {
        requesterId: decoded.id,
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        skill: {
          select: {
            name: true,
            level: true,
          },
        },
        slot: {
          select: {
            day: true,
            date: true,   // ⭐ needed for expired logic
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
      orderBy: { createdAt: "desc" },
    });

    /* ================= STATUS CALCULATION ================= */

    const now = new Date();

    const formatted = requests.map((r) => {

      let computedStatus: string = r.status;

      /* COMPLETED */

      if (r.session && r.session.status === "COMPLETED") {
        computedStatus = "COMPLETED";
      }

      /* EXPIRED */

      else if (
        r.slot &&
        r.slot.date &&
        new Date(r.slot.date).getTime() < now.getTime()
      ) {
        computedStatus = "EXPIRED";
      }

      return {
        ...r,
        computedStatus,
      };
    });

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      requests: formatted,
    });

  } catch (err) {

    console.error("SENT REQUESTS ERROR:", err);

    return NextResponse.json({ requests: [] });
  }
}