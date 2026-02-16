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
//     /* ================= AUTH ================= */
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

//     /* ================= BODY ================= */
//     const { skillId, slotId, message } = await req.json();

//     if (!skillId || !slotId) {
//       return NextResponse.json(
//         { error: "SKILL_ID_AND_SLOT_ID_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     /* ================= LOAD SLOT ================= */
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

//     /* ================= CANNOT REQUEST OWN ================= */
//     if (slot.skill.userId === decoded.id) {
//       return NextResponse.json(
//         { error: "CANNOT_REQUEST_OWN_SKILL" },
//         { status: 400 }
//       );
//     }

//     /* =====================================================
//        ⭐ NEW RULE — MUST EXIST IN WANT SKILLS
//     ===================================================== */
//     const wantSkill = await prisma.skill.findFirst({
//       where: {
//         userId: decoded.id,
//         type: "WANT",
//         name: {
//           contains: slot.skill.name,
//           mode: "insensitive",
//         },
//       },
//     });

//     if (!wantSkill) {
//       return NextResponse.json(
//         { error: "SKILL_NOT_IN_WANT_LIST" },
//         { status: 403 }
//       );
//     }

//     /* ================= PREVENT DUPLICATE ================= */
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

//     /* ================= CREATE REQUEST ================= */
//     const created = await prisma.swapRequest.create({
//       data: {
//         requesterId: decoded.id,
//         receiverId: slot.skill.userId,
//         skillId: slot.skillId,
//         slotId,
//         message: message || "",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       request: created,
//     });

//   } catch (err) {
//     console.error("CREATE SWAP REQUEST ERROR:", err);

//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }






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
//  * ✅ CREATE SWAP REQUEST + NOTIFICATION
//  */
// export async function POST(req: Request) {
//   try {
//     /* ================= AUTH ================= */
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
// const user = await prisma.user.findUnique({
//   where: { id: decoded.id },
//   select: { status: true },
// });

// if (!user || user.status === "SUSPENDED") {
//   return NextResponse.json(
//     { error: "ACCOUNT_SUSPENDED" },
//     { status: 403 }
//   );
// }

//     const requesterId = Number(decoded.id);

//     /* ================= BODY ================= */
//     const { skillId, slotId, message } = await req.json();

//     if (!skillId || !slotId) {
//       return NextResponse.json(
//         { error: "SKILL_ID_AND_SLOT_ID_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     /* ================= LOAD SLOT ================= */
//     const slot = await prisma.skillSlot.findUnique({
//       where: { id: slotId },
//       include: {
//         skill: {
//           include: {
//             user: true, // receiver
//           },
//         },
//       },
//     });

//     if (!slot || slot.isBooked) {
//       return NextResponse.json(
//         { error: "SLOT_NOT_AVAILABLE" },
//         { status: 409 }
//       );
//     }

//     /* ================= CANNOT REQUEST OWN SKILL ================= */
//     if (slot.skill.userId === requesterId) {
//       return NextResponse.json(
//         { error: "CANNOT_REQUEST_OWN_SKILL" },
//         { status: 400 }
//       );
//     }

//     /* ================= WANT SKILL RULE ================= */
//     const wantSkill = await prisma.skill.findFirst({
//       where: {
//         userId: requesterId,
//         type: "WANT",
//         name: {
//           contains: slot.skill.name,
//           mode: "insensitive",
//         },
//       },
//     });

//     if (!wantSkill) {
//       return NextResponse.json(
//         { error: "SKILL_NOT_IN_WANT_LIST" },
//         { status: 403 }
//       );
//     }

//     /* ================= PREVENT DUPLICATE ================= */
//     const existing = await prisma.swapRequest.findFirst({
//       where: {
//         requesterId,
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

//     /* ================= CREATE REQUEST ================= */
//     const created = await prisma.swapRequest.create({
//       data: {
//         requesterId,
//         receiverId: slot.skill.userId,
//         skillId: slot.skillId,
//         slotId,
//         message: message || "",
//       },
//     });

//     /* ================= CREATE NOTIFICATION ================= */
//     const requester = await prisma.user.findUnique({
//       where: { id: requesterId },
//       select: { firstName: true, lastName: true },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: slot.skill.userId, // receiver
//         type: "SWAP_REQUESTED",
//         title: "New Swap Request",
//         message: `${requester?.firstName} ${requester?.lastName} sent you a request to swap for ${slot.skill.name}`,
//         link: "/dashboard/messages",
//       },
//     });

//     /* ================= RESPONSE ================= */
//     return NextResponse.json({
//       success: true,
//       request: created,
//     });

//   } catch (err) {
//     console.error("CREATE SWAP REQUEST ERROR:", err);
//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }



// after premium

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { AccountStatus } from "@prisma/client";


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
 * ✅ CREATE SWAP REQUEST + NOTIFICATION
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
const user = await prisma.user.findUnique({
  where: { id: decoded.id },
  select: {
    status: true,
    completedSwaps: true,
    premiumUntil: true,
  },
});

if (!user || user.status === "SUSPENDED") {
  return NextResponse.json(
    { error: "ACCOUNT_SUSPENDED" },
    { status: 403 }
  );
}

/* ================= PREMIUM GUARD ================= */
const isPremium =
  user.premiumUntil && new Date(user.premiumUntil) > new Date();

if (!isPremium && user.completedSwaps >= 10) {
  return NextResponse.json(
    { error: "PREMIUM_REQUIRED" },
    { status: 403 }
  );
}


if (!user) {
  return NextResponse.json(
    { error: "ACCOUNT_SUSPENDED" },
    { status: 403 }
  );
}

if (user.status !== AccountStatus.ACTIVE) {
  return NextResponse.json(
    { error: "ACCOUNT_SUSPENDED" },
    { status: 403 }
  );
}



    const requesterId = Number(decoded.id);

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
      include: {
        skill: {
          include: {
            user: true, // receiver
          },
        },
      },
    });

    if (!slot || slot.isBooked) {
      return NextResponse.json(
        { error: "SLOT_NOT_AVAILABLE" },
        { status: 409 }
      );
    }

    /* ================= CANNOT REQUEST OWN SKILL ================= */
    if (slot.skill.userId === requesterId) {
      return NextResponse.json(
        { error: "CANNOT_REQUEST_OWN_SKILL" },
        { status: 400 }
      );
    }

    /* ================= WANT SKILL RULE ================= */
    const wantSkill = await prisma.skill.findFirst({
      where: {
        userId: requesterId,
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
        requesterId,
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
        requesterId,
        receiverId: slot.skill.userId,
        skillId: slot.skillId,
        slotId,
        message: message || "",
      },
    });

    /* ================= CREATE NOTIFICATION ================= */
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
      select: { firstName: true, lastName: true },
    });

    await prisma.notification.create({
      data: {
        userId: slot.skill.userId, // receiver
        type: "SWAP_REQUESTED",
        title: "New Swap Request",
        message: `${requester?.firstName} ${requester?.lastName} sent you a request to swap for ${slot.skill.name}`,
        link: "/dashboard/messages",
      },
    });

    /* ================= RESPONSE ================= */
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
