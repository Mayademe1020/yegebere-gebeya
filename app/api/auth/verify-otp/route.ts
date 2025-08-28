import { NextRequest, NextResponse } from 'next/server';
import { EthiopianDataUtils } from '@/lib/ethiopian/data';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Import OTP storage from send-otp route
// In production, this would be in a shared database/Redis
const otpStorage = new Map<string, { otp: string; expires: number; method: string }>();

// Mock user database
const users = new Map<string, { 
  id: string; 
  phoneNumber: string; 
  name?: string; 
  createdAt: Date; 
  lastLogin: Date 
}>();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, otp } = body;

    // Validate inputs
    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = EthiopianDataUtils.normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check if OTP exists and is valid
    const storedOtpData = otpStorage.get(normalizedPhone);
    if (!storedOtpData) {
      return NextResponse.json(
        { success: false, message: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expires) {
      otpStorage.delete(normalizedPhone);
      return NextResponse.json(
        { success: false, message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedOtpData.otp !== otp.toString()) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code. Please try again.' },
        { status: 400 }
      );
    }

    // OTP is valid, remove it from storage
    otpStorage.delete(normalizedPhone);

    // Check if user exists
    let user = users.get(normalizedPhone);
    if (!user) {
      // Create new user
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        phoneNumber: normalizedPhone,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      users.set(normalizedPhone, user);
    } else {
      // Update last login
      user.lastLogin = new Date();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        phoneNumber: user.phoneNumber,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully verified',
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        isNewUser: !user.name
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
