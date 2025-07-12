"use client";

import { Recycle, Users, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CustomButton from "./CustomButton";
import { useSession } from "@/contexts/SessionContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function HeroSection() {
  const { isAuthenticated, userProfile } = useSession();

  // Get user initials for avatar fallback
  const getUserInitials = (fullName: string | null | undefined): string => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map(name => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Header with Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="ReWear Logo"
                    width={120}
                    height={60}
                    className="object-contain cursor-pointer"
                  />
                </Link>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="#explore" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Explore
              </Link>
              <Link href="#how-it-works" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                How it Works
              </Link>
            </nav>
            <div className="flex items-center">
              {isAuthenticated && userProfile ? (
                <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={userProfile.avatar_url || ""} 
                      alt={userProfile.full_name || "User avatar"}
                    />
                    <AvatarFallback className="bg-gray-700 text-white text-sm font-medium">
                      {getUserInitials(userProfile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {userProfile.full_name || userProfile.username}
                  </span>
                </Link>
              ) : (
                <Link href="/login">
                  <div className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
                    Login
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white font-sans pt-32">
        {/* Floating Blobs */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-black/10 rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-black/15 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-black/8 rounded-full blur-3xl animate-bounce" style={{animationDuration: '5s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-black/12 rounded-full blur-xl animate-ping"></div>
          <div className="absolute top-1/2 left-1/6 w-20 h-20 bg-black/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute top-2/3 right-1/6 w-36 h-36 bg-black/6 rounded-full blur-2xl animate-bounce" style={{animationDuration: '6s'}}></div>
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-tight">
                <span className="block">Give Your Clothes</span>
                <span className="block text-gray-600">A Second Life</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-700 max-w-xl">
                Join ReWear's sustainable fashion community. Swap, donate, and discover pre-loved clothing while reducing fashion waste.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/list-item">
                  <CustomButton 
                    variant="black"
                    className="text-lg font-medium"
                  >
                    Start Swapping
                  </CustomButton>
                </Link>
                <Link href="/dashboard">
                  <CustomButton 
                    variant="white"
                    className="text-lg font-medium"
                  >
                    Browse More
                  </CustomButton>
                </Link>
              </div>
              
              {/* Stats/Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                <div className="flex items-center space-x-3">
                  <div className="bg-black p-2 rounded-full">
                    <Recycle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Eco-Friendly</h3>
                    <p className="text-gray-600 text-sm">Reduce waste</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-black p-2 rounded-full">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Community</h3>
                    <p className="text-gray-600 text-sm">Connect & share</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-black p-2 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Easy Swap</h3>
                    <p className="text-gray-600 text-sm">Simple exchange</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Hero Image */}
            <div className="relative">
              <div className="relative w-full h-[350px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero.jpg"
                  alt="ReWear - Sustainable Fashion Community"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating Elements around Image */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-black rounded-full animate-bounce"></div>
              <div className="absolute -top-2 -right-6 w-6 h-6 bg-gray-800 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
              <div className="absolute -bottom-6 -left-2 w-10 h-10 bg-gray-600 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -right-8 w-12 h-12 bg-black/20 rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-black rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
              <div className="absolute top-1/3 -right-4 w-6 h-6 bg-gray-700 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
