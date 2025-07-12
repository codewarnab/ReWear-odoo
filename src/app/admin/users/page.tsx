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
import { Input } from "@/components/ui/input";
import { Search, UserPlus, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "@/types/supabase";

type UserProfile = Tables<"users_profiles"> & {
  total_items_listed: number;
  role: "User" | "Moderator" | "Admin";
  status: "active" | "inactive" | "suspended";
};

type UserStats = {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  newThisWeek: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    newThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      
      // Fetch users data with their item counts
      const { data: usersData, error: usersError } = await supabase
        .from("users_profiles")
        .select(`
          *
        `)
        .order("created_at", { ascending: false });

      if (usersError) {
        console.error("Error fetching users:", usersError);
        return;
      }

      // Fetch item counts for each user
      const usersWithItemCounts = await Promise.all(
        (usersData || []).map(async (user) => {
          const { count } = await supabase
            .from("clothing_items")
            .select("*", { count: "exact", head: true })
            .eq("owner_id", user.id);

          return {
            ...user,
            total_items_listed: count || 0,
            role: determineUserRole(user),
            status: determineUserStatus(user),
          } as UserProfile;
        })
      );

      setUsers(usersWithItemCounts);

      // Calculate stats
      const totalUsers = usersWithItemCounts.length;
      const activeUsers = usersWithItemCounts.filter(user => user.status === "active").length;
      const suspendedUsers = usersWithItemCounts.filter(user => user.status === "suspended").length;
      
      // Calculate new users this week (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newThisWeek = usersWithItemCounts.filter(user => 
        user.created_at && new Date(user.created_at) >= oneWeekAgo
      ).length;

      setStats({
        totalUsers,
        activeUsers,
        suspendedUsers,
        newThisWeek,
      });

    } catch (error) {
      console.error("Error fetching users data:", error);
    } finally {
      setLoading(false);
    }
  };

  const determineUserRole = (user: Tables<"users_profiles">): "User" | "Moderator" | "Admin" => {
    // You can implement role logic based on your business requirements
    // For now, we'll assume all users are "User" unless you have a roles table
    return "User";
  };

  const determineUserStatus = (user: Tables<"users_profiles">): "active" | "inactive" | "suspended" => {
    if (!user.is_active) return "inactive";
    // You can add more logic here to determine suspended users
    // For now, we'll assume all active users are "active"
    return "active";
  };

  const handleViewUser = async (userId: string) => {
    console.log(`View user ${userId}`);
    // Implement view user functionality
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("users_profiles")
        .update({ is_active: false })
        .eq("id", userId);

      if (error) {
        console.error("Error suspending user:", error);
        return;
      }

      // Refresh the data
      fetchUsersData();
      console.log(`User ${userId} suspended successfully`);
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("users_profiles")
        .update({ is_active: true })
        .eq("id", userId);

      if (error) {
        console.error("Error activating user:", error);
        return;
      }

      // Refresh the data
      fetchUsersData();
      console.log(`User ${userId} activated successfully`);
    } catch (error) {
      console.error("Error activating user:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-white overflow-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage user accounts on your platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total` : "No users"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.suspendedUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalUsers > 0 ? `${((stats.suspendedUsers / stats.totalUsers) * 100).toFixed(1)}% of total` : "No users"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.newThisWeek.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>All registered users on your platform</CardDescription>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search users..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items Listed</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.full_name || user.username || "Unnamed User"}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "Moderator" ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "suspended"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.total_items_listed}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                              View Details
                            </DropdownMenuItem>
                            {user.status === "active" ? (
                              <DropdownMenuItem 
                                onClick={() => handleSuspendUser(user.id)}
                                className="text-red-600"
                              >
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleActivateUser(user.id)}
                                className="text-green-600"
                              >
                                Activate User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No users found matching your search." : "No users found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
