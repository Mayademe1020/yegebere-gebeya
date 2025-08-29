"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Phone, MessageCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { EthiopianDataUtils } from '@/lib/ethiopian/data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'am' | 'or' | 'en';
}

type AuthStep = 'phone' | 'otp' | 'profile';
type OTPMethod = 'sms' | 'telegram';

export function AuthModal({ isOpen, onClose, language }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otpMethod, setOtpMethod] = useState<OTPMethod>('sms');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const getLocalizedText = (amharic: string, english: string, oromo?: string) => {
    switch (language) {
      case 'am': return amharic;
      case 'or': return oromo || english;
      case 'en': return english;
      default: return amharic;
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 9 digits after +251
    if (digits.length > 9) {
      return digits.slice(0, 9);
    }
    
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const getFullPhoneNumber = () => {
    return `+251${phoneNumber}`;
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 9) {
      toast.error(getLocalizedText(
        '9 አሃዝ ስልክ ቁጥር ያስፈልጋል',
        '9-digit phone number required',
        'Lakkoofsi bilbilaa lakkoofsa 9 barbaachisa'
      ));
      return;
    }

    if (!phoneNumber.startsWith('9') && !phoneNumber.startsWith('7')) {
      toast.error(getLocalizedText(
        'ስልክ ቁጥር በ9 ወይም በ7 መጀመር አለበት',
        'Phone number must start with 9 or 7',
        'Lakkoofsi bilbilaa 9 ykn 7 jalqabuu qaba'
      ));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: getFullPhoneNumber(),
          method: otpMethod 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOtpSent(true);
        setStep('otp');
        toast.success(getLocalizedText(
          `የማረጋገጫ ኮድ ${otpMethod === 'sms' ? 'በSMS' : 'በTelegram'} ተልኳል`,
          `Verification code sent via ${otpMethod === 'sms' ? 'SMS' : 'Telegram'}`,
          `Koodiin mirkaneessaa ${otpMethod === 'sms' ? 'SMS' : 'Telegram'} dhaan ergame`
        ));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(getLocalizedText('ስህተት ተከስቷል', 'An error occurred', 'Dogoggorri uumame'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error(getLocalizedText('6 አሃዝ ኮድ ያስፈልጋል', '6-digit code required', 'Koodiin lakkoofsa 6 barbaachisa'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: getFullPhoneNumber(), otp }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.user?.name) {
          // User already has profile, close modal
          toast.success(getLocalizedText('በተሳካ ሁኔታ ገብተዋል', 'Successfully logged in', 'Milkaa\'inaan seentan'));
          onClose();
          window.location.reload();
        } else {
          // New user, show profile setup
          setStep('profile');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(getLocalizedText('ስህተት ተከስቷል', 'An error occurred', 'Dogoggorri uumame'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error(getLocalizedText(
        'የመጀመሪያ እና የአባት ስም ያስፈልጋል',
        'First and last name are required',
        'Maqaan jalqabaa fi abbaa barbaachisaa dha'
      ));
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      // In a real implementation, you would call an API to update the profile
      toast.success(getLocalizedText(
        'መገለጫዎ ተሟልቷል',
        'Profile completed successfully',
        'Ibsi keessan milkaa\'inaan xumurame'
      ));
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error(getLocalizedText('ስህተት ተከስቷል', 'An error occurred', 'Dogoggorri uumame'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setFirstName('');
    setLastName('');
    setOtpMethod('sms');
    setOtpSent(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">
            {step === 'phone' && getLocalizedText('ወደ የገበሬ ገበያ ይግቡ', 'Sign in to Yegebere Gebeya', 'Gabaa Qonnaa seeni')}
            {step === 'otp' && getLocalizedText('ኮድ ያረጋግጡ', 'Verify Code', 'Koodii mirkaneessi')}
            {step === 'profile' && getLocalizedText('መገለጫ ያሟሉ', 'Complete Profile', 'Ibsa xumurii')}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {step === 'phone' && getLocalizedText(
              'ስልክ ቁጥርዎን ያስገቡ የማረጋገጫ ኮድ እንልክልዎ',
              'Enter your phone number to receive a verification code',
              'Lakkoofsa bilbilaa keessanii galchaa koodii mirkaneessaa akka erginu'
            )}
            {step === 'otp' && getLocalizedText(
              `ወደ +251${phoneNumber} የተላከውን 6 አሃዝ ኮድ ያስገቡ`,
              `Enter the 6-digit code sent to +251${phoneNumber}`,
              `Koodii lakkoofsa 6 gara +251${phoneNumber} ergame galchaa`
            )}
            {step === 'profile' && getLocalizedText(
              'መገለጫዎን ለማሟላት ስምዎን ያስገቡ',
              'Enter your name to complete your profile',
              'Ibsa keessan xumuruuf maqaa keessan galchaa'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-1">
          {step === 'phone' && (
            <>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium">
                  {getLocalizedText('ስልክ ቁጥር', 'Phone Number', 'Lakkoofsa Bilbilaa')}
                </Label>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md border">
                    <span className="text-sm font-medium text-gray-700">+251</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9xxxxxxxx"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="flex-1 text-center text-lg tracking-wider"
                    maxLength={9}
                  />
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  {getLocalizedText(
                    'በ9 ወይም በ7 የሚጀምር 9 አሃዝ ቁጥር ያስገቡ',
                    'Enter 9 digits starting with 9 or 7',
                    'Lakkoofsa 9 9 ykn 7 jalqabu galchaa'
                  )}
                </p>

                {/* OTP Method Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {getLocalizedText('ኮድ የት እንልክ?', 'Where to send code?', 'Koodii eessatti ergina?')}
                  </Label>
                  <RadioGroup value={otpMethod} onValueChange={(value) => setOtpMethod(value as OTPMethod)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms" />
                      <Label htmlFor="sms" className="flex items-center cursor-pointer">
                        <Phone className="h-4 w-4 mr-2" />
                        {getLocalizedText('SMS መልዕክት', 'SMS Message', 'Ergaa SMS')}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="telegram" id="telegram" />
                      <Label htmlFor="telegram" className="flex items-center cursor-pointer">
                        <Send className="h-4 w-4 mr-2" />
                        {getLocalizedText('Telegram መልዕክት', 'Telegram Message', 'Ergaa Telegram')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <Button 
                onClick={handleSendOTP} 
                disabled={isLoading || phoneNumber.length !== 9}
                className="w-full bg-green-600 hover:bg-green-700 py-3 text-base"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Phone className="h-4 w-4 mr-2" />
                )}
                {getLocalizedText('ኮድ ላክ', 'Send Code', 'Koodii Ergi')}
              </Button>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700 py-3 text-base"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {getLocalizedText('አረጋግጥ', 'Verify', 'Mirkaneessi')}
                </Button>

                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {getLocalizedText('እንደገና ላክ', 'Resend Code', 'Ammas Ergi')}
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === 'profile' && (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      {getLocalizedText('የመጀመሪያ ስም', 'First Name', 'Maqaa Jalqabaa')}
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={getLocalizedText('አብርሃም', 'Abraham', 'Abraahaam')}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      {getLocalizedText('የአባት ስም', 'Last Name', 'Maqaa Abbaa')}
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={getLocalizedText('ተስፋዬ', 'Tesfaye', 'Tasfaayee')}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="text-base"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleCompleteProfile} 
                disabled={isLoading || !firstName.trim() || !lastName.trim()}
                className="w-full bg-green-600 hover:bg-green-700 py-3 text-base"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {getLocalizedText('ጨርስ', 'Complete', 'Xumurii')}
              </Button>
            </>
          )}
        </div>

        {step === 'phone' && (
          <div className="text-center text-xs text-gray-500 mt-4 px-2">
            {getLocalizedText(
              'በመመዝገብ የአገልግሎት ውሎችን እና የግላዊነት ፖሊሲን ይቀበላሉ',
              'By registering, you agree to our Terms of Service and Privacy Policy',
              'Galmaa\'uudhaan haala tajaajilaa fi imaammata dhuunfaa keenya fudhattu'
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
