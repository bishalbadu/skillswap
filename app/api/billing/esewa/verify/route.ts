import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { uuid } = await req.json();

    if (!uuid) {
      return NextResponse.json(
        { error: "Missing uuid" },
        { status: 400 }
      );
    }

    /* ===============================
       1️⃣ Find Payment by UUID
    =============================== */
    const payment = await prisma.payment.findUnique({
      where: { esewaTransactionUuid: uuid },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    /* ===============================
       2️⃣ Call eSewa Verify API (GET)
    =============================== */
    const verifyUrl = `${process.env.ESEWA_VERIFY_URL}?product_code=${process.env.ESEWA_MERCHANT_CODE}&total_amount=${payment.amount}&transaction_uuid=${payment.esewaTransactionUuid}`;

    const verifyRes = await fetch(verifyUrl);
    const verifyData = await verifyRes.json();

    console.log("eSewa Verify:", verifyData);

    if (verifyData.status !== "COMPLETE") {
      return NextResponse.json(
        { error: "Payment not completed from eSewa" },
        { status: 400 }
      );
    }

    /* ===============================
       3️⃣ Prevent Double Activation
    =============================== */
    if (payment.status === "COMPLETED") {
      return NextResponse.json({ success: true });
    }

    /* ===============================
       4️⃣ Mark Payment Completed
    =============================== */
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
      },
    });

    /* ===============================
       5️⃣ Activate Premium
    =============================== */
    let expiry = new Date();

    if (payment.plan === "MONTH_1") {
      expiry.setMonth(expiry.getMonth() + 1);
    } else {
      expiry.setMonth(expiry.getMonth() + 6);
    }

    await prisma.user.update({
      where: { id: payment.userId },
      data: {
        membership: "PREMIUM",
        premiumUntil: expiry,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
