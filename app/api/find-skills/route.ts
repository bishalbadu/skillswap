// // after review


// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// /* ================= NORMALIZER ================= */
// function normalize(str: string) {
//   return str.trim().toLowerCase().replace(/\s+/g, " ");
// }

// export async function GET() {
//   try {
//     /* ================= AUTH ================= */
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ skills: [], me: null });
//     }

//     let decoded: { id: number };

//     try {
//       decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET!
//       ) as { id: number };
//     } catch {
//       return NextResponse.json({ skills: [], me: null });
//     }

//     if (!decoded?.id) {
//       return NextResponse.json({ skills: [], me: null });
//     }

//     /* ================= LOAD CURRENT USER ================= */
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
//       .map((s) => normalize(s.name))
//       .filter(Boolean);

//     if (wantSkills.length === 0) {
//       return NextResponse.json({ skills: [], me });
//     }

//     /* ================= FETCH ALL OFFER SKILLS (NO OR FILTER) ================= */
//     const allOfferSkills = await prisma.skill.findMany({
//       where: {
//         type: "OFFER",
//         status: "APPROVED",
//         publicListing: true,
//         userId: { not: me.id },
//         user: { status: "ACTIVE" },
//         slots: {
//           some: { isBooked: false },
//         },
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
//   where: {
//     isBooked: false,
//     date: {
//       gte: new Date(new Date().setHours(0, 0, 0, 0)),
//     },
//   },
//   orderBy: { date: "asc" },
//   select: {
//     id: true,
//     day: true,
//     date: true,
//     timeFrom: true,
//     timeTo: true,
//   },
// },
//       },
//       orderBy: { createdAt: "desc" },
//     });


    
//     /* ================= FILTER IN JS ================= */
//     const filteredSkills = allOfferSkills.filter((s) => {
//       const offeredName = normalize(s.name);

//       return wantSkills.some(
//         (want) =>
//           offeredName.includes(want) ||
//           want.includes(offeredName)
//       );
//     });

//     /* ================= GET MY PENDING REQUESTS ================= */
//     const myPendingRequests = await prisma.swapRequest.findMany({
//       where: {
//         requesterId: me.id,
//         status: "PENDING",
//       },
//       select: { skillId: true },
//     });

//     const requestedSkillIds = new Set(
//       myPendingRequests.map((r) => r.skillId)
//     );

//     /* ================= COLLECT USER IDS ================= */
//     const userIds = [
//       ...new Set(filteredSkills.map((s) => s.user.id)),
//     ];

//     /* ================= GET REVIEWS ================= */
//     let ratingMap: Record<number, { sum: number; count: number }> = {};

//     if (userIds.length > 0) {
//       const reviews = await prisma.review.findMany({
//         where: {
//           revieweeId: { in: userIds },
//         },
//         select: {
//           revieweeId: true,
//           rating: true,
//         },
//       });

//       for (const r of reviews) {
//         if (!ratingMap[r.revieweeId]) {
//           ratingMap[r.revieweeId] = { sum: 0, count: 0 };
//         }

//         ratingMap[r.revieweeId].sum += r.rating;
//         ratingMap[r.revieweeId].count += 1;
//       }
//     }

//     /* ================= FORMAT RESPONSE ================= */
//     const formatted = filteredSkills.map((s) => {
//       const userRatingData = ratingMap[s.user.id];

//       const rating = userRatingData
//         ? userRatingData.sum / userRatingData.count
//         : 0;

//       const reviewsCount = userRatingData
//         ? userRatingData.count
//         : 0;

//       const canRequest = wantSkills.some((want) => {
//         const offeredName = normalize(s.name);
//         return (
//           offeredName.includes(want) ||
//           want.includes(offeredName)
//         );
//       });

//       const alreadyRequested = requestedSkillIds.has(s.id);

//       return {
//         id: s.id,
//         name: s.name,
//         level: s.level ?? "Not specified",
//         description: s.description ?? "No description provided",
//         platform: s.platform ?? "Flexible",
//         sessionLength: s.sessionLength ?? null,
//         rating: Number(rating.toFixed(1)),
//         reviewsCount,
//         slots: s.slots,
//         user: s.user,
//         canRequest,
//         alreadyRequested,
//       };
//     });

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



import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* ================= NORMALIZER ================= */
function normalize(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function GET() {
  try {
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
      .map((s) => normalize(s.name))
      .filter(Boolean);

    if (wantSkills.length === 0) {
      return NextResponse.json({ skills: [], me });
    }

    /* ================= FETCH OFFER SKILLS ================= */
    const allOfferSkills = await prisma.skill.findMany({
      where: {
        type: "OFFER",
        status: "APPROVED",
        publicListing: true,
        userId: { not: me.id },
        user: { status: "ACTIVE" },
        slots: {
          some: {
            isBooked: false,
          },
        },
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
          where: {
            isBooked: false,
          },
          orderBy: {
            date: "asc",
          },
          select: {
            id: true,
            day: true,
            date: true,
            timeFrom: true,
            timeTo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    /* ======================================================
       REMOVE PAST SLOTS (DATE + TIME CHECK)
    ====================================================== */

    const now = new Date();

    const cleanedSkills = allOfferSkills
      .map((skill) => {
        const futureSlots = skill.slots.filter((slot) => {
          if (!slot.date) return false;

const slotEnd = new Date(slot.date);

          const [hours, minutes] = slot.timeTo
            .split(":")
            .map(Number);

          slotEnd.setHours(hours, minutes, 0, 0);

          return slotEnd > now;
        });

        return {
          ...skill,
          slots: futureSlots,
        };
      })
      .filter((skill) => skill.slots.length > 0);

    /* ================= WANT MATCH FILTER ================= */
    const filteredSkills = cleanedSkills.filter((s) => {
      const offeredName = normalize(s.name);

      return wantSkills.some(
        (want) =>
          offeredName.includes(want) ||
          want.includes(offeredName)
      );
    });

    /* ================= GET MY PENDING REQUESTS ================= */
    const myPendingRequests = await prisma.swapRequest.findMany({
      where: {
        requesterId: me.id,
        status: "PENDING",
      },
      select: { skillId: true },
    });

    const requestedSkillIds = new Set(
      myPendingRequests.map((r) => r.skillId)
    );

    /* ================= COLLECT USER IDS ================= */
    const userIds = [
      ...new Set(filteredSkills.map((s) => s.user.id)),
    ];

    /* ================= GET REVIEWS ================= */
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
    const formatted = filteredSkills.map((s) => {
      const userRatingData = ratingMap[s.user.id];

      const rating = userRatingData
        ? userRatingData.sum / userRatingData.count
        : 0;

      const reviewsCount = userRatingData
        ? userRatingData.count
        : 0;

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
        user: s.user,
        canRequest: true,
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