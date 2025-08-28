import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
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
      // Find or create user
      let user = await prisma.user.findUnique({
        where: { phoneNumber: normalizedPhone }
      });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            phoneNumber: normalizedPhone,
            name: `User ${normalizedPhone.slice(-4)}`,
            isVerified: true,
            lastLoginAt: new Date(),
          }
        });
      } else {
        // Update last login
        user = await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });
      }

      // Mark any existing OTP as used
      await prisma.oTPVerification.updateMany({
        where: {
          phoneNumber: normalizedPhone,
          isUsed: false
        },
        data: { isUsed: true }
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          isVerified: user.isVerified
        }
      });
    }

    // Check database for valid OTP
    const otpRecord = await prisma.oTPVerification.findFirst({
      where: {
        phoneNumber: normalizedPhone,
        otp,
        isUsed: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true }
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phoneNumber: normalizedPhone }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          phoneNumber: normalizedPhone,
          name: `User ${normalizedPhone.slice(-4)}`,
          isVerified: true,
          lastLoginAt: new Date(),
        }
      });
    } else {
      // Update last login
      user = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
