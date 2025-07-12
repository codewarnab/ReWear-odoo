'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DetailedItem, 
  getDetailedItemById, 
  getStatusColor 
} from "@/lib/data/dashboard";
import { ArrowLeft, MessageCircle, RotateCcw } from "lucide-react";

interface SwappedItemPageProps {
  params: { id: string };
}

// Mock data for swapped item details
const mockSwappedItemDetails = {
  swapPartner: {
    username: "Emma Johnson",
    profileLink: "/profile/emma-johnson",
  },
  itemReceived: {
    title: "Vintage Leather Jacket",
    emoji: "🧥",
    bgColor: "bg-brown-100",
    thumbnail: true,
  },
  swapDetails: {
    finalStatus: "Completed",
    swapDate: "June 15, 2025",
    confirmationDate: "June 20, 2025",
    conversationLink: "/conversation/swap-123",
  },
  timeline: [
    {
      id: 1,
      event: "Swap Request Sent",
      date: "June 10, 2025",
      description: "Emma requested to swap her jacket for your dress",
    },
    {
      id: 2,
      event: "Request Accepted",
      date: "June 11, 2025",
      description: "You accepted the swap request",
    },
    {
      id: 3,
      event: "Items Shipped",
      date: "June 12, 2025",
      description: "Both items were shipped to respective addresses",
    },
    {
      id: 4,
      event: "Items Received",
      date: "June 15, 2025",
      description: "Both parties confirmed item receipt",
    },
    {
      id: 5,
      event: "Swap Completed",
      date: "June 20, 2025",
      description: "Swap successfully completed",
    },
  ],
};

export default function SwappedItemPage({ params }: SwappedItemPageProps) {
  const router = useRouter();
  const [item] = useState<DetailedItem | undefined>(getDetailedItemById(params.id));
  const [swapDetails] = useState(mockSwappedItemDetails);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (item.status !== 'Swapped') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Swapped</h1>
          <p className="text-gray-600 mb-4">This item has not been swapped yet.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Swapped Item Summary – {item.title}
        </h1>

        {/* Item Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Item Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Item Image */}
              <div className="flex-shrink-0">
                <div className={`w-24 h-24 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                  <span className="text-4xl">{item.emoji}</span>
                </div>
              </div>

              {/* Item Info */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Date Swapped:</span>
                        <span className="text-sm text-gray-900">{swapDetails.swapDetails.swapDate}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Category:</span>
                        <span className="text-sm text-gray-900">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Size:</span>
                        <span className="text-sm text-gray-900">{item.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Condition:</span>
                        <span className="text-sm text-gray-900">{item.condition}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swap Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Swap Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Swap Partner</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Username:</span>
                    <a 
                      href={swapDetails.swapPartner.profileLink}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {swapDetails.swapPartner.username}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Final Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(swapDetails.swapDetails.finalStatus)}`}>
                      {swapDetails.swapDetails.finalStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Confirmation Date:</span>
                    <span className="text-sm text-gray-900">{swapDetails.swapDetails.confirmationDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Item Received</h4>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${swapDetails.itemReceived.bgColor} rounded-lg flex items-center justify-center`}>
                    <span className="text-2xl">{swapDetails.itemReceived.emoji}</span>
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">{swapDetails.itemReceived.title}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <a 
                    href={swapDetails.swapDetails.conversationLink}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    View Conversation
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Transaction Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {swapDetails.timeline.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      index === swapDetails.timeline.length - 1 ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{event.event}</h4>
                      <span className="text-sm text-gray-500">{event.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loved this swap experience?
              </h3>
              <p className="text-gray-600 mb-4">
                List similar items to continue swapping and earning points!
              </p>
              <Button className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Re-list a Similar Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 