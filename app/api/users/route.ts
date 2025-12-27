// import { prisma } from "@/lib/prisma";

// import { NextResponse } from "next/server";

// export async function GET() {
//   const users = await prisma.user.findMany();
//   return NextResponse.json(users);
// }


import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
