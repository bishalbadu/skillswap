import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const swaps = await prisma.swapRequest.findMany({
      include: {
        requester: {
          select: { firstName: true, lastName: true, email: true },
        },
        receiver: {
          select: { firstName: true, lastName: true, email: true },
        },
        skill: {
          select: { name: true },
        },
        slot: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ swaps });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
