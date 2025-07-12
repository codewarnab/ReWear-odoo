"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPVerificationFormProps {
  otp: string;
  otpEmail: string;
  onOTPChange: (value: string) => void;
  onVerifyOTP: () => void;
  onBackToEmail: () => void;
  isLoading: boolean;
}

export function OTPVerificationForm({
  otp,
  otpEmail,
  onOTPChange,
  onVerifyOTP,
  onBackToEmail,
  isLoading,
}: OTPVerificationFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <InputOTP maxLength={6} pattern={"^\\d+$"} value={otp} onChange={onOTPChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      
      <div className="flex gap-3">
        <Button
          type="button"
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-400"
          onClick={onVerifyOTP}
          disabled={isLoading || !otpEmail || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700"
          onClick={onBackToEmail}
          disabled={isLoading}
        >
          Back to Sign In
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
       Code will auto-verify when all digits are entered
      </p>
    </div>
  );
}
