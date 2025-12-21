// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
//     }

//     // JWT
//     const token = jwt.sign(
//       { id: user.id },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     const res = NextResponse.json({ message: "Login successful" });

//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: false,
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7,
//     });

//     return res;
//   } catch (e) {
//     console.log(e);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }



// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     // Find user by email
//     const user = await prisma.user.findUnique({ where: { email } });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 400 }
//       );
//     }

//     // Compare password
//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 400 }
//       );
//     }

//     // Create JWT (Now env works)
//     const token = jwt.sign(
//       { id: user.id },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "7d" }
//     );

//     // Send response with cookie
//     const res = NextResponse.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//       },
//     });

//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: false,
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     return res;

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid login" }, { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: "Invalid login" }, { status: 400 });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  const res = NextResponse.json({ message: "Login successful" });

  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    secure: false,
  });

  return res;
}

