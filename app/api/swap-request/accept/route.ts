// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getUserFromRequest } from "@/lib/auth";

// export async function PUT(req: Request) {
//   try {
//     /* ================= AUTH ================= */
//     const user = await getUserFromRequest();

//     if (!user) {
//       return NextResponse.json(
//         { error: "NOT_AUTHENTICATED" },
//         { status: 401 }
//       );
//     }

//     const receiverId = user.id;

//     /* ================= BODY ================= */
//     const { requestId } = await req.json();
//     if (!requestId) {
//       return NextResponse.json(
//         { error: "REQUEST_ID_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     /* ================= LOAD REQUEST ================= */
//     const request = await prisma.swapRequest.findUnique({
//       where: { id: requestId },
//       include: {
//         slot: true,
//         skill: true,
//       },
//     });

//     if (!request) {
//       return NextResponse.json(
//         { error: "REQUEST_NOT_FOUND" },
//         { status: 404 }
//       );
//     }

//     if (request.receiverId !== receiverId) {
//       return NextResponse.json(
//         { error: "UNAUTHORIZED" },
//         { status: 403 }
//       );
//     }

//     if (request.status !== "PENDING") {
//       return NextResponse.json(
//         { error: "REQUEST_ALREADY_PROCESSED" },
//         { status: 400 }
//       );
//     }

//     if (!request.slot || request.slot.isBooked) {
//       return NextResponse.json(
//         { error: "SLOT_NOT_AVAILABLE" },
//         { status: 409 }
//       );
//     }

//     /* ================= TRANSACTION ================= */
//     const accepted = await prisma.$transaction(async (tx) => {
//       const res = await tx.swapRequest.update({
//         where: { id: requestId },
//         data: { status: "ACCEPTED" },
//       });

//       await tx.skillSlot.update({
//         where: { id: request.slotId! },
//         data: { isBooked: true },
//       });

//       await tx.swapRequest.updateMany({
//         where: {
//           slotId: request.slotId!,
//           status: "PENDING",
//           NOT: { id: requestId },
//         },
//         data: { status: "REJECTED" },
//       });

//       return res;
//     });

//     /* ================= NOTIFICATION ================= */
//     await prisma.notification.create({
//       data: {
//         userId: request.requesterId,
//         type: "SWAP_ACCEPTED",
//         title: "Swap Accepted",
//         message: `${user.firstName} ${user.lastName} accepted your swap request for ${request.skill.name}`,
//         link: "/dashboard/messages",
//       },
//     });

//     return NextResponse.json({ success: true, request: accepted });

//   } catch (err) {
//     console.error("ACCEPT SWAP ERROR:", err);
//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    /* ================= AUTH ================= */
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "NOT_AUTHENTICATED" },
        { status: 401 }
      );
    }

    // 🔴 ADD THIS BLOCK (EXACTLY HERE)
    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "ACCOUNT_SUSPENDED" },
        { status: 403 }
      );
    }

    const receiverId = user.id;

    /* ================= BODY ================= */
    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json(
        { error: "REQUEST_ID_REQUIRED" },
        { status: 400 }
      );
    }

    /* ================= LOAD REQUEST ================= */
    const request = await prisma.swapRequest.findUnique({
      where: { id: requestId },
      include: {
        slot: true,
        skill: true,
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "REQUEST_NOT_FOUND" },
        { status: 404 }
      );
    }

    if (request.receiverId !== receiverId) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 403 }
      );
    }

    if (request.status !== "PENDING") {
      return NextResponse.json(
        { error: "REQUEST_ALREADY_PROCESSED" },
        { status: 400 }
      );
    }

    if (!request.slot || request.slot.isBooked) {
      return NextResponse.json(
        { error: "SLOT_NOT_AVAILABLE" },
        { status: 409 }
      );
    }

    /* ================= TRANSACTION ================= */
    const accepted = await prisma.$transaction(async (tx) => {
      const res = await tx.swapRequest.update({
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

      return res;
    });

    /* ================= NOTIFICATION ================= */
    await prisma.notification.create({
      data: {
        userId: request.requesterId,
        type: "SWAP_ACCEPTED",
        title: "Swap Accepted",
        message: `${user.firstName} ${user.lastName} accepted your swap request for ${request.skill.name}`,
        link: "/dashboard/messages",
      },
    });

    return NextResponse.json({ success: true, request: accepted });

  } catch (err) {
    console.error("ACCEPT SWAP ERROR:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
