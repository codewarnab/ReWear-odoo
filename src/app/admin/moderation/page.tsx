"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Eye, ArrowUpDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/supabase";

type ReportedItemWithDetails = Tables<'reported_items'> & {
  clothing_items: Tables<'clothing_items'> & {
    users_profiles: Tables<'users_profiles'> | null;
  } | null;
  reporter: Tables<'users_profiles'> | null;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportedItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    resolved: 0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('reported_items')
        .select(`
          *,
          clothing_items:item_id (
            *,
            users_profiles:owner_id (*)
          ),
          reporter:reporter_id (*)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (sortBy !== 'all') {
        query = query.eq('status', sortBy);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reports:', error);
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('reported_items')
        .select('status');

      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }

      const stats = data?.reduce((acc, item) => {
        acc.total += 1;
        if (item.status === 'pending') acc.pending += 1;
        else if (item.status === 'reviewed') acc.reviewed += 1;
        else if (item.status === 'resolved') acc.resolved += 1;
        return acc;
      }, { total: 0, pending: 0, reviewed: 0, resolved: 0 }) || { total: 0, pending: 0, reviewed: 0, resolved: 0 };

      setStats(stats);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [sortBy]);

  const handleDismiss = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reported_items')
        .update({ 
          status: 'resolved',
          resolution: 'Dismissed - No action needed',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) {
        console.error('Error dismissing report:', error);
        return;
      }

      await fetchReports();
      await fetchStats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemoveItem = async (reportId: string, itemId: string) => {
    try {
      // Update the clothing item status to mark it as removed
      const { error: itemError } = await supabase
        .from('clothing_items')
        .update({ 
          status: 'removed',
          approval_status: 'rejected'
        })
        .eq('id', itemId);

      if (itemError) {
        console.error('Error removing item:', itemError);
        return;
      }

      // Update the report status
      const { error: reportError } = await supabase
        .from('reported_items')
        .update({ 
          status: 'resolved',
          resolution: 'Item removed from platform',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (reportError) {
        console.error('Error updating report:', reportError);
        return;
      }

      await fetchReports();
      await fetchStats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewDetails = (reportId: string) => {
    console.log(`View details for report ${reportId}`);
    // Add navigation to detailed view
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "pending":
        return "destructive";
      case "resolved":
        return "default";
      case "reviewed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getItemImage = (item: Tables<'clothing_items'> | null) => {
    if (!item || !item.images) return null;
    
    // Try to get the first image from the images array/JSON
    try {
      const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images as string);
      return images.length > 0 ? images[0] : null; // Return first image URL or null
    } catch {
      return null;
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
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Actions taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                User Reports
              </CardTitle>
              <CardDescription>Items reported by users for review</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'all' | 'pending' | 'reviewed' | 'resolved')}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading reports...</div>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">No reports found</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Reported Item</TableHead>
                  <TableHead className="w-[15%]">Reported By</TableHead>
                  <TableHead className="w-[12%]">Reason</TableHead>
                  <TableHead className="w-[8%]">Status</TableHead>
                  <TableHead className="w-[10%]">Date</TableHead>
                  <TableHead className="w-[25%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="w-[30%]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {getItemImage(report.clothing_items) ? (
                            <img 
                              src={getItemImage(report.clothing_items)} 
                              alt={report.clothing_items?.title || 'Item image'}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-lg">📦</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium line-clamp-2 break-words">
                            {report.clothing_items?.title || 'Unknown Item'}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-3 break-words">
                            {report.description || 'No description provided'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-[15%]">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={report.reporter?.avatar_url || undefined} />
                          <AvatarFallback>
                            {report.reporter?.full_name?.charAt(0) || 
                             report.reporter?.username?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">
                          {report.reporter?.full_name || 
                           report.reporter?.username || 'Unknown User'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="w-[12%]">
                      <Badge variant="outline" className="truncate">
                        {report.reason}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[8%]">
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[10%]">{formatDate(report.created_at)}</TableCell>
                    <TableCell className="w-[25%]">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(report.id)}
                          className="flex-shrink-0"
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
                              className="flex-shrink-0"
                            >
                              Dismiss
                            </Button>
                            {report.clothing_items && (
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                                onClick={() => handleRemoveItem(report.id, report.clothing_items!.id)}
                              >
                                Remove
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
