// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";
// import crypto from "crypto";
// import nodemailer from "nodemailer";

// export async function POST(req: Request) {
//   try {
//     const { firstName, lastName, email, password } = await req.json();

//     // 1️⃣ Required fields
//     if (!firstName || !lastName || !email || !password) {
//       return NextResponse.json(
//         { error: "All fields are required." },
//         { status: 400 }
//       );
//     }

//     // 2️⃣ Name validation
//     const nameRegex = /^[A-Za-z]+$/;
//     if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
//       return NextResponse.json(
//         { error: "First and last name must contain only alphabets." },
//         { status: 400 }
//       );
//     }

//     // 3️⃣ Password validation
//     const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       return NextResponse.json(
//         {
//           error:
//             "Password must be at least 8 characters long and include at least one symbol.",
//         },
//         { status: 400 }
//       );
//     }

//     // 4️⃣ Normalize email
//     const normalizedEmail = email.toLowerCase();

//     // 5️⃣ Duplicate email check
//     const existingUser = await prisma.user.findUnique({
//       where: { email: normalizedEmail },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "Email is already registered." },
//         { status: 400 }
//       );
//     }

//     // 6️⃣ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 7️⃣ Generate email verification token
//     const verificationToken = crypto.randomBytes(32).toString("hex");
//     const verificationExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

//     // 8️⃣ Create user (UNCHANGED LOGIC + verification fields added)
//     await prisma.user.create({
//       data: {
//         firstName,
//         lastName,
//         email: normalizedEmail,
//         password: hashedPassword,

//         emailVerified: null,
//         emailVerificationToken: verificationToken,
//         emailVerificationExpires: verificationExpiry,
//       },
//     });

//     // 9️⃣ Send verification email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER!,
//         pass: process.env.EMAIL_PASS!,
//       },
//     });

//     const verifyLink = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;

//     await transporter.sendMail({
//       from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
//       to: normalizedEmail,
//       subject: "Verify your SkillSwap account",
//       html: `
//         <h2>Welcome to SkillSwap 👋</h2>
//         <p>Thanks for registering! Please verify your email to activate your account.</p>
//         <a href="${verifyLink}" 
//            style="display:inline-block;padding:10px 16px;background:#4a5e27;color:white;
//                   border-radius:6px;text-decoration:none;font-weight:600">
//           Verify Email
//         </a>
//         <p style="margin-top:10px;font-size:12px;color:#666">
//           This link expires in 24 hours.
//         </p>
//       `,
//     });

//     return NextResponse.json(
//       {
//         message:
//           "Registration successful! Please verify your email before logging in.",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("REGISTER ERROR:", error);
//     return NextResponse.json(
//       { error: "Server error. Please try again later." },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    // 1️⃣ Required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // 2️⃣ Name validation
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return NextResponse.json(
        { error: "First and last name must contain only alphabets." },
        { status: 400 }
      );
    }

    // 3️⃣ Password validation
    const passwordRegex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long and include at least one symbol.",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // 5️⃣ Check if already fully registered (verified user)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 400 }
      );
    }

    // 6️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7️⃣ Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpiry = new Date(
      Date.now() + 10 * 60 * 1000
    ); // 10 minutes

    // 8️⃣ Store in DB (NOT verified yet)
    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        firstName,
        lastName,
        password: hashedPassword,
        emailVerificationOtp: otp,
        emailVerificationExpires: otpExpiry,
        emailVerified: null, // ensure still unverified
      },
      create: {
        firstName,
        lastName,
        email: normalizedEmail,
        password: hashedPassword,
        emailVerificationOtp: otp,
        emailVerificationExpires: otpExpiry,
        emailVerified: null,
      },
    });

    // 9️⃣ Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your SkillSwap verification code",
      html: `
        <h2>Welcome to SkillSwap 👋</h2>
        <p>Your email verification code is:</p>
        <h1 style="letter-spacing:4px;font-size:32px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    return NextResponse.json(
      {
        message: "OTP sent to your email.",
        email: normalizedEmail,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}