'use client';
import { Heart, ShoppingCart, Star, Repeat2, ArrowLeftRight, Flag, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/supabase';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from './MorphingDialog';

// Type for clothing item - simplified
type ClothingItemWithDetails = Tables<'clothing_items'>;

// Helper function to get image URL
const getImageUrl = (images: any, fallback?: string) => {
  if (!images) return fallback || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center';
  
  try {
    const imageArray = Array.isArray(images) ? images : JSON.parse(images);
    return imageArray.length > 0 ? imageArray[0] : fallback || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center';
  } catch {
    return fallback || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center';
  }
};

// Helper function to format price
const formatPrice = (pointsValue: number | null) => {
  if (!pointsValue) return 'Free';
  return `${pointsValue} pts`;
};

// Helper function to get exchange type display
const getExchangeTypeDisplay = (exchangePreference: string | null) => {
  switch (exchangePreference) {
    case 'points_only':
      return 'Points Only';
    case 'swap_only':
      return 'Swap Only';
    case 'both':
      return 'Points & Swap';
    default:
      return 'Available';
  }
};

// Helper function to format condition
const formatCondition = (condition: string | null) => {
  if (!condition) return 'Good';
  return condition.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

interface ProductsSectionProps {
  selectedCategoryId?: string | null;
}

export default function ProductsSection({ selectedCategoryId }: ProductsSectionProps) {
  const [products, setProducts] = useState<ClothingItemWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('Items');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // Check if user is authenticated
  const checkAuth = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      router.push('/login');
      return null;
    }
    return user;
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setActionLoading(productId);
      const user = await checkAuth();
      if (!user) return;

      // Check if already in favorites
      const { data: existingFavorite, error: checkError } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking favorites:', checkError);
        return;
      }

      if (existingFavorite) {
        alert('Item is already in your favorites!');
        return;
      }

      // Add to favorites
      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          item_id: productId
        });

      if (insertError) {
        console.error('Error adding to favorites:', insertError);
        alert('Failed to add item to favorites');
      } else {
        alert('Item added to favorites!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error handling add to cart:', error);
      alert('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSwap = async (productId: string) => {
    try {
      setActionLoading(productId);
      const user = await checkAuth();
      if (!user) return;

      // Get the product details
      const product = products.find(p => p.id === productId);
      if (!product) return;

      // Create a swap transaction
      const { error: insertError } = await supabase
        .from('swap_transactions')
        .insert({
          requester_id: user.id,
          owner_id: product.owner_id,
          owner_item_id: productId,
          status: 'pending',
          message: 'Swap request initiated'
        });

      if (insertError) {
        console.error('Error creating swap transaction:', insertError);
        alert('Failed to create swap request');
      } else {
        alert('Swap request created successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error handling swap:', error);
      alert('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuyNow = async (productId: string) => {
    try {
      setActionLoading(productId);
      const user = await checkAuth();
      if (!user) return;

      // Get the product details
      const product = products.find(p => p.id === productId);
      if (!product || !product.points_value) {
        alert('Invalid product or price');
        return;
      }

      // Get user's current points balance
      const { data: userProfile, error: profileError } = await supabase
        .from('users_profiles')
        .select('points_balance')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        alert('Failed to fetch user profile');
        return;
      }

      const currentBalance = userProfile.points_balance || 0;
      if (currentBalance < product.points_value) {
        alert('Insufficient points balance');
        return;
      }

      // Create point transaction
      const { error: transactionError } = await supabase
        .from('point_transactions')
        .insert({
          user_id: user.id,
          item_id: productId,
          transaction_type: 'redemption',
          points_amount: -product.points_value,
          status: 'completed',
          description: `Purchase of ${product.title}`
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        alert('Failed to process purchase');
        return;
      }

      // Update user's points balance
      const { error: updateError } = await supabase
        .from('users_profiles')
        .update({ points_balance: currentBalance - product.points_value })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating points balance:', updateError);
      }

      // Update item status to redeemed
      const { error: itemUpdateError } = await supabase
        .from('clothing_items')
        .update({ status: 'redeemed' })
        .eq('id', productId);

      if (itemUpdateError) {
        console.error('Error updating item status:', itemUpdateError);
      }

      alert('Purchase successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error handling purchase:', error);
      alert('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReport = async (productId: string) => {
    try {
      setActionLoading(productId);
      const user = await checkAuth();
      if (!user) return;

      const reason = prompt('Please select a reason for reporting:\n1. inappropriate_content\n2. fake_item\n3. spam\n4. other\n\nEnter the reason:');
      
      const validReasons = ['inappropriate_content', 'fake_item', 'spam', 'other'];
      if (!reason || !validReasons.includes(reason)) {
        alert('Please enter a valid reason');
        return;
      }

      // Create a report
      const { error: insertError } = await supabase
        .from('reported_items')
        .insert({
          item_id: productId,
          reporter_id: user.id,
          reason: reason,
          status: 'pending',
          description: 'User reported this item'
        });

      if (insertError) {
        console.error('Error creating report:', insertError);
        alert('Failed to submit report');
      } else {
        alert('Report submitted successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error handling report:', error);
      alert('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId]);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('ProductsSection mounted, selectedCategoryId:', selectedCategoryId);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Set category name
      if (selectedCategoryId) {
        setCategoryName('Category Items');
      } else {
        setCategoryName('All Items');
      }

      // First check if there are any items at all
      const { data: allItems, error: allError } = await supabase
        .from('clothing_items')
        .select('id, title, approval_status, status')
        .limit(5);
      
      console.log('All items check - data:', allItems, 'error:', allError); // Debug log

      // Simple query to get all approved and listed items
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .select()
        .order('created_at', { ascending: false })
        .limit(20);

      console.log('Query executed - data:', data, 'error:', error); // Debug log

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        return;
      }

      console.log('Fetched products:', data); // Debug log
      
      // Filter by category if selected
      let filteredProducts = data || [];
      if (selectedCategoryId) {
        filteredProducts = filteredProducts.filter(product => product.category_id === selectedCategoryId);
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (productId: string) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated');
        return;
      }

      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking like status:', checkError);
        return;
      }

      if (existingLike) {
        // Remove like
        const { error: deleteError } = await supabase
          .from('user_favorites')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          console.error('Error removing like:', deleteError);
        }
      } else {
        // Add like
        const { error: insertError } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            item_id: productId
          });

        if (insertError) {
          console.error('Error adding like:', insertError);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Loading {categoryName}...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Featured {categoryName}
          </h2>
          <p className="text-lg text-gray-600">
            Discover amazing deals and unique finds in our {categoryName.toLowerCase()} collection
          </p>
        </div>

        {products.length > 0 ? (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <MorphingDialog key={product.id}>
                <MorphingDialogTrigger>
                  <div className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 border border-gray-100 overflow-hidden">
                    {/* Product Image */}
                    <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-100">
                      <div className="aspect-square">
                        <img 
                          src={getImageUrl(product.images)} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Floating Action Buttons */}
                      <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(product.id);
                          }}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                        >
                          <Heart className="h-4 w-4 text-gray-700 hover:text-red-500" />
                        </button>
                      </div>

                      {/* Exchange Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {getExchangeTypeDisplay(product.exchange_preference)}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-black group-hover:text-gray-800 transition-colors duration-300">
                        {product.title || 'Untitled Item'}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-black">
                          {formatPrice(product.points_value)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">4.5</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{formatCondition(product.condition)}</span>
                        <span>{product.size || 'One Size'}</span>
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description || 'Quality item in great condition'}
                      </p>
                      
                      {/* Debug info */}
                      <p className="text-xs text-gray-400">
                        Status: {product.approval_status || 'N/A'} | {product.status || 'N/A'}
                      </p>
                    </div>
                  </div>
                </MorphingDialogTrigger>

                <MorphingDialogContainer>
                  <MorphingDialogContent className="bg-white rounded-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl">
                    <div className="flex h-full min-h-[600px]">
                      {/* Left Section - Product Image */}
                      <div className="w-1/2 relative overflow-hidden bg-gray-100">
                        <MorphingDialogImage
                          src={getImageUrl(product.images)}
                          alt={product.title}
                          className="w-full h-full"
                        />
                        
                        {/* Floating indicators on image */}
                        <div className="absolute top-6 left-6">
                          <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {getExchangeTypeDisplay(product.exchange_preference)}
                          </span>
                        </div>
                        
                        <div className="absolute top-6 right-6">
                          <button 
                            onClick={() => handleAddToCart(product.id)}
                            disabled={actionLoading === product.id}
                            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200 disabled:opacity-50"
                          >
                            <Heart className="h-5 w-5 text-gray-700 hover:text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Right Section - Product Details */}
                      <div className="w-1/2 p-8 flex flex-col relative">
                        <MorphingDialogClose />
                        
                        <div className="flex-1">
                          {/* Header */}
                          <div className="mb-6">
                            <MorphingDialogTitle className="text-3xl font-bold text-black mb-2">
                              {product.title}
                            </MorphingDialogTitle>
                            <MorphingDialogSubtitle className="text-lg text-gray-600 mb-4">
                              Available for exchange
                            </MorphingDialogSubtitle>
                            
                            {/* Price and Rating */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-3xl font-bold text-black">
                                {formatPrice(product.points_value)}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <Star className="h-5 w-5 text-gray-300" />
                                <span className="text-sm text-gray-600 ml-2">(4.5)</span>
                              </div>
                            </div>
                          </div>

                          {/* Product Details */}
                          <MorphingDialogDescription
                            disableLayoutAnimation
                            variants={{
                              initial: { opacity: 0, scale: 0.8, y: 100 },
                              animate: { opacity: 1, scale: 1, y: 0 },
                              exit: { opacity: 0, scale: 0.8, y: 100 },
                            }}
                          >
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-semibold text-black block">Condition</span>
                                  <span className="text-gray-600">{formatCondition(product.condition)}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-black block">Size</span>
                                  <span className="text-gray-600">{product.size || 'One Size'}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-black block">Brand</span>
                                  <span className="text-gray-600">{product.brand || 'Unbranded'}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-black block">Seller</span>
                                  <span className="text-gray-600">SkillSwap User</span>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-black mb-2">Description</h4>
                                <p className="text-gray-700 leading-relaxed">
                                  {product.description || 'Quality item in great condition. Perfect for your wardrobe!'}
                                </p>
                              </div>
                            </div>
                          </MorphingDialogDescription>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <button 
                            onClick={() => handleAddToCart(product.id)}
                            disabled={actionLoading === product.id}
                            className="bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add to Cart</span>
                          </button>
                          
                          {(product.exchange_preference === 'swap_only' || product.exchange_preference === 'both') && (
                            <button 
                              onClick={() => handleSwap(product.id)}
                              disabled={actionLoading === product.id}
                              className="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              <Repeat2 className="h-4 w-4" />
                              <span>Swap</span>
                            </button>
                          )}
                          
                          {(product.exchange_preference === 'points_only' || product.exchange_preference === 'both') && (
                            <button 
                              onClick={() => handleBuyNow(product.id)}
                              disabled={actionLoading === product.id}
                              className="bg-black text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              <ArrowLeftRight className="h-4 w-4" />
                              <span>Buy Now</span>
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleReport(product.id)}
                            disabled={actionLoading === product.id}
                            className="bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 col-span-2"
                          >
                            <Flag className="h-4 w-4" />
                            <span>Report Item</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Section - Product Images Thumbnails */}
                    <div className="border-t border-gray-200 p-6">
                      <h4 className="font-semibold text-black mb-4">Product Images</h4>
                      <div className="grid grid-cols-4 gap-4">
                        {/* Main product image thumbnail */}
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-black">
                          <img 
                            src={getImageUrl(product.images)} 
                            alt={`${product.title} - Main`}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        
                        {/* Additional placeholder thumbnails */}
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
                            <div className="text-gray-400 text-xs text-center">
                              <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 rounded"></div>
                              More Photos
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </MorphingDialogContent>
                </MorphingDialogContainer>
              </MorphingDialog>
            ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
            <p className="text-gray-400 text-sm mt-2">
              {selectedCategoryId ? 'Try selecting a different category or view all items.' : 'Check back later for new items!'}
            </p>
            <p className="text-gray-400 text-xs mt-4">Debug: Fetched {products.length} products</p>
          </div>
        )}
      </div>
    </section>
  );
}
