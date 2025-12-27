import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ skills: [], me: null });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ skills: [], me: null });
    }

    // 🔹 Load current user + WANT skills
    const me = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        skills: {
          where: { type: "WANT" },
        },
      },
    });

    if (!me) {
      return NextResponse.json({ skills: [], me: null });
    }

    // 🔹 Normalize wanted skill names
    const wantSkills = me.skills
      .map((s) => s.name.trim().toLowerCase())
      .filter(Boolean);

    if (wantSkills.length === 0) {
      return NextResponse.json({ skills: [], me });
    }

    // 🔹 Find OFFER skills from other users
    const matchedSkills = await prisma.skill.findMany({
      where: {
        type: "OFFER",
        userId: { not: me.id },
        publicListing: true,
        OR: wantSkills.map((skill) => ({
          name: {
            contains: skill,
            mode: "insensitive",
          },
        })),
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 🔹 Format response (with dummy rating)
    const formatted = matchedSkills.map((s) => ({
      id: s.id,
      name: s.name,
      level: s.level,
      description: s.description,
      platform: s.platform,

      // ⭐ Dummy rating (future real reviews)
      rating: 4.5,
      reviewsCount: 55,

      user: {
        id: s.user.id,
        firstName: s.user.firstName,
        lastName: s.user.lastName,
        avatar: s.user.avatar,
      },
    }));

    return NextResponse.json({
      skills: formatted,
      me: {
        id: me.id,
        skillsWanted: me.skills,
      },
    });
  } catch (err) {
    console.error("API ERROR /find-skills:", err);
    return NextResponse.json({ skills: [], me: null });
  }
}
