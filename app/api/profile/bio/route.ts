import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.match(/token=([^;]+)/)?.[1];

  if (!token)
    return NextResponse.json({ error: "NOT_LOGGED_IN" }, { status: 401 });

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ error: "TOKEN_INVALID" }, { status: 401 });
  }

  const { bio } = await req.json();

  await prisma.user.update({
    where: { id: decoded.id },
    data: { bio },
  });

  return NextResponse.json({ success: true });
}
