import { NextRequest, NextResponse } from "next/server";
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

    // Log for development
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
