// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const userId = Number(params.id);

//     if (isNaN(userId)) {
//       return NextResponse.json({ error: "INVALID_USER_ID" }, { status: 400 });
//     }

//     /* ================= AUTH USER ================= */
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     let currentUserId: number | null = null;

//     if (token) {
//       try {
//         const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//         currentUserId = decoded.id;
//       } catch {}
//     }

//     /* ================= USER ================= */
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         avatar: true,
//         bio: true,
//         status: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
//     }

//     if (user.status !== "ACTIVE") {
//       return NextResponse.json({ error: "PROFILE_NOT_AVAILABLE" }, { status: 403 });
//     }

//     /* ================= GET CURRENT USER WANT SKILLS ================= */
//     let wantSkills: string[] = [];
//     let requestedSkillIds = new Set<number>();

//     if (currentUserId) {
//       const wants = await prisma.skill.findMany({
//         where: { userId: currentUserId, type: "WANT" },
//         select: { name: true },
//       });

//       wantSkills = wants.map(w => w.name.toLowerCase());

//       const pending = await prisma.swapRequest.findMany({
//         where: {
//           requesterId: currentUserId,
//           status: "PENDING",
//         },
//         select: { skillId: true },
//       });

//       requestedSkillIds = new Set(pending.map(p => p.skillId));
//     }

//     /* ================= OFFERED SKILLS ================= */
//     const skills = await prisma.skill.findMany({
//       where: {
//         userId,
//         type: "OFFER",
//         status: "APPROVED",
//         publicListing: true,
//       },
//       include: {
//         slots: {
//           where: { isBooked: false },
//           orderBy: { date: "asc" },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     /* ================= FORMAT ================= */
//     const formattedSkills = skills.map((s) => {
//       const canRequest = wantSkills.some(w =>
//         s.name.toLowerCase().includes(w)
//       );

//       const alreadyRequested = requestedSkillIds.has(s.id);

//       return {
//         id: s.id,
//         name: s.name,
//         level: s.level,
//         description: s.description,
//         platform: s.platform,
//         sessionLength: s.sessionLength,
//         slots: s.slots,

//         // ⭐ NEW FLAGS
//         canRequest,
//         alreadyRequested,
//       };
//     });

//     return NextResponse.json({
//       user: {
//         ...user,
//         rating: 4.5,
//         reviewsCount: 55,
//       },
//       skillsOffered: formattedSkills,
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
//   }
// }


// after reviews



import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "INVALID_USER_ID" },
        { status: 400 }
      );
    }

    /* ================= AUTH CURRENT USER ================= */
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];

    let currentUserId: number | null = null;

    if (token) {
      try {
        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET!
        );
        currentUserId = decoded.id;
      } catch {}
    }

    /* ================= FETCH USER ================= */
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "PROFILE_NOT_AVAILABLE" },
        { status: 403 }
      );
    }

    /* ================= CALCULATE REAL RATING ================= */

    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: user.id,
      },
      select: {
        rating: true,
      },
    });

    const reviewsCount = reviews.length;

    const rating =
      reviewsCount === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviewsCount;

    /* ================= GET CURRENT USER WANT SKILLS ================= */

    let wantSkills: string[] = [];
    let requestedSkillIds = new Set<number>();

    if (currentUserId) {
      const wants = await prisma.skill.findMany({
        where: {
          userId: currentUserId,
          type: "WANT",
        },
        select: { name: true },
      });

      wantSkills = wants.map((w) => w.name.toLowerCase());

      const pendingRequests = await prisma.swapRequest.findMany({
        where: {
          requesterId: currentUserId,
          status: "PENDING",
        },
        select: { skillId: true },
      });

      requestedSkillIds = new Set(
        pendingRequests.map((p) => p.skillId)
      );
    }

    /* ================= FETCH OFFERED SKILLS ================= */

    const skills = await prisma.skill.findMany({
      where: {
        userId,
        type: "OFFER",
        status: "APPROVED",
        publicListing: true,
      },
      include: {
        slots: {
          where: {
            isBooked: false,
          },
          orderBy: { date: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    /* ================= FORMAT SKILLS ================= */

    const formattedSkills = skills.map((s) => {
      const canRequest = wantSkills.some((w) =>
        s.name.toLowerCase().includes(w)
      );

      const alreadyRequested = requestedSkillIds.has(s.id);

      return {
        id: s.id,
        name: s.name,
        level: s.level,
        description: s.description,
        platform: s.platform,
        sessionLength: s.sessionLength,
        slots: s.slots,
        canRequest,
        alreadyRequested,
      };
    });

    /* ================= FINAL RESPONSE ================= */

    return NextResponse.json({
      user: {
        ...user,
        rating: Number(rating.toFixed(1)),
        reviewsCount,
      },
      skillsOffered: formattedSkills,
    });

  } catch (error) {
    console.error("PUBLIC PROFILE ERROR:", error);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
