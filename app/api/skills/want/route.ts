// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// /**
//  * GET WANTED SKILLS (FOR PROFILE PAGE)
//  */
// export async function GET(req: Request) {
//   const cookie = req.headers.get("cookie");
//   const token = cookie?.match(/token=([^;]+)/)?.[1];

//   if (!token) {
//     return NextResponse.json({ skills: [] });
//   }

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET!);
//   } catch {
//     return NextResponse.json({ skills: [] });
//   }

//   const skills = await prisma.skill.findMany({
//     where: {
//       userId: decoded.id,
//       type: "WANT",
//     },
//     select: {
//       id: true,
//       name: true,
//       learnGoal: true,
      
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   return NextResponse.json({ skills });
// }

// /**
//  * CREATE WANTED SKILL
//  */
// export async function POST(req: Request) {
//   const cookie = req.headers.get("cookie");
//   const token = cookie?.match(/token=([^;]+)/)?.[1];

//   if (!token) {
//     return NextResponse.json(
//       { error: "NOT_LOGGED_IN" },
//       { status: 401 }
//     );
//   }

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET!);
//   } catch {
//     return NextResponse.json(
//       { error: "TOKEN_INVALID" },
//       { status: 401 }
//     );
//   }

//   const { skill, learnGoal } = await req.json();

//   if (!skill || !skill.trim()) {
//     return NextResponse.json(
//       { error: "Skill name is required" },
//       { status: 400 }
//     );
//   }

//   await prisma.skill.create({
//     data: {
//       name: skill.trim(),
//       type: "WANT",
//       learnGoal: learnGoal ?? null,
//       userId: decoded.id,
//     },
//   });

//   return NextResponse.json({ success: true });
// }


import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * ===============================
 * GET WANTED SKILLS (PROFILE PAGE)
 * ===============================
 */
export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ skills: [] });
    }

    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ skills: [] });
    }

    const skills = await prisma.skill.findMany({
      where: {
        userId: decoded.id,
        type: "WANT",
      },

      // ✅ IMPORTANT: include status
      select: {
        id: true,
        name: true,
        learnGoal: true,
        status: true,       // ⭐ FIX
        createdAt: true,    // optional but useful
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ skills });
  } catch (err) {
    console.error("GET WANT SKILLS ERROR:", err);
    return NextResponse.json({ skills: [] });
  }
}

/**
 * ===============================
 * CREATE WANTED SKILL
 * ===============================
 */
export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.match(/token=([^;]+)/)?.[1];

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
        { error: "TOKEN_INVALID" },
        { status: 401 }
      );
    }

    const { skill, learnGoal } = await req.json();

    if (!skill || !skill.trim()) {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 }
      );
    }

    // ✅ Default moderation flow same as OFFER
    await prisma.skill.create({
      data: {
        name: skill.trim(),
        type: "WANT",
        learnGoal: learnGoal ?? null,
        userId: decoded.id,

        status: "PENDING", // ⭐ IMPORTANT (so admin can approve)
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CREATE WANT SKILL ERROR:", err);

    return NextResponse.json(
      { error: "FAILED_TO_CREATE" },
      { status: 500 }
    );
  }
}
