import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { EthiopianDataUtils } from "@/lib/ethiopian/data";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, channel = "sms" } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = EthiopianDataUtils.normalizePhoneNumber(phoneNumber);
    
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Invalid Ethiopian phone number" },
        { status: 400 }
      );
    }

    // For development, use hardcoded OTP
    const otp = "123456";
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    // Store OTP in database
    await prisma.oTPVerification.create({
      data: {
        phoneNumber: normalizedPhone,
        otp,
        type: channel,
        expiresAt,
      },
    });

    // In development, we'll just return success without actually sending
    console.log(`OTP for ${normalizedPhone}: ${otp} (via ${channel})`);

    return NextResponse.json({
      success: true,
      message: `Verification code sent via ${channel}`,
      // For development only - remove in production
      devOtp: otp
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
