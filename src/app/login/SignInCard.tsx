"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import {
  loginWithEmailPassword,
  signupWithEmailPassword,
  loginWithProvider,
  sendOTP,
  verifyOTP,
} from "./SignInCardUtils";
import { toast } from "sonner";
import { AuthForm } from "./components/AuthForm";
import { OTPVerificationCard } from "./components/OTPVerificationCard";

const authSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type FormData = z.infer<typeof authSchema>;

export function SigninCard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<string>("otp");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      let result;
      if (isSignUpMode) {
        result = await signupWithEmailPassword(values.email, values.password);
        if (result) {
          toast.success("Account created successfully!", {
            description: "Welcome to the platform.",
          });
          router.push("/home");
        } else {
          toast.error("Signup failed", {
            description: "Email might already be in use or invalid.",
          });
        }
      } else {
        result = await loginWithEmailPassword(values.email, values.password);
        if (result) {
          toast.success("Welcome back!", {
            description: "You have been signed in successfully.",
          });
          router.push("/home");
        } else {
          toast.error("Login failed", {
            description: "Please check your credentials.",
          });
        }
      }
    } catch (error) {
      toast.error("Authentication error", {
        description: "An unexpected error occurred. Please try again.",
      });
      console.error(`${isSignUpMode ? 'Signup' : 'Signin'} error:`, error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setIsLoading(true);
    try {
      const result = await loginWithProvider(provider);
      if (result) {
        toast.success("Welcome!", {
          description: `Successfully signed in with ${provider}.`,
        });
      } else {
        toast.error("Authentication failed", {
          description: `Could not sign in with ${provider}. Please try again.`,
        });
      }
    } catch (error) {
      toast.error("Authentication error", {
        description: `Failed to sign in with ${provider}.`,
      });
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendOTP() {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", {
        type: "manual",
        message: "Email is required for OTP",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOTP(email);
      if (result) {
        setOtpEmail(email);
        setShowOTPVerification(true);
        toast.success("OTP sent!", {
          description: `Check your inbox at ${email} for the verification code.`,
        });
      } else {
        toast.error("Failed to send OTP", {
          description: "Please try again or use a different authentication method.",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to send OTP. Please try again.",
      });
      console.error("OTP send error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP() {
    if (!otpEmail || !otp) {
      return;
    }
    setIsLoading(true);
    try {
      const result = await verifyOTP(otpEmail, otp);
      if (result) {
        toast.success("Welcome!", {
          description: "Successfully signed in with OTP.",
        });
        router.push("/home");
      } else {
        toast.error("Verification failed", {
          description: "Invalid OTP code. Please try again.",
        });
      }
    } catch (error) {
      toast.error("Verification error", {
        description: "Failed to verify OTP. Please try again.",
      });
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOTPChange = (value: string) => {
    value = value.replace(/\D/g, "");
    setOtp(value);
    // Auto-verify when 6 digits are entered
    if (value.length === 6) {
      setTimeout(() => {
        handleVerifyOTP();
      }, 500);
    }
  };

  const handleBackToEmail = () => {
    setShowOTPVerification(false);
    setOtp("");
    setOtpEmail("");
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setShowOTPVerification(false);
    setOtp("");
    setOtpEmail("");
    form.reset();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center overflow-hidden pt-16">
      {/* Background blurred elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-300 dark:bg-purple-900 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-300 dark:bg-blue-900 opacity-20 blur-3xl"></div>

      <div 
        className="relative w-[400px] h-auto"
        style={{ perspective: '1000px' }}
      >
        <div 
          className={`relative w-full transition-transform duration-700 ease-in-out ${
            showOTPVerification ? '' : ''
          }`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: showOTPVerification ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front side - Login form */}
          <Card 
            className={`w-[400px] bg-secondary/50 backdrop-blur-md shadow-lg border border-gray-800 dark:border-slate-300 ${
              showOTPVerification ? 'invisible' : 'visible'
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <AuthForm
              form={form}
              isSignUpMode={isSignUpMode}
              isLoading={isLoading}
              onAuthMethodChange={setAuthMethod}
              onSubmit={onSubmit}
              onToggleMode={toggleMode}
              onSocialLogin={handleSocialLogin}
              onSendOTP={handleSendOTP}
            />
          </Card>

          {/* Back side - OTP verification */}
          <Card 
            className={`absolute top-0 left-0 w-[400px] bg-secondary/50 backdrop-blur-md shadow-lg border border-gray-800 dark:border-slate-300 ${
              showOTPVerification ? 'visible' : 'invisible'
            }`}
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <OTPVerificationCard
              otp={otp}
              otpEmail={otpEmail}
              onOTPChange={handleOTPChange}
              onVerifyOTP={handleVerifyOTP}
              onBackToEmail={handleBackToEmail}
              isLoading={isLoading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};