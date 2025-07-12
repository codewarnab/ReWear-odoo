import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="ReWear Logo"
                width={100}
                height={50}
                className="object-contain"
              />
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              Explore
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              How it Works
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
              Community
            </a>
            <Link href="/list-item">
              <Button
                className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                size="default"
              >
                + List an Item
              </Button>
            </Link>
          </nav>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
} 