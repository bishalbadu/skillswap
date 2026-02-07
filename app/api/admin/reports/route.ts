// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyAdmin } from "@/lib/auth";

// export async function GET() {
//   try {
//     const admin = await verifyAdmin();
//     if (!admin) {
//       return NextResponse.json(
//         { error: "UNAUTHORIZED" },
//         { status: 401 }
//       );
//     }

//     const reports = await prisma.report.findMany({
//       include: {
//         reporter: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//         reportedUser: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//             status: true, // useful for admin context
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ reports });
//   } catch (error) {
//     console.error("ADMIN REPORTS FETCH ERROR:", error);
//     return NextResponse.json(
//       { error: "SERVER_ERROR" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    /* ================= RAW REPORT LIST ================= */
    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    /* ================= AGGREGATED REPORTS ================= */
    const grouped = await prisma.report.groupBy({
      by: ["reportedUserId", "reason"],
      _count: {
        _all: true,
      },
    });

    const summaryMap: Record<
      number,
      {
        userId: number;
        totalReports: number;
        reasons: Record<string, number>;
      }
    > = {};

    for (const g of grouped) {
      if (!summaryMap[g.reportedUserId]) {
        summaryMap[g.reportedUserId] = {
          userId: g.reportedUserId,
          totalReports: 0,
          reasons: {},
        };
      }

      summaryMap[g.reportedUserId].totalReports += g._count._all;
      summaryMap[g.reportedUserId].reasons[g.reason] = g._count._all;
    }

    return NextResponse.json({
      reports,                     // existing detailed list
      reportSummary: Object.values(summaryMap), // ✅ aggregated
    });

  } catch (error) {
    console.error("ADMIN REPORTS FETCH ERROR:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
