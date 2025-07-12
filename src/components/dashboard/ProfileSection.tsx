"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/lib/data/dashboard";
import { useState } from "react";

interface ProfileSectionProps {
  userProfile: UserProfile;
}

export default function ProfileSection({ userProfile }: ProfileSectionProps) {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | undefined>();
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Image
                src={userProfile.avatar}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{userProfile.name}</h2>
              <p className="text-blue-600 text-sm">Points Balance: {userProfile.pointsBalance}</p>
            </div>
          </div>
          <Link href="/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 