// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) {
//       return NextResponse.json(
//         { user: null },
//         { headers: { "Cache-Control": "no-store" } }
//       );
//     }

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         avatar: true, // ✅ correct
//       },
//     });

//     return NextResponse.json(
//       { user },
//       { headers: { "Cache-Control": "no-store" } } // 🔥 THIS FIXES IT
//     );

//   } catch (error) {
//     console.error("JWT ERROR:", error);
//     return NextResponse.json(
//       { user: null },
//       { headers: { "Cache-Control": "no-store" } }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import prisma from "@/lib/prisma";

// export async function GET(req: Request) {
//   try {
//     const cookie = req.headers.get("cookie") || "";
//     const token = cookie.match(/token=([^;]+)/)?.[1];

//     if (!token) {
//       return NextResponse.json({ user: null });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

//     // 🔒 CRITICAL GUARD
//     if (typeof decoded.id !== "number") {
//       // This is an ADMIN token → ignore
//       return NextResponse.json({ user: null });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         avatar: true,
//       },
//     });

//     return NextResponse.json({ user });
//   } catch (err) {
//     console.error("JWT ERROR:", err);
//     return NextResponse.json({ user: null });
//   }
// }

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ MUST await
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    if (typeof decoded.id !== "number") {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("JWT ERROR:", err);
    return NextResponse.json({ user: null });
  }
}
