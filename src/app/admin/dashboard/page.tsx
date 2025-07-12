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
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/supabase";

type PendingItemWithDetails = Tables<'clothing_items'> & {
  users_profiles: Tables<'users_profiles'> | null;
  categories: Tables<'categories'> | null;
};

export default function ModerationPage() {
  const [pendingItems, setPendingItems] = useState<PendingItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approvedToday: 0,
    rejectedToday: 0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchPendingItems();
    fetchStats();
  }, []);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('clothing_items')
        .select(`
          *,
          users_profiles:owner_id (*),
          categories:category_id (*)
        `)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending items:', error);
        return;
      }

      setPendingItems(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get pending count
      const { data: pendingData, error: pendingError } = await supabase
        .from('clothing_items')
        .select('id')
        .eq('approval_status', 'pending');

      if (pendingError) {
        console.error('Error fetching pending stats:', pendingError);
        return;
      }

      // Get approved today count
      const today = new Date().toISOString().split('T')[0];
      const { data: approvedData, error: approvedError } = await supabase
        .from('clothing_items')
        .select('id')
        .eq('approval_status', 'approved')
        .gte('approval_date', `${today}T00:00:00.000Z`)
        .lte('approval_date', `${today}T23:59:59.999Z`);

      if (approvedError) {
        console.error('Error fetching approved stats:', approvedError);
        return;
      }

      // Get rejected today count
      const { data: rejectedData, error: rejectedError } = await supabase
        .from('clothing_items')
        .select('id')
        .eq('approval_status', 'rejected')
        .gte('updated_at', `${today}T00:00:00.000Z`)
        .lte('updated_at', `${today}T23:59:59.999Z`);

      if (rejectedError) {
        console.error('Error fetching rejected stats:', rejectedError);
        return;
      }

      setStats({
        pending: pendingData?.length || 0,
        approvedToday: approvedData?.length || 0,
        rejectedToday: rejectedData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (itemId: string) => {
    try {
      // First, let's try with just the approval status and see what works
      const { error } = await supabase
        .from('clothing_items')
        .update({
          approval_status: 'approved',
          approval_date: new Date().toISOString(),
          listed_at: new Date().toISOString(),
          // Keep the current status unchanged for now
          // You might want to set approved_by to the current admin user ID
          // approved_by: currentAdminId
        })
        .eq('id', itemId);

      if (error) {
        console.error('Error approving item:', error);
        return;
      }

      // Refresh data
      await fetchPendingItems();
      await fetchStats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .update({
          approval_status: 'rejected',
          rejection_reason: 'Item does not meet platform guidelines',
          updated_at: new Date().toISOString(),
          // Keep the current status unchanged for now
          // You might want to set approved_by to the current admin user ID
          // approved_by: currentAdminId
        })
        .eq('id', itemId);

      if (error) {
        console.error('Error rejecting item:', error);
        return;
      }

      // Refresh data
      await fetchPendingItems();
      await fetchStats();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getItemImage = (item: Tables<'clothing_items'>) => {
    if (!item.images) return null;
    
    // Try to get the first image from the images array/JSON
    try {
      const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images as string);
      return images.length > 0 ? images[0] : null; // Return first image URL or null
    } catch {
      return null;
    }
  };

  const getExchangePreferenceDisplay = (preference: string | null) => {
    switch (preference) {
      case 'points':
        return 'Points';
      case 'swap':
        return 'Swap';
      default:
        return 'N/A';
    }
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
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedToday}</div>
            <p className="text-xs text-muted-foreground">Items approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedToday}</div>
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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading pending items...</div>
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">No pending items found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Uploader</TableHead>
                    <TableHead>Exchange Type</TableHead>
                    <TableHead>Points Value</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {getItemImage(item) ? (
                              <img 
                                src={getItemImage(item)} 
                                alt={item.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-2xl">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500 max-w-xs truncate">
                              {item.description || 'No description'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.categories?.name || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={item.users_profiles?.avatar_url || undefined} />
                            <AvatarFallback>
                              {item.users_profiles?.full_name?.charAt(0) || 
                               item.users_profiles?.username?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {item.users_profiles?.full_name || 
                             item.users_profiles?.username || 'Unknown User'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.exchange_preference === 'points' ? 'default' : 'secondary'}>
                          {getExchangePreferenceDisplay(item.exchange_preference)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.points_value ? `${item.points_value} pts` : 'N/A'}
                      </TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
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
                            onClick={() => handleReject(item.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
