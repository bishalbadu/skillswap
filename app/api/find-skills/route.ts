// any can sent request even if not in want list

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

//     // 👤 Load current user + WANT skills
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

//     // 🔍 Find APPROVED + PUBLIC + ACTIVE offer skills
//     const matchedSkills = await prisma.skill.findMany({
//       where: {
//         type: "OFFER",
//         status: "APPROVED",              // ✅ ADMIN MODERATION
//         publicListing: true,
//         userId: { not: me.id },

//         user: {
//           status: "ACTIVE",              // ✅ BLOCK SUSPENDED USERS
//         },

//         slots: {
//           some: { isBooked: false },     // ✅ SLOT-AWARE
//         },

//         OR: wantSkills.map((skill) => ({
//           name: {
//             contains: skill,
//             mode: "insensitive",
//           },
//         })),
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             avatar: true,
//           },
//         },
//         slots: {
//   where: { isBooked: false },
//   orderBy: { date: "asc" },   // ⭐ better than day
//   select: {
//     id: true,
//     day: true,
//     date: true,              // ⭐ THIS IS THE REAL FIELD
//     timeFrom: true,
//     timeTo: true,
//   },
// },

//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // 🧼 Defensive formatting (VERY IMPORTANT)
//     const formatted = matchedSkills.map((s) => ({
//       id: s.id,
//       name: s.name,

//       level: s.level ?? "Not specified",
//       description: s.description ?? "No description provided",
//       platform: s.platform ?? "Flexible",
//       sessionLength: s.sessionLength ?? null,

//       rating: 4.5,          // placeholder (future review model)
//       reviewsCount: 55,     // placeholder

//       slots: s.slots,

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
//     console.error("FIND SKILLS API ERROR:", err);
//     return NextResponse.json(
//       { skills: [], me: null },
//       { status: 500 }
//     );
//   }
// }






// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     /* ================= AUTH ================= */
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

//     /* ================= LOAD USER + WANT SKILLS ================= */
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

//     /* ================= FIND MATCHED OFFER SKILLS ================= */
//     const matchedSkills = await prisma.skill.findMany({
//       where: {
//         type: "OFFER",
//         status: "APPROVED",
//         publicListing: true,
//         userId: { not: me.id },

//         user: {
//           status: "ACTIVE",
//         },

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
//         user: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             avatar: true,
//           },
//         },

//         slots: {
//           where: { isBooked: false },
//           orderBy: { date: "asc" },
//           select: {
//             id: true,
//             day: true,
//             date: true,
//             timeFrom: true,
//             timeTo: true,
//           },
//         },
//       },

//       orderBy: { createdAt: "desc" },
//     });

//     /* ================= GET ALL USER PENDING REQUESTS (OPTIMIZED) ================= */
//     const myPendingRequests = await prisma.swapRequest.findMany({
//       where: {
//         requesterId: me.id,
//         status: "PENDING",
//       },
//       select: {
//         skillId: true,
//       },
//     });

//     const requestedSkillIds = new Set(
//       myPendingRequests.map((r) => r.skillId)
//     );

//     /* ================= FORMAT RESPONSE ================= */
//     const formatted = matchedSkills.map((s) => {
//       const canRequest = wantSkills.some((w) =>
//         s.name.toLowerCase().includes(w)
//       );

//       const alreadyRequested = requestedSkillIds.has(s.id);

//       return {
//         id: s.id,
//         name: s.name,

//         level: s.level ?? "Not specified",
//         description: s.description ?? "No description provided",
//         platform: s.platform ?? "Flexible",
//         sessionLength: s.sessionLength ?? null,

//         rating: 4.5,
//         reviewsCount: 55,

//         slots: s.slots,

//         user: {
//           id: s.user.id,
//           firstName: s.user.firstName,
//           lastName: s.user.lastName,
//           avatar: s.user.avatar,
//         },

//         // ⭐ NEW FLAGS FOR FRONTEND
//         canRequest,
//         alreadyRequested,
//       };
//     });

//     /* ================= RESPONSE ================= */
//     return NextResponse.json({
//       skills: formatted,
//       me: {
//         id: me.id,
//         skillsWanted: me.skills,
//       },
//     });
//   } catch (err) {
//     console.error("FIND SKILLS API ERROR:", err);

//     return NextResponse.json(
//       { skills: [], me: null },
//       { status: 500 }
//     );
//   }
// }




// after review


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function GET(req: Request) {
  try {
    /* ================= AUTH ================= */
    /* ================= AUTH ================= */
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

if (!token) {
  return NextResponse.json({ skills: [], me: null });
}

let decoded: { id: number };

try {
  decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as { id: number };
} catch {
  return NextResponse.json({ skills: [], me: null });
}

if (!decoded?.id) {
  return NextResponse.json({ skills: [], me: null });
}


    /* ================= LOAD CURRENT USER ================= */
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

    /* ================= FIND MATCHED OFFER SKILLS ================= */
    const matchedSkills = await prisma.skill.findMany({
      where: {
        type: "OFFER",
        status: "APPROVED",
        publicListing: true,
        userId: { not: me.id },

        user: {
          status: "ACTIVE",
        },

        slots: {
          some: { isBooked: false },
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
          orderBy: { date: "asc" },
          select: {
            id: true,
            day: true,
            date: true,
            timeFrom: true,
            timeTo: true,
          },
        },
      },

      orderBy: { createdAt: "desc" },
    });

    /* ================= GET MY PENDING REQUESTS ================= */
    const myPendingRequests = await prisma.swapRequest.findMany({
      where: {
        requesterId: me.id,
        status: "PENDING",
      },
      select: {
        skillId: true,
      },
    });

    const requestedSkillIds = new Set(
      myPendingRequests.map((r) => r.skillId)
    );

    /* ================= COLLECT UNIQUE USER IDS ================= */
    const userIds = [
      ...new Set(matchedSkills.map((s) => s.user.id)),
    ];

    /* ================= GET ALL REVIEWS FOR THESE USERS ================= */
    /* ================= GET REVIEWS SAFELY ================= */

let ratingMap: Record<number, { sum: number; count: number }> = {};

if (userIds.length > 0) {
  const reviews = await prisma.review.findMany({
    where: {
      revieweeId: { in: userIds },
    },
    select: {
      revieweeId: true,
      rating: true,
    },
  });

  for (const r of reviews) {
    if (!ratingMap[r.revieweeId]) {
      ratingMap[r.revieweeId] = { sum: 0, count: 0 };
    }

    ratingMap[r.revieweeId].sum += r.rating;
    ratingMap[r.revieweeId].count += 1;
  }
}

    /* ================= FORMAT RESPONSE ================= */
    const formatted = matchedSkills.map((s) => {
      const userRatingData = ratingMap[s.user.id];

      const rating = userRatingData
        ? userRatingData.sum / userRatingData.count
        : 0;

      const reviewsCount = userRatingData
        ? userRatingData.count
        : 0;

      const canRequest = wantSkills.some((w) =>
        s.name.toLowerCase().includes(w)
      );

      const alreadyRequested = requestedSkillIds.has(s.id);

      return {
        id: s.id,
        name: s.name,

        level: s.level ?? "Not specified",
        description: s.description ?? "No description provided",
        platform: s.platform ?? "Flexible",
        sessionLength: s.sessionLength ?? null,

        rating: Number(rating.toFixed(1)),
        reviewsCount,

        slots: s.slots,

        user: {
          id: s.user.id,
          firstName: s.user.firstName,
          lastName: s.user.lastName,
          avatar: s.user.avatar,
        },

        canRequest,
        alreadyRequested,
      };
    });

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
