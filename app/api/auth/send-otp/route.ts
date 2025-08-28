import { NextRequest, NextResponse } from 'next/server';
import { EthiopianDataUtils } from '@/lib/ethiopian/data';

// Mock OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; expires: number; method: string }>();

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock Twilio SMS function
async function sendSMS(phoneNumber: string, otp: string): Promise<boolean> {
  try {
    // In production, use actual Twilio API
    console.log(`SMS to ${phoneNumber}: Your Yegebere Gebeya verification code is: ${otp}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, always return success
    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}

// Mock Telegram Bot function
async function sendTelegram(phoneNumber: string, otp: string): Promise<boolean> {
  try {
    // In production, use actual Telegram Bot API
    console.log(`Telegram to ${phoneNumber}: Your Yegebere Gebeya verification code is: ${otp}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, always return success
    return true;
  } catch (error) {
    console.error('Telegram sending failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, method = 'sms' } = body;

    // Validate phone number
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate Ethiopian phone number format
    const normalizedPhone = EthiopianDataUtils.normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, message: 'Invalid Ethiopian phone number format' },
        { status: 400 }
      );
    }

    // Validate method
    if (!['sms', 'telegram'].includes(method)) {
      return NextResponse.json(
        { success: false, message: 'Invalid delivery method' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expires = Date.now() + (5 * 60 * 1000); // 5 minutes

    // Store OTP
    otpStorage.set(normalizedPhone, { otp, expires, method });

    // Send OTP based on method
    let sent = false;
    if (method === 'sms') {
      sent = await sendSMS(normalizedPhone, otp);
    } else if (method === 'telegram') {
      sent = await sendTelegram(normalizedPhone, otp);
    }

    if (!sent) {
      // Try fallback method
      const fallbackMethod = method === 'sms' ? 'telegram' : 'sms';
      if (fallbackMethod === 'sms') {
        sent = await sendSMS(normalizedPhone, otp);
      } else {
        sent = await sendTelegram(normalizedPhone, otp);
      }
      
      if (sent) {
        // Update storage with fallback method
        otpStorage.set(normalizedPhone, { otp, expires, method: fallbackMethod });
      }
    }

    if (!sent) {
      return NextResponse.json(
        { success: false, message: 'Failed to send verification code. Please try again.' },
        { status: 500 }
      );
    }

    // For development, log the OTP
    console.log(`OTP for ${normalizedPhone}: ${otp} (expires in 5 minutes)`);

    return NextResponse.json({
      success: true,
      message: `Verification code sent via ${method}`,
      phoneNumber: normalizedPhone,
      method: method
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStorage.entries()) {
    if (data.expires < now) {
      otpStorage.delete(phone);
    }
  }
}, 60000); // Clean up every minute

// Export OTP storage for verification endpoint
export { otpStorage };
