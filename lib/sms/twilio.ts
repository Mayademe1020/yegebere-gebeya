import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export class SMSService {
  // Send 6-digit OTP via SMS
  static async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      if (!accountSid || !authToken || !twilioPhoneNumber) {
        console.error('Twilio credentials not configured');
        return false;
      }

      // Normalize Ethiopian phone number
      const normalizedPhone = this.normalizeEthiopianPhone(phoneNumber);
      
      const message = await client.messages.create({
        body: `የእርስዎ የማረጋገጫ ኮድ: ${otp}\nYour verification code: ${otp}\nValid for 5 minutes.`,
        from: twilioPhoneNumber,
        to: normalizedPhone,
      });

      console.log('SMS sent successfully:', message.sid);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  // Normalize Ethiopian phone numbers
  static normalizeEthiopianPhone(phoneNumber: string): string {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different Ethiopian phone number formats
    if (cleaned.startsWith('251')) {
      // Already in international format
      return `+${cleaned}`;
    } else if (cleaned.startsWith('09') || cleaned.startsWith('07')) {
      // Local format starting with 09 or 07
      return `+251${cleaned.substring(1)}`;
    } else if (cleaned.startsWith('9') || cleaned.startsWith('7')) {
      // Local format starting with 9 or 7
      return `+251${cleaned}`;
    } else if (cleaned.length === 9) {
      // 9-digit number, assume it needs +251 prefix
      return `+251${cleaned}`;
    }
    
    // Default: assume it's already properly formatted
    return phoneNumber.startsWith('+') ? phoneNumber : `+${cleaned}`;
  }

  // Generate 6-digit OTP
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Validate Ethiopian phone number
  static isValidEthiopianPhone(phoneNumber: string): boolean {
    const normalized = this.normalizeEthiopianPhone(phoneNumber);
    // Ethiopian mobile numbers: +2519XXXXXXXX or +2517XXXXXXXX
    const ethiopianMobileRegex = /^\+251[97]\d{8}$/;
    return ethiopianMobileRegex.test(normalized);
  }
}
