// import { cookies } from "next/headers";
// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET!;

// /* =====================================================
//    POST  /api/skills/offer
//    Create OFFER skill + availability slots
//    Used by your OfferSkillsPage frontend
// ===================================================== */
// export async function POST(req: Request) {
//   try {
//     /* ================= AUTH ================= */

//     // ✅ Next.js 15+ requires await
//     const cookieStore = await cookies();

//     // ✅ EXACT cookie name (no regex, avoids admin_token bug)
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { error: "NOT_LOGGED_IN" },
//         { status: 401 }
//       );
//     }

//     let decoded: any;

//     try {
//       decoded = jwt.verify(token, JWT_SECRET);
//     } catch {
//       return NextResponse.json(
//         { error: "TOKEN_INVALID" },
//         { status: 401 }
//       );
//     }

//     const userId = Number(decoded?.id);

//     if (!Number.isInteger(userId)) {
//       console.log("BAD JWT PAYLOAD:", decoded);
//       return NextResponse.json(
//         { error: "INVALID_TOKEN_PAYLOAD" },
//         { status: 401 }
//       );
//     }

//     /* ================= BODY ================= */

//     const {
//       teachSkill,
//       teachLevel,
//       teachDesc,
//       sessionLength,
//       selectedDays,
//       fromTime,
//       toTime,
//       platform,
//       publicListing,
//     } = await req.json();

//     /* ================= VALIDATION ================= */

//     if (!teachSkill?.trim()) {
//       return NextResponse.json(
//         { error: "SKILL_NAME_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     if (
//       Array.isArray(selectedDays) &&
//       selectedDays.length > 0 &&
//       (!fromTime || !toTime)
//     ) {
//       return NextResponse.json(
//         { error: "TIME_RANGE_REQUIRED_FOR_SELECTED_DAYS" },
//         { status: 400 }
//       );
//     }

//     /* ================= CONFIRM USER EXISTS ================= */

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "USER_NOT_FOUND" },
//         { status: 404 }
//       );
//     }

//     /* ================= CREATE SKILL ================= */

//     const skill = await prisma.skill.create({
//       data: {
//         name: teachSkill.trim(),
//         type: "OFFER",

//         level: teachLevel ?? null,
//         description: teachDesc ?? null,
//         platform: platform ?? null,
//         publicListing: publicListing ?? true,

//         sessionLength: sessionLength
//           ? parseInt(sessionLength, 10)
//           : null,

//         userId,
//         status: "PENDING", // admin approval
//       },
//     });

//     /* ================= CREATE SLOTS ================= */

//     if (
//       Array.isArray(selectedDays) &&
//       selectedDays.length > 0 &&
//       fromTime &&
//       toTime
//     ) {
//       await prisma.skillSlot.createMany({
//         data: selectedDays.map((day: string) => ({
//           skillId: skill.id,
//           day,
//           timeFrom: fromTime,
//           timeTo: toTime,
//         })),
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Skill submitted successfully",
//     });
//   } catch (err) {
//     console.error("CREATE OFFER SKILL ERROR:", err);

//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }

// /* =====================================================
//    GET  /api/skills/offer
//    Fetch logged-in user's offered skills
//    Used for dashboard listing
// ===================================================== */
// export async function GET() {
//   try {
//     const cookieStore = await cookies();

//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ skills: [] });
//     }

//     let decoded: any;

//     try {
//       decoded = jwt.verify(token, JWT_SECRET);
//     } catch {
//       return NextResponse.json({ skills: [] });
//     }

//     const userId = Number(decoded?.id);

//     if (!Number.isInteger(userId)) {
//       return NextResponse.json({ skills: [] });
//     }

//     const skills = await prisma.skill.findMany({
//       where: {
//         userId,
//         type: "OFFER",
//       },
//       include: {
//         slots: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return NextResponse.json({ skills });
//   } catch (err) {
//     console.error("GET OFFER SKILLS ERROR:", err);
//     return NextResponse.json({ skills: [] });
//   }
// }


import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

/* =====================================================
   POST  /api/skills/offer
   EXACT SESSION ONLY (no splitting)
===================================================== */
export async function POST(req: Request) {
  try {
    /* ================= AUTH ================= */

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "TOKEN_INVALID" }, { status: 401 });
    }

    const userId = Number(decoded?.id);

    if (!Number.isInteger(userId)) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
    }

    /* ================= BODY ================= */

    const {
      teachSkill,
      teachLevel,
      teachDesc,
      sessionLength,
      selectedDate, // ⭐ new
      fromTime,
      toTime,
      platform,
      publicListing,
    } = await req.json();

    /* ================= VALIDATION ================= */

    if (!teachSkill?.trim()) {
      return NextResponse.json({ error: "SKILL_NAME_REQUIRED" }, { status: 400 });
    }

    if (!selectedDate) {
      return NextResponse.json({ error: "DATE_REQUIRED" }, { status: 400 });
    }

    if (!fromTime || !toTime) {
      return NextResponse.json({ error: "TIME_REQUIRED" }, { status: 400 });
    }

    const session = Number(sessionLength);

    const start = new Date(`1970-01-01T${fromTime}`);
    const end = new Date(`1970-01-01T${toTime}`);

    const diffMinutes = (end.getTime() - start.getTime()) / 60000;

    // ✅ EXACT match only
    if (diffMinutes !== session) {
      return NextResponse.json(
        { error: "TIME_MUST_EQUAL_SESSION_LENGTH" },
        { status: 400 }
      );
    }

    /* ================= CREATE SKILL ================= */

    const skill = await prisma.skill.create({
      data: {
        name: teachSkill.trim(),
        type: "OFFER",
        level: teachLevel ?? null,
        description: teachDesc ?? null,
        platform: platform ?? null,
        publicListing: publicListing ?? true,
        sessionLength: session,
        userId,
        status: "PENDING",
      },
    });

    /* ================= CREATE SINGLE SLOT ================= */

    const dateObj = new Date(selectedDate);

    const dayName = dateObj.toLocaleDateString("en-US", {
      weekday: "short",
    });

    await prisma.skillSlot.create({
      data: {
        skillId: skill.id,
        date: dateObj,
        day: dayName,
        timeFrom: fromTime,
        timeTo: toTime,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

/* =====================================================
   GET unchanged
===================================================== */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ skills: [] });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = Number(decoded?.id);

    const skills = await prisma.skill.findMany({
      where: { userId, type: "OFFER" },
      include: { slots: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ skills });
  } catch {
    return NextResponse.json({ skills: [] });
  }
}
