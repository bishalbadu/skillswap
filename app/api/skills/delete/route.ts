// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) {
//       return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });
//     }

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//     const { skillId } = await req.json();

//     if (!skillId) {
//       return NextResponse.json(
//         { error: "SKILL_ID_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     const skill = await prisma.skill.findUnique({
//       where: { id: skillId },
//     });

//     if (!skill) {
//       return NextResponse.json(
//         { error: "SKILL_NOT_FOUND" },
//         { status: 404 }
//       );
//     }

//     if (skill.userId !== decoded.id) {
//       return NextResponse.json(
//         { error: "FORBIDDEN" },
//         { status: 403 }
//       );
//     }

//     await prisma.skill.delete({
//       where: { id: skillId },
//     });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("DELETE SKILL ERROR:", err);
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

export async function POST(req: Request) {
  try {
    /* ================= AUTH ================= */

    const cookieStore = await cookies(); // ✅ Next 15 safe
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    /* ================= BODY ================= */

    const { skillId } = await req.json();

    if (!skillId) {
      return NextResponse.json(
        { error: "SKILL_ID_REQUIRED" },
        { status: 400 }
      );
    }

    /* ================= FIND SKILL ================= */

    const skill = await prisma.skill.findUnique({
      where: { id: Number(skillId) },
    });

    if (!skill) {
      return NextResponse.json(
        { error: "SKILL_NOT_FOUND" },
        { status: 404 }
      );
    }

    if (skill.userId !== decoded.id) {
      return NextResponse.json(
        { error: "FORBIDDEN" },
        { status: 403 }
      );
    }

    /* =====================================================
       ⭐ FIX: DELETE CHILDREN FIRST (SkillSlot)
    ===================================================== */

    await prisma.skillSlot.deleteMany({
      where: { skillId: skill.id },
    });

    await prisma.skill.delete({
      where: { id: skill.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE SKILL ERROR:", err);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
