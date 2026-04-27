import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true },
    });

    return NextResponse.json({
      success: true,
      message: "Account reactivated successfully.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to reactivate" }, { status: 500 });
  }
}