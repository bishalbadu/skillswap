import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * GET WANTED SKILLS (FOR PROFILE PAGE)
 */
export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.match(/token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json({ skills: [] });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json({ skills: [] });
  }

  const skills = await prisma.skill.findMany({
    where: {
      userId: decoded.id,
      type: "WANT",
    },
    select: {
      id: true,
      name: true,
      learnGoal: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ skills });
}

/**
 * CREATE WANTED SKILL
 */
export async function POST(req: Request) {
  const cookie = req.headers.get("cookie");
  const token = cookie?.match(/token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json(
      { error: "NOT_LOGGED_IN" },
      { status: 401 }
    );
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return NextResponse.json(
      { error: "TOKEN_INVALID" },
      { status: 401 }
    );
  }

  const { skill, learnGoal } = await req.json();

  if (!skill || !skill.trim()) {
    return NextResponse.json(
      { error: "Skill name is required" },
      { status: 400 }
    );
  }

  await prisma.skill.create({
    data: {
      name: skill.trim(),
      type: "WANT",
      learnGoal: learnGoal ?? null,
      userId: decoded.id,
    },
  });

  return NextResponse.json({ success: true });
}
