import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json(
        { error: "NOT_AUTHENTICATED" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const data: any = {};

    if (typeof body.firstName === "string") data.firstName = body.firstName;
    if (typeof body.lastName === "string") data.lastName = body.lastName;
    if (typeof body.avatar === "string") data.avatar = body.avatar;
    if (typeof body.bio === "string") data.bio = body.bio;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "NO_FIELDS_TO_UPDATE" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: decoded.id },
      data,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
