import { NextRequest, NextResponse } from "next/server";
import { EthiopianDataUtils } from "@/lib/ethiopian/data";

// Dummy phone numbers for testing
const DUMMY_PHONES = ['913623785', '911111112'];

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, channel = "sms" } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Check if it's a dummy phone number
    const isDummyPhone = DUMMY_PHONES.includes(phoneNumber);
    
    let normalizedPhone;
    if (isDummyPhone) {
      normalizedPhone = phoneNumber; // Use dummy phone as-is
    } else {
      // Normalize Ethiopian phone number
      normalizedPhone = EthiopianDataUtils.normalizePhoneNumber(phoneNumber);
      
      if (!normalizedPhone) {
        return NextResponse.json(
          { error: "Invalid Ethiopian phone number" },
          { status: 400 }
        );
      }
    }

    // For development, use hardcoded OTP
    const otp = "123456";

    // Log for development
    console.log(`OTP for ${normalizedPhone}: ${otp} (via ${channel})`);

    return NextResponse.json({
      success: true,
      message: `Verification code sent via ${channel}`,
      // For development only - remove in production
      devOtp: otp,
      phoneType: isDummyPhone ? 'dummy' : 'ethiopian'
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
