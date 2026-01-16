import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.json({ error: "Google login failed" }, { status: 400 });
    }

    const email = payload.email;
    const googleId = payload.sub!;
    const firstName = payload.given_name || "User";
    const lastName = payload.family_name || "";
    const avatar = payload.picture || "";

    let user = await prisma.user.findUnique({ where: { email } });

    // Link Google to existing email user
    if (user && !user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          emailVerified: new Date(),
          avatar: user.avatar || avatar,
        },
      });
    }

    // New Google user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          googleId,
          avatar,
          password: null,
          emailVerified: new Date(),
        },
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ message: "Google login success" });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Google authentication failed" },
      { status: 500 }
    );
  }
}
