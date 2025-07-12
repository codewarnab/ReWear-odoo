"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/use-user-profile";
import { coordinatesToAddressSafe, Coordinates } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function ProfileSection() {
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const [locationAddress, setLocationAddress] = useState<string>("");

  // Convert location coordinates to address
  useEffect(() => {
    const getLocationAddress = async () => {
      if (userProfile?.location && typeof userProfile.location === 'object' && !Array.isArray(userProfile.location)) {
        // Type guard to ensure we have the right structure
        const locationObj = userProfile.location as Record<string, unknown>;
        if (typeof locationObj.lat === 'number' && typeof locationObj.lng === 'number') {
          const location: Coordinates = {
            lat: locationObj.lat,
            lng: locationObj.lng
          };
          
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          
          if (apiKey) {
            try {
              const address = await coordinatesToAddressSafe(location, apiKey, "Location not available");
              setLocationAddress(address);
            } catch (error) {
              console.error("Error getting location address:", error);
              setLocationAddress("Location not available");
            }
          }
        }
      }
    };

    getLocationAddress();
  }, [userProfile?.location]);

  // Loading state
  if (isProfileLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No profile state
  if (!userProfile) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No profile data available</p>
            <Link href="/profile">
              <Button>Complete Your Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden">
              {userProfile.avatar_url ? (
                <Image
                  src={userProfile.avatar_url}
                  alt={`${userProfile.full_name || userProfile.username || 'User'}'s avatar`}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xl font-semibold">
                  {(userProfile.full_name || userProfile.username || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userProfile.full_name || userProfile.username || 'Anonymous User'}
              </h2>
              <p className="text-blue-600 text-sm">
                Points Balance: {userProfile.points_balance || 0}
              </p>
              {userProfile.bio && (
                <p className="text-gray-600 text-sm mt-1">{userProfile.bio}</p>
              )}
              {locationAddress && (
                <p 
                  className="text-gray-500 text-xs mt-1 truncate max-w-xs" 
                  title={locationAddress}
                >
                  📍 {locationAddress}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/profile">
              <Button variant="outline">Edit Profile</Button>
            </Link>
            <div className="text-right text-xs text-gray-500">
              Member since {new Date(userProfile.member_since || userProfile.created_at || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 