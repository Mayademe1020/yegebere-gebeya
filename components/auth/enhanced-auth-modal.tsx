"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, MessageSquare, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type AuthStep = "phone" | "channel" | "otp";
type DeliveryChannel = "sms" | "telegram";

export function EnhancedAuthModal({ isOpen, onClose, onSuccess }: EnhancedAuthModalProps) {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<DeliveryChannel>("sms");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Limit to 9 digits (Ethiopian mobile numbers)
    const limitedDigits = digits.slice(0, 9);
    
    // Format as XXX XXX XXX
    if (limitedDigits.length <= 3) {
      return limitedDigits;
    } else if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`;
    } else {
      return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`;
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 9 && (digits.startsWith("9") || digits.startsWith("7"));
  };

  const handlePhoneSubmit = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    
    if (!validatePhoneNumber(cleanPhone)) {
      setError("Please enter a valid Ethiopian phone number (9 digits starting with 9 or 7)");
      return;
    }

    setError(null);
    setStep("channel");
  };

  const handleChannelSelect = (channel: DeliveryChannel) => {
    setSelectedChannel(channel);
    setStep("otp");
    sendOTP(channel);
  };

  const sendOTP = async (channel: DeliveryChannel) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+251${phoneNumber.replace(/\D/g, "")}`,
          channel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      // Start resend cooldown
      setResendCooldown(30);
      const cooldownInterval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 4) {
      setError("Please enter the complete 4-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `+251${phoneNumber.replace(/\D/g, "")}`,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
          
          if (data.attemptsRemaining === 0) {
            setIsLocked(true);
            setLockoutTime(600); // 10 minutes
            
            const lockoutInterval = setInterval(() => {
              setLockoutTime((prev) => {
                if (prev <= 1) {
                  clearInterval(lockoutInterval);
                  setIsLocked(false);
                  setAttemptsRemaining(5);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        }
        
        throw new Error(data.error || "Invalid verification code");
      }

      onSuccess(data.user);
      onClose();
      resetForm();

    } catch (error: any) {
      setError(error.message);
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;
    sendOTP(selectedChannel);
  };

  const resetForm = () => {
    setStep("phone");
    setPhoneNumber("");
    setSelectedChannel("sms");
    setOtp("");
    setError(null);
    setAttemptsRemaining(5);
    setIsLocked(false);
    setLockoutTime(0);
    setResendCooldown(0);
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("channel");
    } else if (step === "channel") {
      setStep("phone");
    }
    setError(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== "phone" && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>
              {step === "phone" && "Enter Phone Number"}
              {step === "channel" && "Choose Delivery Method"}
              {step === "otp" && "Enter Verification Code"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Phone Number Step */}
          {step === "phone" && (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600">
                Enter your Ethiopian phone number to get started
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                    <span className="text-sm font-medium">+251</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    className="rounded-l-none"
                    maxLength={11} // Formatted length
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter 9 digits starting with 9 or 7
                </p>
              </div>

              <Button
                onClick={handlePhoneSubmit}
                disabled={isLoading || !validatePhoneNumber(phoneNumber.replace(/\D/g, ""))}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Channel Selection Step */}
          {step === "channel" && (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600">
                How would you like to receive your verification code?
              </div>

              <div className="grid gap-3">
                <Card
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-gray-50",
                    selectedChannel === "sms" && "ring-2 ring-green-500"
                  )}
                  onClick={() => handleChannelSelect("sms")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">SMS Message</h3>
                        <p className="text-sm text-gray-600">
                          Receive code via text message
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-gray-50",
                    selectedChannel === "telegram" && "ring-2 ring-green-500"
                  )}
                  onClick={() => handleChannelSelect("telegram")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Telegram</h3>
                        <p className="text-sm text-gray-600">
                          Receive code on Telegram
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* OTP Verification Step */}
          {step === "otp" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Enter the 4-digit code sent to
                </p>
                <p className="font-medium">
                  +251 {phoneNumber} via {selectedChannel === "sms" ? "SMS" : "Telegram"}
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading || isLocked}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {!isLocked && (
                <div className="text-center text-sm text-gray-600">
                  {attemptsRemaining < 5 && (
                    <p className="text-orange-600">
                      {attemptsRemaining} attempts remaining
                    </p>
                  )}
                </div>
              )}

              {isLocked && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Too many failed attempts. Please wait {formatTime(lockoutTime)} before trying again.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleOTPSubmit}
                disabled={isLoading || otp.length !== 4 || isLocked}
                className="w-full"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-sm"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"
                  }
                </Button>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
