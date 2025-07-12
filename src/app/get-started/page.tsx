"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { LocationPicker } from "@/components/ui/location-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, UserIcon, RefreshCwIcon } from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  avatar_url: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function GetStartedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      username: "",
      bio: "",
      phone: "",
      location: undefined,
      avatar_url: ""
    }
  });

  // Watch for changes in username or full_name to auto-generate personalized avatar
  const watchedUsername = form.watch("username");
  const watchedFullName = form.watch("full_name");

  // Auto-generate avatar based on name changes
  useEffect(() => {
    const generatePersonalizedAvatar = () => {
      const name = watchedUsername || watchedFullName;
      if (name && name.trim().length >= 2) {
        const personalizedAvatarUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(name.trim())}`;
        setAvatarUrl(personalizedAvatarUrl);
        form.setValue("avatar_url", personalizedAvatarUrl);
      }
    };

    const timeoutId = setTimeout(generatePersonalizedAvatar, 500); // Debounce for 500ms
    return () => clearTimeout(timeoutId);
  }, [watchedUsername, watchedFullName, form]);

  const generateRandomAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      // Generate random avatar using the correct API endpoint
      // Option 1: Completely random avatar
      // const newAvatarUrl = "https://avatar.iran.liara.run/public";

      // Option 2: Random avatar with specific ID (more consistent across refreshes)
      const randomId = Math.floor(Math.random() * 100) + 1; // IDs seem to range from 1-100+
      const newAvatarUrl = `https://avatar.iran.liara.run/public/${randomId}`;

      // Option 3: Generate based on username if available
      const username = form.getValues("username") || form.getValues("full_name");
      if (username && username.trim()) {
        const usernameAvatarUrl = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(username.trim())}`;
        setAvatarUrl(usernameAvatarUrl);
        form.setValue("avatar_url", usernameAvatarUrl);
      } else {
        setAvatarUrl(newAvatarUrl);
        form.setValue("avatar_url", newAvatarUrl);
      }
    } catch (error) {
      console.error("Error generating avatar:", error);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("User not authenticated");
      }

      // Prepare profile data
      const profileData = {
        id: userData.user.id,
        full_name: data.full_name,
        username: data.username,
        bio: data.bio || null,
        phone: data.phone || null,
        email: userData.user.email,
        avatar_url: data.avatar_url || null,
        location: data.location ? { lat: data.location.lat, lng: data.location.lng } : null,
        is_active: true,
        member_since: new Date().toISOString(),
        points_balance: 0,
        total_items_listed: 0,
        total_swaps_completed: 0,
        updated_at: new Date().toISOString()
      };

      // Insert or update user profile
      const { error: profileError } = await supabase
        .from("users_profiles")
        .upsert(profileData, {
          onConflict: "id",
          ignoreDuplicates: false
        });

      if (profileError) {
        throw profileError;
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  // Generate initial avatar on component mount
  useEffect(() => {
    generateRandomAvatar();
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAtZP0zf4_v3GEncg8UyK6VXY4t99lRI3c";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <UserIcon className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Tell us about yourself to get started with ReWear
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Avatar, Bio, and Location */}
                  <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                          <AvatarImage
                            src={avatarUrl}
                            alt="Profile Avatar"
                            className="object-cover"
                          />
                          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                            {form.watch("full_name")?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateRandomAvatar}
                        disabled={isGeneratingAvatar}
                        className="flex items-center gap-2"
                      >
                        <RefreshCwIcon className={`h-4 w-4 ${isGeneratingAvatar ? "animate-spin" : ""}`} />
                        {watchedUsername || watchedFullName ? "Refresh Avatar" : "Generate Random Avatar"}
                      </Button>
                    </div>

                    {/* Bio */}
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Bio</FormLabel>
                          <FormControl>
                            <textarea
                              placeholder="Tell us about yourself, your clothing preferences, and what you're looking to swap..."
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Optional - Help others understand your style preferences and clothing interests
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4" />
                            Location
                          </FormLabel>
                          <FormControl>
                            <LocationPicker
                              apiKey={apiKey}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Click to select your location"
                              defaultCenter={{ lat: 40.7128, lng: -74.0060 }} // New York as default
                              className="w-full h-[200px]"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Optional - Help others find swaps near you
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Right Column - Other Fields */}
                  <div className="space-y-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Username *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Choose a unique username"
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            This will be your unique identifier on ReWear
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your phone number"
                              type="tel"
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Optional - For easier communication during swaps
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Profile..." : "Complete Setup"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Info Section */}
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">
                  👗 Clothing Marketplace
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🤝 Community Driven
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🔒 Secure Platform
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
