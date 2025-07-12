'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DetailedItem, 
  SwapHistoryItem, 
  getDetailedItemById, 
  mockSwapHistory, 
  getStatusColor 
} from "@/lib/data/dashboard";
import { ArrowLeft, Edit, Trash2, Archive, ToggleLeft, ToggleRight } from "lucide-react";

interface ManageItemPageProps {
  params: { id: string };
}

export default function ManageItemPage({ params }: ManageItemPageProps) {
  const router = useRouter();
  const [item, setItem] = useState<DetailedItem | undefined>(getDetailedItemById(params.id));
  const [swapHistory] = useState<SwapHistoryItem[]>(mockSwapHistory);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleToggleAvailability = () => {
    setItem({ ...item, isAvailable: !item.isAvailable });
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      // In a real app, this would call an API
      console.log('Deleting item:', item.id);
      router.push('/dashboard');
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleEdit = () => {
    // In a real app, this would navigate to edit page
    console.log('Edit item:', item.id);
  };

  const handleArchive = () => {
    // In a real app, this would call an API to archive the item
    console.log('Archive item:', item.id);
  };

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
          Manage Item – {item.title}
        </h1>

        {/* Item Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
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
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Listed Date:</span>
                        <span className="text-sm text-gray-900">{item.listedDate}</span>
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
                {item.description && (
                  <div className="mt-4">
                    <span className="text-sm text-gray-500">Description:</span>
                    <p className="text-sm text-gray-900 mt-1">{item.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
              <Button onClick={handleEdit} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Item
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {showDeleteConfirm ? 'Confirm Delete' : 'Delete Item'}
              </Button>
              {showDeleteConfirm && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Swap/Redemption History Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Swap/Redemption History</CardTitle>
          </CardHeader>
          <CardContent>
            {swapHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Counterparty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swapHistory.map((historyItem) => (
                      <tr key={historyItem.id} className="border-b">
                        <td className="py-4 px-4 text-gray-900">{historyItem.date}</td>
                        <td className="py-4 px-4 text-gray-900">{historyItem.type}</td>
                        <td className="py-4 px-4 text-gray-900">{historyItem.counterparty}</td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(historyItem.status)}>
                            {historyItem.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions for this item yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Item Status Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleToggleAvailability}
                  className="flex items-center gap-2"
                >
                  {item.isAvailable ? (
                    <ToggleRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-gray-400" />
                  )}
                  {item.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleArchive}
                className="flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                Archive Listing
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>
                {item.isAvailable 
                  ? 'This item is currently available for swapping.' 
                  : 'This item is currently unavailable for swapping.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 