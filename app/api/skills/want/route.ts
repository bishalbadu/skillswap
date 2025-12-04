// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

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
//     where: { userWantedId: decoded.id }
//   });

//   return NextResponse.json({
//     skills: skills.map(s => s.name) // return only skill name strings
//   });
// }

// export async function POST(req: Request) {
//   const cookie = req.headers.get("cookie");
//   const token = cookie?.match(/token=([^;]+)/)?.[1];

//   if (!token) return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET!);
//   } catch (e) {
//     return NextResponse.json({ error: "TOKEN_INVALID" }, { status: 401 });
//   }

//   const { skill } = await req.json();

//   await prisma.skill.create({
//     data: {
//       name: skill,
//       userWantedId: decoded.id,
//     },
//   });

//   return NextResponse.json({ message: "Added" });
// }



import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.match(/token=([^;]+)/)?.[1];
  if (!token) return NextResponse.json({ skills: [] });

  let decoded: any;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET!); }
  catch { return NextResponse.json({ skills: [] }); }

  const skills = await prisma.skill.findMany({
    where: { userWantedId: decoded.id },
    select: {
      id: true,
      name: true
    }
  });

  return NextResponse.json({ skills });
}


export async function POST(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.match(/token=([^;]+)/)?.[1];
  if (!token) return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });

  let decoded: any;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET!); }
  catch { return NextResponse.json({ error: "TOKEN_INVALID" }, { status: 401 }); }

  const { skill } = await req.json();

  await prisma.skill.create({
    data: {
      name: skill,
      userWantedId: decoded.id,
    },
  });

  return NextResponse.json({ success: true });
}
