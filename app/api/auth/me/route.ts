// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) {
//       return NextResponse.json({ user: null }, { status: 200 });
//     }

//     // Verify JWT
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//     // Get user with avatar + names
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         avatar: true,   // ✔ avatar included
//       },
//     });

//     return NextResponse.json({ user }, { status: 200 });

//   } catch (error) {
//     console.log("JWT ERROR:", error);
//     return NextResponse.json({ user: null }, { status: 200 });
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
      return NextResponse.json(
        { user: null },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true, // ✅ correct
      },
    });

    return NextResponse.json(
      { user },
      { headers: { "Cache-Control": "no-store" } } // 🔥 THIS FIXES IT
    );

  } catch (error) {
    console.error("JWT ERROR:", error);
    return NextResponse.json(
      { user: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
