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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle, Eye } from "lucide-react";

// Mock data for reports
const reports = [
  {
    id: 1,
    itemTitle: "Vintage Denim Jacket",
    itemImage: "👔",
    reportedBy: "Sarah Johnson",
    reporterAvatar: "/placeholder-avatar.jpg",
    reason: "Inappropriate content",
    description: "Item contains inappropriate language in description",
    date: "2023-10-27",
    status: "pending",
    severity: "medium",
  },
  {
    id: 2,
    itemTitle: "Designer Handbag",
    itemImage: "👜",
    reportedBy: "Mike Davis",
    reporterAvatar: "/placeholder-avatar.jpg",
    reason: "Counterfeit item",
    description: "This appears to be a fake designer bag being sold as authentic",
    date: "2023-10-26",
    status: "pending",
    severity: "high",
  },
  {
    id: 3,
    itemTitle: "Running Shoes",
    itemImage: "👟",
    reportedBy: "Lisa Chen",
    reporterAvatar: "/placeholder-avatar.jpg",
    reason: "Damaged item",
    description: "Item photos don't show significant damage mentioned in listing",
    date: "2023-10-25",
    status: "resolved",
    severity: "low",
  },
  {
    id: 4,
    itemTitle: "Winter Coat",
    itemImage: "🧥",
    reportedBy: "Tom Wilson",
    reporterAvatar: "/placeholder-avatar.jpg",
    reason: "Spam/Duplicate",
    description: "Same item posted multiple times by the same user",
    date: "2023-10-24",
    status: "pending",
    severity: "medium",
  },
  {
    id: 5,
    itemTitle: "Summer Dress",
    itemImage: "👗",
    reportedBy: "Anna Rodriguez",
    reporterAvatar: "/placeholder-avatar.jpg",
    reason: "Inappropriate content",
    description: "Images are not appropriate for the platform",
    date: "2023-10-23",
    status: "dismissed",
    severity: "low",
  },
];

export default function ReportsPage() {
  const handleDismiss = (reportId: number) => {
    console.log(`Dismissed report ${reportId}`);
    // Add actual dismiss logic here
  };

  const handleRemoveItem = (reportId: number) => {
    console.log(`Removed item from report ${reportId}`);
    // Add actual removal logic here
  };

  const handleViewDetails = (reportId: number) => {
    console.log(`View details for report ${reportId}`);
    // Add navigation to detailed view
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive";
      case "resolved":
        return "default";
      case "dismissed":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-white overflow-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Handle user reports and content moderation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">28</div>
            <p className="text-xs text-muted-foreground">Actions taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dismissed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">7</div>
            <p className="text-xs text-muted-foreground">No action needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            User Reports
          </CardTitle>
          <CardDescription>Items reported by users for review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reported Item</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {report.itemImage}
                        </div>
                        <div>
                          <p className="font-medium">{report.itemTitle}</p>
                          <p className="text-sm text-gray-500 max-w-xs truncate">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={report.reporterAvatar} />
                          <AvatarFallback>{report.reportedBy.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{report.reportedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.reason}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(report.severity)}>
                        {report.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(report.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {report.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDismiss(report.id)}
                            >
                              Dismiss
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleRemoveItem(report.id)}
                            >
                              Remove
                            </Button>
                          </>
                        )}
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
