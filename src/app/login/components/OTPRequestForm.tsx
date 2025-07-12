"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface OTPRequestFormProps {
  form: UseFormReturn<{ email: string; password: string }>;
  onSendOTP: () => void;
  isLoading: boolean;
}

export function OTPRequestForm({ form, onSendOTP, isLoading }: OTPRequestFormProps) {
  return (
    <>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={onSendOTP}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-muted-foreground mt-4">
        We&apos;ll send you a 6-digit code to verify your identity
      </p>
    </>
  );
}
