import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { avatar, userId } = await req.json();

  await prisma.user.update({
    where: { id: userId },
    data: { avatar },
  });

  return NextResponse.json({ success: true });
}
