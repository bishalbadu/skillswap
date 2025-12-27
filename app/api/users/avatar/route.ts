// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function POST(req: Request) {
//   const { avatar, userId } = await req.json();

//   await prisma.user.update({
//     where: { id: userId },
//     data: { avatar },
//   });

//   return NextResponse.json({ success: true });
// }




import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 🔐 Get logged-in user (NO req passed)
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { avatar } = await req.json();

    if (!avatar) {
      return NextResponse.json(
        { error: "Avatar URL is required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { avatar },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}
