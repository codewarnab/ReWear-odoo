"use client";

import { useState, useEffect } from "react";
import { 
  Header, 
  ProfileSection, 
  UploadedItemsOverview, 
  TransactionsSection 
} from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/types/supabase";
import { 
  mockUploadedItems, 
  mockTransactions 
} from "@/lib/data/dashboard";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";

// Types for fetched data
type ClothingItemWithDetails = Tables<'clothing_items'> & {
  categories: Tables<'categories'> | null;
};

type PointTransactionWithDetails = Tables<'point_transactions'> & {
  clothing_items: Tables<'clothing_items'> | null;
};

type SwapTransactionWithDetails = Tables<'swap_transactions'> & {
  owner_item: Tables<'clothing_items'> | null;
  requester_item: Tables<'clothing_items'> | null;
};

type FavoriteItemWithDetails = Tables<'user_favorites'> & {
  clothing_items: ClothingItemWithDetails | null;
};

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setUserProfile({
          id: profileData.id,
          name: profileData.full_name || profileData.username || 'User',
          avatar: profileData.avatar_url || '/api/placeholder/64/64',
          pointsBalance: profileData.points_balance || 0,
        });
      }

      // Fetch uploaded items
      await fetchUploadedItems();
      
      // Fetch transactions
      await fetchTransactions();
      
      // Fetch favorite items
      await fetchFavoriteItems();
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select(`
          *,
          categories (*)
        `)
        .eq('owner_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching uploaded items:', error);
        return;
      }

      const formattedItems: UploadedItem[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        emoji: getItemEmoji(item.categories?.name || ''),
        status: mapStatus(item.status),
        bgColor: getBgColor(item.categories?.name || ''),
        images: formatImages(item.images),
      }));

      setUploadedItems(formattedItems);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      // Fetch point transactions
      const { data: pointData, error: pointError } = await supabase
        .from('point_transactions')
        .select(`
          *,
          clothing_items (*)
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (pointError) {
        console.error('Error fetching point transactions:', pointError);
      }

      // Fetch swap transactions
      const { data: swapData, error: swapError } = await supabase
        .from('swap_transactions')
        .select(`
          *,
          owner_item:owner_item_id (*),
          requester_item:requester_item_id (*)
        `)
        .or(`owner_id.eq.${currentUser.id},requester_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (swapError) {
        console.error('Error fetching swap transactions:', swapError);
      }

      // Combine and format transactions
      const allTransactions: Transaction[] = [];

      // Add point transactions
      (pointData || []).forEach((transaction) => {
        if (transaction.clothing_items) {
          allTransactions.push({
            id: `point_${transaction.id}`,
            itemTitle: transaction.clothing_items.title,
            emoji: getItemEmoji(''),
            bgColor: 'bg-blue-100',
            status: mapTransactionStatus(transaction.status),
            type: transaction.status === 'completed' ? 'completed' : 'ongoing',
            images: formatImages(transaction.clothing_items.images),
          });
        }
      });

      // Add swap transactions
      (swapData || []).forEach((transaction) => {
        const isOwner = transaction.owner_id === currentUser.id;
        const relevantItem = isOwner ? transaction.owner_item : transaction.requester_item;
        
        if (relevantItem) {
          allTransactions.push({
            id: `swap_${transaction.id}`,
            itemTitle: relevantItem.title,
            emoji: getItemEmoji(''),
            bgColor: 'bg-purple-100',
            status: mapTransactionStatus(transaction.status),
            type: transaction.status === 'completed' ? 'completed' : 'ongoing',
            images: formatImages(relevantItem.images),
          });
        }
      });

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchFavoriteItems = async () => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          clothing_items (
            *,
            categories (*)
          )
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorite items:', error);
        return;
      }

      setFavoriteItems(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Helper functions
  const getItemEmoji = (category: string): string => {
    const categoryEmojiMap: { [key: string]: string } = {
      'dresses': '👗',
      'jeans': '👖',
      'tops': '👕',
      'sweaters': '🧥',
      'jackets': '🧥',
      'shoes': '👟',
      'accessories': '👜',
      'skirts': '👗',
      'pants': '👖',
    };
    return categoryEmojiMap[category.toLowerCase()] || '👕';
  };

  const getBgColor = (category: string): string => {
    const categoryColorMap: { [key: string]: string } = {
      'dresses': 'bg-pink-100',
      'jeans': 'bg-blue-100',
      'tops': 'bg-green-100',
      'sweaters': 'bg-gray-100',
      'jackets': 'bg-amber-100',
      'shoes': 'bg-purple-100',
      'accessories': 'bg-yellow-100',
      'skirts': 'bg-rose-100',
      'pants': 'bg-indigo-100',
    };
    return categoryColorMap[category.toLowerCase()] || 'bg-gray-100';
  };

  const mapStatus = (status: string | null): 'Listed' | 'Swapped' | 'Pending' => {
    switch (status) {
      case 'listed':
        return 'Listed';
      case 'swapped':
      case 'redeemed':
        return 'Swapped';
      case 'pending_approval':
      default:
        return 'Pending';
    }
  };

  const mapTransactionStatus = (status: string | null): 'In Progress' | 'Completed' | 'Pending' => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      default:
        return 'In Progress';
    }
  };

  const formatImages = (images: any): string[] => {
    if (!images) return [];
    try {
      if (Array.isArray(images)) return images;
      if (typeof images === 'string') return JSON.parse(images);
      return [];
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        {/* The ProfileSection component displays user profile information 
       <ProfileSection userProfile={userProfile} />*/}
        

        
        {/* My Cart (Favorite Items) Section */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <CardTitle>My Cart (Favorites)</CardTitle>
            </div>
            <Badge variant="outline">
              {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </CardHeader>
          <CardContent>
            {favoriteItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No favorite items yet</p>
                <p className="text-sm text-gray-400">Start browsing and add items to your favorites!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteItems.map((favorite) => {
                  const item = favorite.clothing_items;
                  if (!item) return null;
                  
                  return (
                    <div key={favorite.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${getBgColor(item.categories?.name || '')}`}>
                          {getItemEmoji(item.categories?.name || '')}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.categories?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {item.exchange_preference === 'points_only' ? 'Points' : 
                           item.exchange_preference === 'swap_only' ? 'Swap' : 'Both'}
                        </Badge>
                        {item.points_value && (
                          <span className="text-sm font-medium text-blue-600">
                            {item.points_value} pts
                          </span>
                        )}
                      </div>
                      <div className="mt-3">
                        <Link href={`/swapped-item/${item.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <UploadedItemsOverview uploadedItems={uploadedItems} />
        
        <TransactionsSection transactions={transactions} />
      </main>
    </div>
  );
}
