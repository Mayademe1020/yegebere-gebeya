import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma';
import { SMSService } from '../sms/twilio';
import { TelegramService } from '../telegram/bot';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AuthUser {
  id: string;
  phoneNumber: string;
  name?: string;
  language: string;
  isVerified: boolean;
}

export class AuthService {
  // Generate and send OTP
  static async sendOTP(phoneNumber: string, purpose: 'login' | 'registration' = 'login'): Promise<{ success: boolean; message: string }> {
    try {
      // Validate phone number
      if (!SMSService.isValidEthiopianPhone(phoneNumber)) {
        return { success: false, message: 'Invalid Ethiopian phone number format' };
      }

      const normalizedPhone = SMSService.normalizeEthiopianPhone(phoneNumber);
      const otp = SMSService.generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Save OTP to database
      await prisma.oTPVerification.create({
        data: {
          phoneNumber: normalizedPhone,
          otp: await bcrypt.hash(otp, 10),
          type: 'sms',
          purpose,
          expiresAt,
        },
      });

      // Try to send via SMS first
      const smsSuccess = await SMSService.sendOTP(normalizedPhone, otp);
      
      if (smsSuccess) {
        return { success: true, message: 'OTP sent via SMS' };
      }

      // Fallback to Telegram
      const telegramSuccess = await TelegramService.sendOTPViaTelegram(normalizedPhone, otp);
      
      if (telegramSuccess) {
        // Also save Telegram OTP record
        await prisma.oTPVerification.create({
          data: {
            phoneNumber: normalizedPhone,
            otp: await bcrypt.hash(otp, 10),
            type: 'telegram',
            purpose,
            expiresAt,
          },
        });
        return { success: true, message: 'OTP sent via Telegram' };
      }

      return { success: false, message: 'Failed to send OTP via both SMS and Telegram' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Verify OTP and login/register user
  static async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; token?: string; user?: AuthUser; message: string }> {
    try {
      const normalizedPhone = SMSService.normalizeEthiopianPhone(phoneNumber);

      // Find valid OTP
      const otpRecord = await prisma.oTPVerification.findFirst({
        where: {
          phoneNumber: normalizedPhone,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!otpRecord) {
        return { success: false, message: 'Invalid or expired OTP' };
      }

      // Verify OTP
      const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);
      if (!isValidOTP) {
        return { success: false, message: 'Invalid OTP' };
      }

      // Mark OTP as used
      await prisma.oTPVerification.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      });

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { phoneNumber: normalizedPhone },
      });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            phoneNumber: normalizedPhone,
            isVerified: true,
            language: 'am', // Default to Amharic
            lastLoginAt: new Date(),
          },
        });
      } else {
        // Update last login
        user = await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          phoneNumber: user.phoneNumber,
          language: user.language 
        },
        JWT_SECRET,
        { expiresIn: '30d' } // Long-lived token for mobile app
      );

      const authUser: AuthUser = {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name || undefined,
        language: user.language,
        isVerified: user.isVerified,
      };

      return { 
        success: true, 
        token, 
        user: authUser, 
        message: 'Login successful' 
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<{ success: boolean; user?: AuthUser; message: string }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      const authUser: AuthUser = {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name || undefined,
        language: user.language,
        isVerified: user.isVerified,
      };

      return { success: true, user: authUser, message: 'Token valid' };
    } catch (error) {
      return { success: false, message: 'Invalid token' };
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: { name?: string; language?: string; region?: string; zone?: string; woreda?: string }): Promise<{ success: boolean; user?: AuthUser; message: string }> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updates,
      });

      const authUser: AuthUser = {
        id: user.id,
        phoneNumber: user.phoneNumber,
        name: user.name || undefined,
        language: user.language,
        isVerified: user.isVerified,
      };

      return { success: true, user: authUser, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  }
}
