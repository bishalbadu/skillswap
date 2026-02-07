// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyAdmin } from "@/lib/auth";

// /* ==============================
//    ✅ ONLY GET (LIST SKILLS)
// ============================== */
// export async function GET(req: Request) {
//   try {
//     const admin = await verifyAdmin();

//     if (!admin) {
//       return NextResponse.json(
//         { error: "UNAUTHORIZED" },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(req.url);

//     const q = searchParams.get("q") || "";
//     const type = searchParams.get("type") || "";
//     const status = searchParams.get("status") || "";

//     const skills = await prisma.skill.findMany({
//       where: {
//         AND: [
//           q
//             ? {
//                 OR: [
//                   { name: { contains: q, mode: "insensitive" } },
//                   { description: { contains: q, mode: "insensitive" } },
//                   { learnGoal: { contains: q, mode: "insensitive" } },
//                   { user: { email: { contains: q, mode: "insensitive" } } },
//                 ],
//               }
//             : {},
//           type ? { type: type as any } : {},
//           status ? { status: status as any } : {},
//         ],
//       },

//       select: {
//         id: true,
//         name: true,
//         type: true,
//         level: true,
//         platform: true,
//         status: true,
//         createdAt: true,

//         user: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },

//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ skills });
//   } catch (err) {
//     console.error("ADMIN SKILLS ERROR:", err);

//     return NextResponse.json(
//       { skills: [] },
//       { status: 500 }
//     );
//   }
// }



// after noti


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", skills: [] },
        { status: 401 }
      );
    }

    const skills = await prisma.skill.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ skills });

  } catch (err) {
    console.error("ADMIN SKILLS GET ERROR:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", skills: [] },
      { status: 500 }
    );
  }
}
