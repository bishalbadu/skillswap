// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function PUT(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];
//     if (!token) return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });

//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch {
//       return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
//     }

//     const { requestId } = await req.json();
//     if (!requestId) return NextResponse.json({ error: "REQUEST_ID_REQUIRED" }, { status: 400 });

//     const request = await prisma.swapRequest.findUnique({ where: { id: requestId } });
//     if (!request) return NextResponse.json({ error: "REQUEST_NOT_FOUND" }, { status: 404 });

//     if (request.receiverId !== decoded.id) {
//       return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 403 });
//     }

//     if (request.status !== "PENDING") {
//       return NextResponse.json({ error: "REQUEST_ALREADY_PROCESSED" }, { status: 400 });
//     }

//     const rejected = await prisma.swapRequest.update({
//       where: { id: requestId },
//       data: { status: "REJECTED" },
//     });

//     return NextResponse.json({ success: true, request: rejected });
//   } catch (err) {
//     console.error("REJECT SWAP REQUEST ERROR:", err);
//     return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

/**
 * ❌ REJECT SWAP REQUEST + NOTIFICATION
 */
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

    /* ================= REJECT REQUEST ================= */
    const rejected = await prisma.swapRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });

    /* ================= NOTIFICATION ================= */
    await prisma.notification.create({
      data: {
        userId: request.requesterId,
        type: "SWAP_REJECTED",
        title: "Swap Rejected",
        message: `${user.firstName} ${user.lastName} rejected your swap request.`,
        link: "/dashboard/messages",
      },
    });

    return NextResponse.json({
      success: true,
      request: rejected,
    });

  } catch (err) {
    console.error("REJECT SWAP REQUEST ERROR:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
