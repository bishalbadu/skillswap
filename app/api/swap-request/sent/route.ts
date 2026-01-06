import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ requests: [] });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ requests: [] });
    }

    const requests = await prisma.swapRequest.findMany({
      where: {
        requesterId: decoded.id, // ✅ THIS IS THE ONLY LOGIC CHANGE
      },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        skill: {
          select: {
            name: true,
            level: true,
          },
        },
        slot: {
          select: {
            day: true,
            timeFrom: true,
            timeTo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("SENT REQUESTS ERROR:", err);
    return NextResponse.json({ requests: [] });
  }
}
