import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        status: "COMPLETED", // 🔥 ONLY SUCCESS PAYMENTS
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        paidAt: "desc",
      },
    });

    const totalEarnings = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    return NextResponse.json({
      totalEarnings,
      payments,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load earnings" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const payments = await prisma.payment.findMany({
//       where: {
//         status: "COMPLETED",
//       },
//       include: {
//         user: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//       orderBy: {
//         paidAt: "desc",
//       },
//     });

//     // ================= GROUP BY USER =================
//     const groupedMap: any = {};

//     for (const p of payments) {
//       const key = p.user.email;

//       if (!groupedMap[key]) {
//         groupedMap[key] = {
//           name: `${p.user.firstName} ${p.user.lastName}`,
//           email: p.user.email,
//           totalAmount: 0,
//           count: 0,
//           dates: [],
//         };
//       }

//       groupedMap[key].totalAmount += p.amount;
//       groupedMap[key].count += 1;

//       if (p.paidAt) {
//         groupedMap[key].dates.push(
//           new Date(p.paidAt).toISOString()
//         );
//       }
//     }

//     const groupedUsers = Object.values(groupedMap);

//     // ================= TOTAL EARNINGS =================
//     const totalEarnings = groupedUsers.reduce(
//       (sum: number, u: any) => sum + u.totalAmount,
//       0
//     );

//     return NextResponse.json({
//       totalEarnings,
//       users: groupedUsers, // 👈 IMPORTANT CHANGE
//     });

//   } catch (err) {
//     return NextResponse.json(
//       { error: "Failed to load earnings" },
//       { status: 500 }
//     );
//   }
// }