import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { firstName, lastName } = await req.json();
    const token = req.headers.get("cookie")?.replace("token=", "");

    if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
