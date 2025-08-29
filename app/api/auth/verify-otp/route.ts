import { NextRequest, NextResponse } from "next/server";
import { EthiopianDataUtils } from "@/lib/ethiopian/data";

// Dummy phone numbers for testing
const DUMMY_PHONES = ['913623785', '911111112'];

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
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
          { error: "Invalid phone number" },
          { status: 400 }
        );
      }
    }

    // For development, accept hardcoded OTP
    if (otp === "123456") {
      // Create a mock user object for development
      const user = {
        id: `user_${normalizedPhone.replace(/\D/g, '')}`,
        phoneNumber: normalizedPhone,
        name: isDummyPhone ? `Test User ${normalizedPhone}` : `User ${normalizedPhone.slice(-4)}`,
        isVerified: true,
        userType: isDummyPhone ? 'test' : 'regular'
      };

      console.log(`User authenticated: ${normalizedPhone} (${isDummyPhone ? 'dummy' : 'ethiopian'})`);

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
