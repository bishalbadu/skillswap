// import { cookies } from "next/headers";
// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET!;

// /* ============================================================
//    AUTH HELPER
// ============================================================ */

// async function getUserId() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) return null;

//   try {
//     const decoded: any = jwt.verify(token, JWT_SECRET);
//     return Number(decoded?.id);
//   } catch {
//     return null;
//   }
// }

// /* ============================================================
//    POST → CREATE SKILL OR ADD SLOT
// ============================================================ */

// export async function POST(req: Request) {
//   try {
//     const userId = await getUserId();

//     if (!userId) {
//       return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
//     }

//     const {
//   teachSkill,
//   teachLevel,
//   teachDesc,
//   sessionLength,
//   selectedDate,
//   fromTime,
//   toTime,
//   platform,
//   publicListing,
//   editId,
//   proofs
// } = await req.json();

//     /* ================= VALIDATION ================= */

//     if (!teachSkill?.trim()) {
//       return NextResponse.json(
//         { error: "SKILL_NAME_REQUIRED" },
//         { status: 400 }
//       );
//     }

//     if (!selectedDate || !fromTime || !toTime) {
//       return NextResponse.json(
//         { error: "DATE_TIME_REQUIRED" },
//         { status: 400 }
//       );
//     }

// if (!proofs || proofs.length === 0) {
//   return NextResponse.json(
//     { error: "CERTIFICATION_REQUIRED" },
//     { status: 400 }
//   );
// }

//     const session = Number(sessionLength);

//     const start = new Date(`1970-01-01T${fromTime}`);
//     const end = new Date(`1970-01-01T${toTime}`);

//     const diffMinutes = (end.getTime() - start.getTime()) / 60000;

//     if (diffMinutes !== session) {
//       return NextResponse.json(
//         { error: "TIME_MUST_EQUAL_SESSION_LENGTH" },
//         { status: 400 }
//       );
//     }

//     /* ================= PREVENT PAST SLOT ================= */

//     const now = new Date();
//     const dateObj = new Date(selectedDate);

//     const slotEnd = new Date(selectedDate);
//     const [h, m] = toTime.split(":").map(Number);
//     slotEnd.setHours(h, m, 0, 0);

//     if (slotEnd <= now) {
//       return NextResponse.json(
//         { error: "CANNOT_CREATE_PAST_SLOT" },
//         { status: 400 }
//       );
//     }

//     /* ============================================================
//        FIND OR CREATE SKILL
//     ============================================================ */

//     let skill;

//     if (editId) {
//       // 🔥 EDIT MODE → Only add slot
//       skill = await prisma.skill.findFirst({
//         where: {
//           id: Number(editId),
//           userId,
//           type: "OFFER",
//         },
//       });

//       if (!skill) {
//         return NextResponse.json(
//           { error: "SKILL_NOT_FOUND" },
//           { status: 404 }
//         );
//       }

//       // ✅ DO NOT TOUCH STATUS
//     } else {
//       // 🔥 CREATE MODE
//       skill = await prisma.skill.findFirst({
//         where: {
//           userId,
//           type: "OFFER",
//           name: {
//             equals: teachSkill.trim(),
//             mode: "insensitive",
//           },
//         },
//       });

//       if (!skill) {
//         // ✅ Only new skill is PENDING
//       skill = await prisma.skill.create({
//   data: {
//     name: teachSkill.trim(),
//     type: "OFFER",
//     level: teachLevel ?? null,
//     description: teachDesc ?? null,
//     platform: platform ?? null,
//     publicListing: publicListing ?? true,
//     sessionLength: session,
//     userId,
//     status: "PENDING"
//   },
// });

// // Save uploaded proofs
// if (proofs && proofs.length > 0) {
//   await prisma.skillProof.createMany({
//     data: proofs.map((p: any) => ({
//       skillId: skill.id,
//       url: p.url,
//       type: p.type
//     }))
//   });
// }

//     /* ============================================================
//        PREVENT DUPLICATE SLOT
//     ============================================================ */

//     const existingSlot = await prisma.skillSlot.findFirst({
//       where: {
//         skillId: skill.id,
//         date: dateObj,
//         timeFrom: fromTime,
//         timeTo: toTime,
//       },
//     });

//     if (existingSlot) {
//       return NextResponse.json(
//         { error: "SLOT_ALREADY_EXISTS" },
//         { status: 400 }
//       );
//     }

//     /* ============================================================
//        CREATE SLOT
//     ============================================================ */

//     const dayName = dateObj.toLocaleDateString("en-US", {
//       weekday: "short",
//     });

//     await prisma.skillSlot.create({
//       data: {
//         skillId: skill.id,
//         date: dateObj,
//         day: dayName,
//         timeFrom: fromTime,
//         timeTo: toTime,
//       },
//     });

//     return NextResponse.json({ success: true });

//   } catch (err) {
//     console.error("OFFER ERROR:", err);
//     return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
//   }
// }

// /* ============================================================
//    GET → LIST OR SINGLE SKILL
// ============================================================ */

// export async function GET(req: Request) {
//   try {
//     const userId = await getUserId();

//     if (!userId) {
//       return NextResponse.json({ skills: [] });
//     }

//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     const now = new Date();

//     /* ================= SINGLE SKILL ================= */

//     if (id) {
//       const skill = await prisma.skill.findFirst({
//         where: {
//           id: Number(id),
//           userId,
//           type: "OFFER",
//         },
//         include: {
//           slots: {
//             orderBy: { date: "asc" },
//           },
//         },
//       });

//       if (!skill) {
//         return NextResponse.json({ skill: null });
//       }

//       // 🔥 Remove expired slots
//       const cleanedSlots = skill.slots.filter((slot) => {
//         if (!slot.date || !slot.timeTo) return false;

//         const slotEnd = new Date(slot.date);
//         const [hours, minutes] = slot.timeTo.split(":").map(Number);
//         slotEnd.setHours(hours, minutes, 0, 0);

//         return slotEnd > now;
//       });

//       return NextResponse.json({
//         skill: {
//           ...skill,
//           slots: cleanedSlots,
//         },
//       });
//     }

//     /* ================= ALL OFFER SKILLS ================= */

//     const skills = await prisma.skill.findMany({
//       where: {
//         userId,
//         type: "OFFER",
//       },
//       include: {
//         slots: {
//           orderBy: { date: "asc" },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     const cleanedSkills = skills.map((skill) => {
//       const futureSlots = skill.slots.filter((slot) => {
//         if (!slot.date || !slot.timeTo) return false;

//         const slotEnd = new Date(slot.date);
//         const [hours, minutes] = slot.timeTo.split(":").map(Number);
//         slotEnd.setHours(hours, minutes, 0, 0);

//         return slotEnd > now;
//       });

//       return {
//         ...skill,
//         slots: futureSlots,
//       };
//     });

//     return NextResponse.json({ skills: cleanedSkills });

//   } catch (err) {
//     console.error("GET OFFER ERROR:", err);
//     return NextResponse.json({ skills: [] });
//   }
// }



import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Skill } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

/* ============================================================
AUTH HELPER
============================================================ */

async function getUserId() {
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

if (!token) return null;

try {
const decoded: any = jwt.verify(token, JWT_SECRET);
return Number(decoded?.id);
} catch {
return null;
}
}

/* ============================================================
POST → CREATE SKILL OR ADD SLOT
============================================================ */

export async function POST(req: Request) {
try {
const userId = await getUserId();


if (!userId) {
  return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
}

const {
  teachSkill,
  teachLevel,
  teachDesc,
  sessionLength,
  selectedDate,
  fromTime,
  toTime,
  platform,
  publicListing,
  editId,
  proofs
} = await req.json();

/* ================= VALIDATION ================= */

if (!teachSkill?.trim()) {
  return NextResponse.json(
    { error: "SKILL_NAME_REQUIRED" },
    { status: 400 }
  );
}

if (!selectedDate || !fromTime || !toTime) {
  return NextResponse.json(
    { error: "DATE_TIME_REQUIRED" },
    { status: 400 }
  );
}

if (!proofs || proofs.length === 0) {
  return NextResponse.json(
    { error: "CERTIFICATION_REQUIRED" },
    { status: 400 }
  );
}

const session = Number(sessionLength);

const start = new Date(`1970-01-01T${fromTime}`);
const end = new Date(`1970-01-01T${toTime}`);

const diffMinutes = (end.getTime() - start.getTime()) / 60000;

if (diffMinutes !== session) {
  return NextResponse.json(
    { error: "TIME_MUST_EQUAL_SESSION_LENGTH" },
    { status: 400 }
  );
}

/* ================= PREVENT PAST SLOT ================= */

const now = new Date();
const dateObj = new Date(selectedDate);

const slotEnd = new Date(selectedDate);
const [h, m] = toTime.split(":").map(Number);
slotEnd.setHours(h, m, 0, 0);

if (slotEnd <= now) {
  return NextResponse.json(
    { error: "CANNOT_CREATE_PAST_SLOT" },
    { status: 400 }
  );
}

/* ============================================================
   FIND OR CREATE SKILL
============================================================ */

let skill: Skill | null = null;

if (editId) {

  skill = await prisma.skill.findFirst({
    where: {
      id: Number(editId),
      userId,
      type: "OFFER"
    }
  });

  if (!skill) {
    return NextResponse.json(
      { error: "SKILL_NOT_FOUND" },
      { status: 404 }
    );
  }

} else {

  skill = await prisma.skill.findFirst({
    where: {
      userId,
      type: "OFFER",
      name: {
        equals: teachSkill.trim(),
        mode: "insensitive"
      }
    }
  });

  if (!skill) {

    skill = await prisma.skill.create({
      data: {
        name: teachSkill.trim(),
        type: "OFFER",
        level: teachLevel ?? null,
        description: teachDesc ?? null,
        platform: platform ?? null,
        publicListing: publicListing ?? true,
        sessionLength: session,
        userId,
        status: "PENDING"
      }
    });

    /* ================= SAVE PROOFS ================= */

    if (proofs && proofs.length > 0) {
      await prisma.skillProof.createMany({
        data: proofs.map((p: any) => ({
          skillId: skill!.id,
          url: p.url,
          type: p.type
        }))
      });
    }

  }

}

if (!skill) {
  return NextResponse.json(
    { error: "SKILL_NOT_FOUND" },
    { status: 404 }
  );
}

/* ============================================================
   PREVENT DUPLICATE SLOT
============================================================ */

const existingSlot = await prisma.skillSlot.findFirst({
  where: {
    skillId: skill.id,
    date: dateObj,
    timeFrom: fromTime,
    timeTo: toTime
  }
});

if (existingSlot) {
  return NextResponse.json(
    { error: "SLOT_ALREADY_EXISTS" },
    { status: 400 }
  );
}

/* ============================================================
   CREATE SLOT
============================================================ */

const dayName = dateObj.toLocaleDateString("en-US", {
  weekday: "short"
});

await prisma.skillSlot.create({
  data: {
    skillId: skill.id,
    date: dateObj,
    day: dayName,
    timeFrom: fromTime,
    timeTo: toTime
  }
});

return NextResponse.json({ success: true });

} catch (err) {
console.error("OFFER ERROR:", err);
return NextResponse.json(
{ error: "SERVER_ERROR" },
{ status: 500 }
);
}
}

/* ============================================================
GET → LIST OR SINGLE SKILL
============================================================ */

export async function GET(req: Request) {
try {
const userId = await getUserId();


if (!userId) {
  return NextResponse.json({ skills: [] });
}

const { searchParams } = new URL(req.url);
const id = searchParams.get("id");

const now = new Date();

/* ================= SINGLE SKILL ================= */

if (id) {

  const skill = await prisma.skill.findFirst({
    where: {
      id: Number(id),
      userId,
      type: "OFFER"
    },
    include: {
      slots: {
        orderBy: { date: "asc" }
      }
    }
  });

  if (!skill) {
    return NextResponse.json({ skill: null });
  }

  const cleanedSlots = skill.slots.filter((slot) => {

    const slotEnd = new Date(slot.date);
    const [h, m] = slot.timeTo.split(":").map(Number);
    slotEnd.setHours(h, m, 0, 0);

    return slotEnd > now;

  });

  return NextResponse.json({
    skill: {
      ...skill,
      slots: cleanedSlots
    }
  });

}

/* ================= ALL OFFER SKILLS ================= */

const skills = await prisma.skill.findMany({
  where: {
    userId,
    type: "OFFER"
  },
  include: {
    slots: {
      orderBy: { date: "asc" }
    }
  },
  orderBy: {
    createdAt: "desc"
  }
});

const cleanedSkills = skills.map((skill) => {

  const futureSlots = skill.slots.filter((slot) => {

    const slotEnd = new Date(slot.date);
    const [h, m] = slot.timeTo.split(":").map(Number);
    slotEnd.setHours(h, m, 0, 0);

    return slotEnd > now;

  });

  return {
    ...skill,
    slots: futureSlots
  };

});

return NextResponse.json({ skills: cleanedSkills });


} catch (err) {
console.error("GET OFFER ERROR:", err);
return NextResponse.json({ skills: [] });
}
}
