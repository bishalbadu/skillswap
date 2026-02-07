import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function PATCH(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const reportId = Number(params.id);
    if (isNaN(reportId)) {
      return NextResponse.json(
        { error: "INVALID_REPORT_ID" },
        { status: 400 }
      );
    }

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "REVIEWED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN REPORT REVIEW ERROR:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
