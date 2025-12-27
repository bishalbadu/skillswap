import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * CREATE OFFER SKILL
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

  const {
    teachSkill,
    teachLevel,
    teachDesc,
    sessionLength,
    selectedDays,
    fromTime,
    toTime,
    platform,
    publicListing,
  } = await req.json();

  if (!teachSkill || !teachSkill.trim()) {
    return NextResponse.json(
      { error: "Skill name is required" },
      { status: 400 }
    );
  }

  await prisma.skill.create({
    data: {
      name: teachSkill.trim(),
      level: teachLevel ?? null,
      description: teachDesc ?? null,
      platform: platform ?? null,
      publicListing: publicListing ?? true,

      sessionLength: sessionLength ? parseInt(sessionLength) : null,
      days: Array.isArray(selectedDays) ? selectedDays.join(",") : null,
      timeFrom: fromTime || null,
      timeTo: toTime || null,

      type: "OFFER",
      userId: decoded.id,
    },
  });

  return NextResponse.json({ success: true });
}

/**
 * GET OFFERED SKILLS (FOR PROFILE PAGE)
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
      type: "OFFER",
    },
    select: {
      id: true,
      name: true,
      level: true,
      description: true,
      platform: true,
      publicListing: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ skills });
}
