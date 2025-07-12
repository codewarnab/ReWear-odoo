"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for pending listings
const pendingItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    uploader: "Alex Doe",
    date: "2023-10-27",
    image: "👔",
    category: "Outerwear",
    price: "$45",
  },
  {
    id: 2,
    title: "Floral Summer Dress",
    uploader: "Jane Smith",
    date: "2023-10-26",
    image: "👗",
    category: "Dresses",
    price: "$32",
  },
  {
    id: 3,
    title: "Classic White Sneakers",
    uploader: "Sam Wilson",
    date: "2023-10-26",
    image: "👟",
    category: "Footwear",
    price: "$28",
  },
  {
    id: 4,
    title: "Leather Crossbody Bag",
    uploader: "Emily Carter",
    date: "2023-10-25",
    image: "👜",
    category: "Accessories",
    price: "$65",
  },
  {
    id: 5,
    title: "Wool Winter Coat",
    uploader: "Michael Brown",
    date: "2023-10-24",
    image: "🧥",
    category: "Outerwear",
    price: "$85",
  },
];

export default function ModerationPage() {
  const handleApprove = (itemId: number) => {
    console.log(`Approved item ${itemId}`);
    // Add actual approval logic here
  };

  const handleRemove = (itemId: number) => {
    console.log(`Removed item ${itemId}`);
    // Add actual removal logic here
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-white overflow-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Item Moderation</h1>
        <p className="text-muted-foreground">
          Review and approve new item listings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">47</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">23</div>
            <p className="text-xs text-muted-foreground">Items approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
            <p className="text-xs text-muted-foreground">Items rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Listings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Listings</CardTitle>
          <CardDescription>Items waiting for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {item.image}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.uploader}</TableCell>
                    <TableCell className="font-medium">{item.price}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(item.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleRemove(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
