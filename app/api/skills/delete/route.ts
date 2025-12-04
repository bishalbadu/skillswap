// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   const cookie = req.headers.get("cookie");
//   const token = cookie?.match(/token=([^;]+)/)?.[1];

//   if (!token) return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET!);
//   } catch {
//     return NextResponse.json({ error: "TOKEN_INVALID" }, { status: 401 });
//   }

//   const { skill, type } = await req.json();

//   if (type === "offer") {
//     await prisma.skill.deleteMany({
//       where: { name: skill, userOfferedId: decoded.id },
//     });
//   }

//   if (type === "want") {
//     await prisma.skill.deleteMany({
//       where: { name: skill, userWantedId: decoded.id },
//     });
//   }

//   return NextResponse.json({ success: true });
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

  const { skill, type } = await req.json();

  if (type === "offer") {
    await prisma.skill.deleteMany({
      where: { name: skill, userOfferedId: decoded.id },
    });
  }

  if (type === "want") {
    await prisma.skill.deleteMany({
      where: { name: skill, userWantedId: decoded.id },
    });
  }

  return NextResponse.json({ success: true });
}
