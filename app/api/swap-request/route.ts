// // any can sent request even if not in want list

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// /**
//  * 🔍 SAFETY: Handle accidental GET calls
//  */
// export async function GET() {
//   return NextResponse.json(
//     { error: "METHOD_NOT_ALLOWED" },
//     { status: 405 }
//   );
// }

// /**
//  * ✅ CREATE SWAP REQUEST
//  */
// export async function POST(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) {
//       return NextResponse.json(
//         { error: "NOT_AUTHENTICATED" },
//         { status: 401 }
//       );
//     }

//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch {
//       return NextResponse.json(
//         { error: "INVALID_TOKEN" },
//         { status: 401 }
//       );
//     }

//     const { skillId, slotId, message } = await req.json();

//     if (!skillId || !slotId) {
//       return NextResponse.json(
//         { error: "SKILL_ID_AND_SLOT_ID_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     // 🔎 Load slot
//     const slot = await prisma.skillSlot.findUnique({
//       where: { id: slotId },
//       include: { skill: true },
//     });

//     if (!slot || slot.isBooked) {
//       return NextResponse.json(
//         { error: "SLOT_NOT_AVAILABLE" },
//         { status: 409 }
//       );
//     }

//     if (slot.skill.userId === decoded.id) {
//       return NextResponse.json(
//         { error: "CANNOT_REQUEST_OWN_SKILL" },
//         { status: 400 }
//       );
//     }

//     // 🚫 Prevent duplicate pending request
//     const existing = await prisma.swapRequest.findFirst({
//       where: {
//         requesterId: decoded.id,
//         slotId,
//         status: "PENDING",
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "REQUEST_ALREADY_PENDING" },
//         { status: 409 }
//       );
//     }

//     const created = await prisma.swapRequest.create({
//       data: {
//         requesterId: decoded.id,
//         receiverId: slot.skill.userId,
//         skillId: slot.skillId,
//         slotId,
//         message: message || "",
//       },
//     });

//     return NextResponse.json({ success: true, request: created });
//   } catch (err) {
//     console.error("CREATE SWAP REQUEST ERROR:", err);
//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

/**
 * 🔍 SAFETY: Handle accidental GET calls
 */
export async function GET() {
  return NextResponse.json(
    { error: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}

/**
 * ✅ CREATE SWAP REQUEST
 */
export async function POST(req: Request) {
  try {
    /* ================= AUTH ================= */
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json(
        { error: "NOT_AUTHENTICATED" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { error: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    /* ================= BODY ================= */
    const { skillId, slotId, message } = await req.json();

    if (!skillId || !slotId) {
      return NextResponse.json(
        { error: "SKILL_ID_AND_SLOT_ID_REQUIRED" },
        { status: 400 }
      );
    }

    /* ================= LOAD SLOT ================= */
    const slot = await prisma.skillSlot.findUnique({
      where: { id: slotId },
      include: { skill: true },
    });

    if (!slot || slot.isBooked) {
      return NextResponse.json(
        { error: "SLOT_NOT_AVAILABLE" },
        { status: 409 }
      );
    }

    /* ================= CANNOT REQUEST OWN ================= */
    if (slot.skill.userId === decoded.id) {
      return NextResponse.json(
        { error: "CANNOT_REQUEST_OWN_SKILL" },
        { status: 400 }
      );
    }

    /* =====================================================
       ⭐ NEW RULE — MUST EXIST IN WANT SKILLS
    ===================================================== */
    const wantSkill = await prisma.skill.findFirst({
      where: {
        userId: decoded.id,
        type: "WANT",
        name: {
          contains: slot.skill.name,
          mode: "insensitive",
        },
      },
    });

    if (!wantSkill) {
      return NextResponse.json(
        { error: "SKILL_NOT_IN_WANT_LIST" },
        { status: 403 }
      );
    }

    /* ================= PREVENT DUPLICATE ================= */
    const existing = await prisma.swapRequest.findFirst({
      where: {
        requesterId: decoded.id,
        slotId,
        status: "PENDING",
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "REQUEST_ALREADY_PENDING" },
        { status: 409 }
      );
    }

    /* ================= CREATE REQUEST ================= */
    const created = await prisma.swapRequest.create({
      data: {
        requesterId: decoded.id,
        receiverId: slot.skill.userId,
        skillId: slot.skillId,
        slotId,
        message: message || "",
      },
    });

    return NextResponse.json({
      success: true,
      request: created,
    });

  } catch (err) {
    console.error("CREATE SWAP REQUEST ERROR:", err);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
