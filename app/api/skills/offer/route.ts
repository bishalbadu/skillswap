// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   const cookie = req.headers.get("cookie");
//   const token = cookie?.match(/token=([^;]+)/)?.[1];

//   if (!token)
//     return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET!);
//   } catch (e) {
//     return NextResponse.json({ error: "TOKEN_INVALID" }, { status: 401 });
//   }

//   const {
//     teachSkill,
//     teachLevel,
//     teachDesc,
//     learnSkill,
//     learnLevel,
//     learnGoal,
//     sessionLength,
//     selectedDays,
//     fromTime,
//     toTime,
//     platform,
//     publicListing,
//   } = await req.json();

//   await prisma.skill.create({
//     data: {
//       name: teachSkill,
//       level: teachLevel,
//       description: teachDesc,

//       learnSkill,
//       learnLevel,
//       learnGoal,

//       sessionLength: parseInt(sessionLength),
//       days: selectedDays?.join(",") ?? "",
//       timeFrom: fromTime,
//       timeTo: toTime,
//       platform,
//       publicListing,

//       userOfferedId: decoded.id,
//     }
//   });

//   return NextResponse.json({ message: "Skill stored successfully" });
// }

// export async function GET(req: Request) {
//   const cookie = req.headers.get("cookie");
//   const token = cookie?.match(/token=([^;]+)/)?.[1];

//   if (!token) return NextResponse.json({ skills: [] });

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET!);
//   } catch (e) {
//     return NextResponse.json({ skills: [] });
//   }

//   const skills = await prisma.skill.findMany({
//     where: { userOfferedId: decoded.id }
//   });

//  return NextResponse.json({ skills });

// }





import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.match(/token=([^;]+)/)?.[1];

  if (!token) return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });

  let decoded: any;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET!); }
  catch { return NextResponse.json({ error: "TOKEN_INVALID" }, { status: 401 }); }

  const body = await req.json();

  await prisma.skill.create({
    data: {
      name: body.teachSkill,
      level: body.teachLevel,
      description: body.teachDesc,

      learnSkill: body.learnSkill,
      learnLevel: body.learnLevel,
      learnGoal: body.learnGoal,

      sessionLength: parseInt(body.sessionLength),
      days: body.selectedDays?.join(",") ?? "",
      timeFrom: body.fromTime,
      timeTo: body.toTime,
      platform: body.platform,
      publicListing: body.publicListing,

      userOfferedId: decoded.id,
    }
  });

  return NextResponse.json({ success: true });
}


export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.match(/token=([^;]+)/)?.[1];
  if (!token) return NextResponse.json({ skills: [] });

  let decoded: any;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET!); }
  catch { return NextResponse.json({ skills: [] }); }

  const skills = await prisma.skill.findMany({
    where: { userOfferedId: decoded.id },
    select: {
      id: true,
      name: true,
      level: true,
      description: true
    }
  });

  return NextResponse.json({ skills });
}
