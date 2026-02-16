




// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// /**
//  * DELETE a skill owned by the logged-in user
//  * (Deletes related slots first to avoid FK errors)
//  */
// export async function POST(req: Request) {
//   try {
//     /* ================= AUTH ================= */
//     const cookieStore = await cookies(); // ✅ Next.js 15 FIX
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { error: "NOT_LOGGED_IN" },
//         { status: 401 }
//       );
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as { id: number };

//     /* ================= BODY ================= */
//     const body = await req.json().catch(() => null);

//     if (!body || !body.skillId) {
//       return NextResponse.json(
//         { error: "SKILL_ID_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     const skillId = Number(body.skillId);

//     if (isNaN(skillId)) {
//       return NextResponse.json(
//         { error: "INVALID_SKILL_ID" },
//         { status: 400 }
//       );
//     }

//     /* ================= FIND SKILL ================= */
//     const skill = await prisma.skill.findUnique({
//       where: { id: skillId },
//     });

//     if (!skill) {
//       return NextResponse.json(
//         { error: "SKILL_NOT_FOUND" },
//         { status: 404 }
//       );
//     }

//     /* ================= OWNERSHIP CHECK ================= */
//     if (skill.userId !== decoded.id) {
//       return NextResponse.json(
//         { error: "FORBIDDEN" },
//         { status: 403 }
//       );
//     }

//     /* ================= DELETE CHILD RECORDS ================= */
//     await prisma.skillSlot.deleteMany({
//       where: { skillId },
//     });

//     /* ================= DELETE SKILL ================= */
//     await prisma.skill.delete({
//       where: { id: skillId },
//     });

//     /* ================= SUCCESS ================= */
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("DELETE SKILL ERROR:", error);

//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }


import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * DELETE a skill owned by the logged-in user
 * - Safe for double calls
 * - Deletes child slots first
 * - Uses transaction
 */
export async function POST(req: Request) {
  try {
    /* ================= AUTH ================= */

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "NOT_LOGGED_IN" },
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

    if (!decoded?.id) {
      return NextResponse.json(
        { error: "INVALID_TOKEN_DATA" },
        { status: 401 }
      );
    }

    /* ================= BODY ================= */

    const body = await req.json().catch(() => null);

    if (!body?.skillId) {
      return NextResponse.json(
        { error: "SKILL_ID_REQUIRED" },
        { status: 400 }
      );
    }

    const skillId = Number(body.skillId);

    if (isNaN(skillId)) {
      return NextResponse.json(
        { error: "INVALID_SKILL_ID" },
        { status: 400 }
      );
    }

    /* ================= FIND SKILL ================= */

    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
      select: { id: true, userId: true },
    });

    // 🔥 IMPORTANT FIX:
    // If skill already deleted → return success
    if (!skill) {
      return NextResponse.json({ success: true });
    }

    /* ================= OWNERSHIP CHECK ================= */

    if (skill.userId !== decoded.id) {
      return NextResponse.json(
        { error: "FORBIDDEN" },
        { status: 403 }
      );
    }

    /* ================= SAFE DELETE (TRANSACTION) ================= */

    await prisma.$transaction([
      prisma.skillSlot.deleteMany({
        where: { skillId },
      }),
      prisma.skill.delete({
        where: { id: skillId },
      }),
    ]);

    /* ================= SUCCESS ================= */

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("DELETE SKILL ERROR:", error);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
