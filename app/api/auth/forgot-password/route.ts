import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // ⚠️ Don't reveal if email exists
    if (!user) {
      return NextResponse.json({
        message: "A reset link has been sent to this email.",
      });
    }

    // 🔐 Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiry,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your SkillSwap password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password.</p>
        <a href="${resetLink}"
           style="padding:10px 16px;background:#4a5e27;color:white;border-radius:6px;text-decoration:none">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    return NextResponse.json({
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
