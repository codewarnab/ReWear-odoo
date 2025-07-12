"use client";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseFormReturn } from "react-hook-form";
import { EmailPasswordForm } from "./EmailPasswordForm";
import { SocialLoginForm } from "./SocialLoginForm";
import { OTPRequestForm } from "./OTPRequestForm";

interface AuthFormProps {
  form: UseFormReturn<{ email: string; password: string }>;
  isSignUpMode: boolean;
  isLoading: boolean;
  onAuthMethodChange: (method: string) => void;
  onSubmit: (values: { email: string; password: string }) => void;
  onToggleMode: () => void;
  onSocialLogin: (provider: "google" | "github") => void;
  onSendOTP: () => void;
}

export function AuthForm({
  form,
  isSignUpMode,
  isLoading,
  onAuthMethodChange,
  onSubmit,
  onToggleMode,
  onSocialLogin,
  onSendOTP,
}: AuthFormProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          {isSignUpMode ? 'Create Account' : 'Welcome Back'}
        </CardTitle>
        <CardDescription className="text-center">
          {isSignUpMode
            ? 'Join our resilience planning platform'
            : 'Choose your preferred method to sign in'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="email" onValueChange={onAuthMethodChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <EmailPasswordForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
              isSignUpMode={isSignUpMode}
              onToggleMode={onToggleMode}
            />
          </TabsContent>

          <TabsContent value="social">
            <SocialLoginForm
              onSocialLogin={onSocialLogin}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="otp">
            <OTPRequestForm
              form={form}
              onSendOTP={onSendOTP}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
}
