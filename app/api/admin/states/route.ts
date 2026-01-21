import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const admin = verifyAdmin(req);

  if (!admin) {
    return NextResponse.json(
      { error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const [users, skills, swaps] = await Promise.all([
    prisma.user.count(),
    prisma.skill.count(),
    prisma.swapRequest.count(),
  ]);

  return NextResponse.json({
    users,
    skills,
    swaps,
  });
}
