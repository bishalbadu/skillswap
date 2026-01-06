// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function PUT(req: Request) {
//   try {
//     // 🔐 AUTH
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) {
//       return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
//     }

//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch {
//       return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
//     }

//     const { requestId } = await req.json();

//     if (!requestId) {
//       return NextResponse.json(
//         { error: "REQUEST_ID_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     // 🔎 Load request + slot
//     const request = await prisma.swapRequest.findUnique({
//       where: { id: requestId },
//       include: {
//         slot: true,
//       },
//     });

//     if (!request) {
//       return NextResponse.json({ error: "REQUEST_NOT_FOUND" }, { status: 404 });
//     }

//     // 🔒 Only receiver can accept
//     if (request.receiverId !== decoded.id) {
//       return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
//     }

//     if (request.status !== "PENDING") {
//       return NextResponse.json(
//         { error: "REQUEST_ALREADY_PROCESSED" },
//         { status: 400 }
//       );
//     }

//     // ❗ Slot MUST exist
//     if (!request.slot || !request.slotId) {
//       return NextResponse.json(
//         { error: "SLOT_NOT_FOUND" },
//         { status: 400 }
//       );
//     }

//     // 🚫 Slot already booked
//     if (request.slot.isBooked) {
//       return NextResponse.json(
//         { error: "SLOT_ALREADY_BOOKED" },
//         { status: 409 }
//       );
//     }

//     // ✅ Accept this request
//     const acceptedRequest = await prisma.swapRequest.update({
//       where: { id: requestId },
//       data: { status: "ACCEPTED" },
//     });

//     // 🔒 Book the slot
//     await prisma.skillSlot.update({
//       where: { id: request.slotId },
//       data: { isBooked: true },
//     });

//     // ❌ Reject other pending requests for same slot
//     await prisma.swapRequest.updateMany({
//       where: {
//         slotId: request.slotId,
//         status: "PENDING",
//         NOT: { id: requestId },
//       },
//       data: { status: "REJECTED" },
//     });

//     return NextResponse.json({
//       success: true,
//       request: acceptedRequest,
//     });
//   } catch (err) {
//     console.error("ACCEPT SWAP REQUEST ERROR:", err);
//     return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];
    if (!token) return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
    }

    const { requestId } = await req.json();
    if (!requestId) return NextResponse.json({ error: "REQUEST_ID_REQUIRED" }, { status: 400 });

    const request = await prisma.swapRequest.findUnique({
      where: { id: requestId },
      include: { slot: true },
    });

    if (!request) return NextResponse.json({ error: "REQUEST_NOT_FOUND" }, { status: 404 });
    if (request.receiverId !== decoded.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
    if (request.status !== "PENDING") return NextResponse.json({ error: "REQUEST_ALREADY_PROCESSED" }, { status: 400 });

    // ✅ Slot must exist for booking-based flow
    if (!request.slotId || !request.slot) {
      return NextResponse.json({ error: "SLOT_REQUIRED" }, { status: 400 });
    }

    if (request.slot.isBooked) {
      return NextResponse.json({ error: "SLOT_ALREADY_BOOKED" }, { status: 409 });
    }

    // ✅ Do everything atomically
    const result = await prisma.$transaction(async (tx) => {
      const acceptedRequest = await tx.swapRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      });

      await tx.skillSlot.update({
        where: { id: request.slotId! },
        data: { isBooked: true },
      });

      await tx.swapRequest.updateMany({
        where: {
          slotId: request.slotId!,
          status: "PENDING",
          NOT: { id: requestId },
        },
        data: { status: "REJECTED" },
      });

      return acceptedRequest;
    });

    return NextResponse.json({ success: true, request: result });
  } catch (err) {
    console.error("ACCEPT SWAP REQUEST ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
