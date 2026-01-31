// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) {
//       return NextResponse.json({ skills: [], me: null });
//     }

//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     } catch {
//       return NextResponse.json({ skills: [], me: null });
//     }

//     // 🔹 Load current user + WANT skills
//     const me = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       include: {
//         skills: {
//           where: { type: "WANT" },
//         },
//       },
//     });

//     if (!me) {
//       return NextResponse.json({ skills: [], me: null });
//     }

//     const wantSkills = me.skills
//       .map((s) => s.name.trim().toLowerCase())
//       .filter(Boolean);

//     if (wantSkills.length === 0) {
//       return NextResponse.json({ skills: [], me });
//     }

//     // 🔹 Find OFFER skills with FREE slots
//     const matchedSkills = await prisma.skill.findMany({
//       where: {
//         type: "OFFER",
//         userId: { not: me.id },
//         publicListing: true,

//         // ⭐ SLOT-AWARE FILTER
//         slots: {
//           some: { isBooked: false },
//         },

//         OR: wantSkills.map((skill) => ({
//           name: {
//             contains: skill,
//             mode: "insensitive",
//           },
//         })),
//       },
//       include: {
//         user: true,
//         slots: {
//           where: { isBooked: false }, // only free slots
//           orderBy: { day: "asc" },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     const formatted = matchedSkills.map((s) => ({
//       id: s.id,
//       name: s.name,
//       level: s.level,
//       description: s.description,
//       platform: s.platform,

//       rating: 4.5,
//       reviewsCount: 55,

//       slots: s.slots.map((slot) => ({
//         id: slot.id,
//         day: slot.day,
//         timeFrom: slot.timeFrom,
//         timeTo: slot.timeTo,
//       })),

//       user: {
//         id: s.user.id,
//         firstName: s.user.firstName,
//         lastName: s.user.lastName,
//         avatar: s.user.avatar,
//       },
//     }));

//     return NextResponse.json({
//       skills: formatted,
//       me: {
//         id: me.id,
//         skillsWanted: me.skills,
//       },
//     });
//   } catch (err) {
//     console.error("API ERROR /find-skills:", err);
//     return NextResponse.json({ skills: [], me: null });
//   }
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ skills: [], me: null });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ skills: [], me: null });
    }

    // 👤 Load current user + WANT skills
    const me = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        skills: {
          where: { type: "WANT" },
        },
      },
    });

    if (!me) {
      return NextResponse.json({ skills: [], me: null });
    }

    const wantSkills = me.skills
      .map((s) => s.name.trim().toLowerCase())
      .filter(Boolean);

    if (wantSkills.length === 0) {
      return NextResponse.json({ skills: [], me });
    }

    // 🔍 Find APPROVED + PUBLIC + ACTIVE offer skills
    const matchedSkills = await prisma.skill.findMany({
      where: {
        type: "OFFER",
        status: "APPROVED",              // ✅ ADMIN MODERATION
        publicListing: true,
        userId: { not: me.id },

        user: {
          status: "ACTIVE",              // ✅ BLOCK SUSPENDED USERS
        },

        slots: {
          some: { isBooked: false },     // ✅ SLOT-AWARE
        },

        OR: wantSkills.map((skill) => ({
          name: {
            contains: skill,
            mode: "insensitive",
          },
        })),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        slots: {
          where: { isBooked: false },
          orderBy: { day: "asc" },
          select: {
            id: true,
            day: true,
            timeFrom: true,
            timeTo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 🧼 Defensive formatting (VERY IMPORTANT)
    const formatted = matchedSkills.map((s) => ({
      id: s.id,
      name: s.name,

      level: s.level ?? "Not specified",
      description: s.description ?? "No description provided",
      platform: s.platform ?? "Flexible",
      sessionLength: s.sessionLength ?? null,

      rating: 4.5,          // placeholder (future review model)
      reviewsCount: 55,     // placeholder

      slots: s.slots,

      user: {
        id: s.user.id,
        firstName: s.user.firstName,
        lastName: s.user.lastName,
        avatar: s.user.avatar,
      },
    }));

    return NextResponse.json({
      skills: formatted,
      me: {
        id: me.id,
        skillsWanted: me.skills,
      },
    });
  } catch (err) {
    console.error("FIND SKILLS API ERROR:", err);
    return NextResponse.json(
      { skills: [], me: null },
      { status: 500 }
    );
  }
}
