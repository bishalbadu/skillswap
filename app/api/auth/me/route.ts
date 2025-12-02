// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import prisma from "@/lib/prisma";

// export async function GET(req: Request) {
//   const token = req.headers.get("cookie")?.split("token=")[1];

//   if (!token) {
//     return NextResponse.json({ user: null });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     // @ts-ignore
//     const id = decoded.id;

//     const user = await prisma.user.findUnique({ where: { id } });

//     return NextResponse.json({ user });

//   } catch (err) {
//     return NextResponse.json({ user: null });
//   }
// }


// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import prisma from "@/lib/prisma";

// export async function GET(req: Request) {
//   const token = req.headers.get("cookie")?.split("token=")[1];
//   if (!token) return NextResponse.json({ user: null });

//   try {
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//     const user = await prisma.user.findUnique({ where: { id: decoded.id } });

//     return NextResponse.json({ user });
//   } catch (err) {
//     return NextResponse.json({ user: null });
//   }
// }


// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//   const cookie = req.headers.get("cookie") || "";
//   const token = cookie.includes("token=") ? cookie.split("token=")[1] : null;

//   if (!token) {
//     return NextResponse.json({ user: null });
//   }

//   try {
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//     const user = await prisma.user.findUnique({ where: { id: decoded.id } });

//     return NextResponse.json({ user });

//   } catch (err) {
//     console.log("JWT ERROR:", err);
//     return NextResponse.json({ user: null });
//   }
// }


// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import prisma from "@/lib/prisma";

// export async function GET(req: Request) {
//   const cookie = req.headers.get("cookie");

//   // Extract token safely
//   const token = cookie?.match(/token=([^;]+)/)?.[1] || null;
//   if (!token) return NextResponse.json({ user: null });

//   try {
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         bio: true,
//         avatar: true
//       }
//     });

//     return NextResponse.json({ user });

//   } catch (err) {
//     console.error("JWT ERROR:", err);
//     return NextResponse.json({ user: null });
//   }
// }






import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.log("JWT ERROR:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
