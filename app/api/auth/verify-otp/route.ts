import { NextRequest, NextResponse } from "next/server";
import { EthiopianDataUtils } from "@/lib/ethiopian/data";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
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

    // For development, accept hardcoded OTP
    if (otp === "123456") {
      // Create a mock user object for development
      const user = {
        id: `user_${normalizedPhone.replace(/\D/g, '')}`,
        phoneNumber: normalizedPhone,
        name: `User ${normalizedPhone.slice(-4)}`,
        isVerified: true
      };

      console.log(`User authenticated: ${normalizedPhone}`);

      return NextResponse.json({
        success: true,
        user
      });
    }

    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
