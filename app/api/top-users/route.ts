import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    //  group by requesterId
    const topUsers = await prisma.swapRequest.groupBy({
      by: ["requesterId"],
      _count: {
        requesterId: true,
      },
      orderBy: {
        _count: {
          requesterId: "desc",
        },
      },
      take: 3,
    });

    //  fetch user details
    const users = await Promise.all(
      topUsers.map(async (u) => {
        const user = await prisma.user.findUnique({
          where: { id: u.requesterId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        });

        return {
          ...user,
          totalRequests: u._count.requesterId,
        };
      })
    );

    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}