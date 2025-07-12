import { Recycle, Users, ShoppingBag } from "lucide-react";
import Image from "next/image";
import CustomButton from "./CustomButton";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white font-sans pt-32">
      {/* Logo */}
      <div className="absolute top-8 left-8 z-30">
        <Image
          src="/logo.png"
          alt="ReWear Logo"
          width={120}
          height={60}
          className="object-contain"
        />
      </div>
      
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
              <CustomButton 
                variant="black"
                className="text-lg font-medium"
              >
                Start Swapping
              </CustomButton>
              <CustomButton 
                variant="white"
                className="text-lg font-medium"
              >
                Browse More
              </CustomButton>
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
  );
}
