// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { email, otp } = await req.json();

//     if (!email || !otp) {
//       return NextResponse.json(
//         { error: "Email and OTP are required." },
//         { status: 400 }
//       );
//     }

//     const normalizedEmail = email.toLowerCase().trim();

//     const user = await prisma.user.findFirst({
//       where: {
//         email: normalizedEmail,
//         emailVerificationOtp: otp,
//         emailVerificationExpires: { gt: new Date() },
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid or expired OTP." },
//         { status: 400 }
//       );
//     }

//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         emailVerified: new Date(),
//         emailVerificationOtp: null,
//         emailVerificationExpires: null,
//       },
//     });

//     return NextResponse.json({
//       message: "Email verified successfully.",
//     });
//   } catch (error) {
//     console.error("VERIFY OTP ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to verify OTP." },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim(); // 🔥 important fix

    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        emailVerificationOtp: cleanOtp,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // 🔥 extra safety: prevent re-verification
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationOtp: null,
        emailVerificationExpires: null,
      },
    });

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}