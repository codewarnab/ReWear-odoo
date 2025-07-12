"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OTPVerificationForm } from "./OTPVerificationForm";

interface OTPVerificationCardProps {
  otp: string;
  otpEmail: string;
  onOTPChange: (value: string) => void;
  onVerifyOTP: () => void;
  onBackToEmail: () => void;
  isLoading: boolean;
}

export function OTPVerificationCard({
  otp,
  otpEmail,
  onOTPChange,
  onVerifyOTP,
  onBackToEmail,
  isLoading,
}: OTPVerificationCardProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code sent to {otpEmail}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OTPVerificationForm
          otp={otp}
          otpEmail={otpEmail}
          onOTPChange={onOTPChange}
          onVerifyOTP={onVerifyOTP}
          onBackToEmail={onBackToEmail}
          isLoading={isLoading}
        />
      </CardContent>
    </>
  );
}
