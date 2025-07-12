"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface SocialLoginFormProps {
  onSocialLogin: (provider: "google" | "github") => void;
  isLoading: boolean;
}

export function SocialLoginForm({ onSocialLogin, isLoading }: SocialLoginFormProps) {
  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700"
        onClick={() => onSocialLogin("google")}
        disabled={isLoading}
      >
        <FcGoogle className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700"
        onClick={() => onSocialLogin("github")}
        disabled={isLoading}
      >
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
      <Separator />
      <p className="text-center text-sm text-muted-foreground">
        Secure authentication with OAuth
      </p>
    </div>
  );
}
