// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// )
//  {
//   try {
//    const { id } = await context.params; // ✅ FIX
// const userId = Number(id);


//     if (isNaN(userId)) {
//       return NextResponse.json(
//         { error: "INVALID_USER_ID" },
//         { status: 400 }
//       );
//     }

//     /* ================= AUTH CURRENT USER ================= */
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     let currentUserId: number | null = null;

//     if (token) {
//       try {
//         const decoded: any = jwt.verify(
//           token,
//           process.env.JWT_SECRET!
//         );
//         currentUserId = decoded.id;
//       } catch {}
//     }

//     /* ================= FETCH USER ================= */
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
//       return NextResponse.json(
//         { error: "USER_NOT_FOUND" },
//         { status: 404 }
//       );
//     }

//     if (user.status !== "ACTIVE") {
//       return NextResponse.json(
//         { error: "PROFILE_NOT_AVAILABLE" },
//         { status: 403 }
//       );
//     }

//     /* ================= CALCULATE REAL RATING ================= */

//     const reviews = await prisma.review.findMany({
//       where: {
//         revieweeId: user.id,
//       },
//       select: {
//         rating: true,
//       },
//     });

//     const reviewsCount = reviews.length;

//     const rating =
//       reviewsCount === 0
//         ? 0
//         : reviews.reduce((sum, r) => sum + r.rating, 0) /
//           reviewsCount;

//     /* ================= GET CURRENT USER WANT SKILLS ================= */

//     let wantSkills: string[] = [];
//     let requestedSkillIds = new Set<number>();

//     if (currentUserId) {
//       const wants = await prisma.skill.findMany({
//         where: {
//           userId: currentUserId,
//           type: "WANT",
//         },
//         select: { name: true },
//       });

//       wantSkills = wants.map((w) => w.name.toLowerCase());

//       const pendingRequests = await prisma.swapRequest.findMany({
//         where: {
//           requesterId: currentUserId,
//           status: "PENDING",
//         },
//         select: { skillId: true },
//       });

//       requestedSkillIds = new Set(
//         pendingRequests.map((p) => p.skillId)
//       );
//     }

//     /* ================= FETCH OFFERED SKILLS ================= */

//     const skills = await prisma.skill.findMany({
//       where: {
//         userId,
//         type: "OFFER",
//         status: "APPROVED",
//         publicListing: true,
//       },
//       include: {
//         slots: {
//           where: {
//             isBooked: false,
//           },
//           orderBy: { date: "asc" },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     /* ================= FORMAT SKILLS ================= */

//     const formattedSkills = skills.map((s) => {
//       const canRequest = wantSkills.some((w) =>
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
//         canRequest,
//         alreadyRequested,
//       };
//     });

//     /* ================= FINAL RESPONSE ================= */

//     return NextResponse.json({
//       user: {
//         ...user,
//         rating: Number(rating.toFixed(1)),
//         reviewsCount,
//       },
//       skillsOffered: formattedSkills,
//     });

//   } catch (error) {
//     console.error("PUBLIC PROFILE ERROR:", error);

//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(
req: Request,
context: { params: Promise<{ id: string }> }
) {
try {
const { id } = await context.params;
const userId = Number(id);

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

const now = new Date();

/* ================= FORMAT SKILLS + FILTER EXPIRED ================= */

const formattedSkills = skills.map((s) => {

  // ✅ filter only future slots
  const validSlots = s.slots.filter((slot) => {

    const slotDate = new Date(slot.date);

    // combine date + timeTo
    const slotDateTime = new Date(
      `${slotDate.toISOString().split("T")[0]}T${slot.timeTo}`
    );

    return slotDateTime > now;
  });

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
    slots: validSlots, // ✅ only valid ones now
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
