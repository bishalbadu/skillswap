// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   const { email, password } = await req.json();

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) return NextResponse.json({ error: "Invalid login" }, { status: 400 });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return NextResponse.json({ error: "Invalid login" }, { status: 400 });

//   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

//   const res = NextResponse.json({ message: "Login successful" });

//   res.cookies.set("token", token, {
//     httpOnly: true,
//     sameSite: "strict",
//     path: "/",
//     secure: false,
//   });

//   return res;
// }

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ message: "Login successful" });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}


