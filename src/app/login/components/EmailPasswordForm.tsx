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
import { UseFormReturn } from "react-hook-form";

interface EmailPasswordFormProps {
  form: UseFormReturn<{ email: string; password: string }>;
  onSubmit: (values: { email: string; password: string }) => void;
  isLoading: boolean;
  isSignUpMode: boolean;
  onToggleMode: () => void;
}

export function EmailPasswordForm({
  form,
  onSubmit,
  isLoading,
  isSignUpMode,
  onToggleMode,
}: EmailPasswordFormProps) {
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            disabled={isLoading}
          >
            {isLoading
              ? (isSignUpMode ? "Creating Account..." : "Signing in...")
              : (isSignUpMode ? "Create Account" : "Sign in")
            }
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4">
        <button
          onClick={onToggleMode}
          className="text-blue-500 hover:underline text-sm focus:outline-none"
          disabled={isLoading}
        >
          {isSignUpMode
            ? 'Already have an account? Sign In'
            : 'Don\'t have an account? Sign Up'
          }
        </button>
      </div>
    </>
  );
}
