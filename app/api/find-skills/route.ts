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
    } catch (e) {
      return NextResponse.json({ skills: [], me: null });
    }

    // Load the user including skills
    const me = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        skillsWanted: true,
        skillsOffered: true,
      },
    });

    if (!me) {
      return NextResponse.json({ skills: [], me: null });
    }

    // Extract user's "want" skills
    const wantSkills = me.skillsWanted.map((s) => s.name);

    // Find matching skills
    const matchedSkills = await prisma.skill.findMany({
      where: {
        name: { in: wantSkills },
        userOfferedId: { not: me.id },
        publicListing: true,
      },
      include: {
        userOffered: true,
      },
    });

    // Format output
    const formatted = matchedSkills.map((s) => ({
      id: s.id,
      name: s.name,
      level: s.level,
      description: s.description,
      platform: s.platform,
      user: s.userOffered,
    }));

    return NextResponse.json({
      skills: formatted,
      me: {
        id: me.id,
        SkillsWanted: me.skillsWanted,
        SkillsOffered: me.skillsOffered,
      },
    });
  } catch (err) {
    console.error("API ERROR /find-skills:", err);
    return NextResponse.json({ skills: [], me: null });
  }
}
