"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

import {
  RiLogoutCircleLine,
  RiTimer2Line,
  RiUserLine,
  RiFindReplaceLine,
  RiPulseLine,
} from "@remixicon/react";

type UserProfile = Database["public"]["Tables"]["users_profiles"]["Row"];

export default function UserDropdown() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          setIsLoading(false);
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("users_profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };  // Show loading state or fallback
  if (isLoading || !userProfile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <Avatar className="size-8">
              <AvatarFallback>...</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64 p-2" align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col py-0 px-1 mb-2">
            <span className="truncate text-sm font-medium text-foreground mb-0.5">
              Loading...
            </span>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Generate avatar URL using username
  const getAvatarUrl = (username: string | null) => {
    if (!username) return "";
    return `https://avatar.iran.liara.run/public?username=${encodeURIComponent(username)}`;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-8">
            <AvatarImage
              src={getAvatarUrl(userProfile.username)}
              width={32}
              height={32}
              alt="Profile image"
            />
            <AvatarFallback>{getInitials(userProfile.full_name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 p-2" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col py-0 px-1 mb-2">
          <span className="truncate text-sm font-medium text-foreground mb-0.5">
            {userProfile.full_name || "Unknown User"}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {userProfile.email || "No email"}
          </span>
          {userProfile.username && (
            <span className="truncate text-xs font-normal text-muted-foreground">
              @{userProfile.username}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="gap-3 px-1 cursor-pointer"
          onClick={() => handleNavigation("/dashboard")}
        >
          <RiTimer2Line
            size={20}
            className="text-muted-foreground/70"
            aria-hidden="true"
          />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="gap-3 px-1 cursor-pointer"
          onClick={() => handleNavigation("/profile")}
        >
          <RiUserLine
            size={20}
            className="text-muted-foreground/70"
            aria-hidden="true"
          />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="gap-3 px-1 cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <RiLogoutCircleLine
            size={20}
            className="text-red-600/70"
            aria-hidden="true"
          />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
