import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "INVALID_USER_ID" }, { status: 400 });
    }

    // 🔹 Fetch user basic info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    // 🔹 Fetch OFFER skills only
    const skillsOffered = await prisma.skill.findMany({
      where: {
        userId: userId,
        type: "OFFER",
        publicListing: true,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        level: true,
        description: true,
        platform: true,
        sessionLength: true,
        days: true,
        timeFrom: true,
        timeTo: true,
      },
    });

    // 🔹 Dummy rating (future: Review table)
    const rating = 4.5;
    const reviewsCount = 55;

    return NextResponse.json({
      user: {
        ...user,
        rating,
        reviewsCount,
      },
      skillsOffered,
    });
  } catch (err) {
    console.error("PUBLIC PROFILE API ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
