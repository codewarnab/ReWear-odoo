import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ListingForm from "./components/ListingForm";

export default function ListItemPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gray-900">👗 ReWear</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Explore
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                How it Works
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Community
              </Link>
            </nav>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            List Your Item
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your pre-loved items with the community and discover new treasures. 
            Fill in the details below to get started.
          </p>
        </div>

        {/* Form */}
        <ListingForm />
      </main>
    </div>
  );
} 