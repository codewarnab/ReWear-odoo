import { createClient } from './client';
import { uploadImagesToBucket } from './imageUpload';
import { getCategoryBySlug } from './categories';
import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';

// Type aliases for better readability
export type ClothingItem = Tables<'clothing_items'>;
export type ClothingItemInsert = TablesInsert<'clothing_items'>;
export type ClothingItemUpdate = TablesUpdate<'clothing_items'>;

/**
 * Interface for creating a new clothing item
 */
export interface CreateClothingItemInput {
  title: string;
  description?: string;
  category: string; // Category name/slug
  size?: string;
  condition?: string;
  brand?: string;
  color?: string;
  material?: string;
  tags?: string[];
  images?: File[]; // Array of image files
  points_value?: number;
  exchange_preference?: 'swap_only' | 'points_only' | 'both';
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

/**
 * Interface for the response when creating a clothing item
 */
export interface CreateClothingItemResult {
  success: boolean;
  item?: ClothingItem;
  error?: string;
  imageUploadResults?: {
    successCount: number;
    failureCount: number;
    errors: string[];
  };
}

/**
 * Interface for listing clothing items with filters
 */
export interface ListClothingItemsFilters {
  category?: string;
  size?: string;
  condition?: string;
  brand?: string;
  color?: string;
  status?: string;
  owner_id?: string;
  limit?: number;
  offset?: number;
}

/**
 * Creates a new clothing item in the database with image uploads
 * 
 * @param input - The clothing item data and images
 * @param userId - The ID of the user creating the item
 * @returns Promise<CreateClothingItemResult> - Result containing success status and item data
 * 
 * @example
 * ```typescript
 * const result = await createClothingItem({
 *   title: "Blue Denim Jacket",
 *   description: "Vintage denim jacket in excellent condition",
 *   category: "jackets",
 *   size: "M",
 *   condition: "excellent",
 *   brand: "Levi's",
 *   images: [file1, file2],
 *   location: {
 *     address: "123 Main St",
 *     city: "New York",
 *     state: "NY",
 *     country: "USA"
 *   }
 * }, userId);
 * 
 * if (result.success) {
 *   console.log('Item created:', result.item);
 * }
 * ```
 */
export async function createClothingItem(
  input: CreateClothingItemInput,
  userId: string
): Promise<CreateClothingItemResult> {
  const supabase = createClient();
  
  try {
    console.log('Creating clothing item with input:', { ...input, images: input.images?.length || 0 });
    console.log('User ID:', userId);
    
    // 1. Validate and get category
    const categorySlug = input.category.toLowerCase();
    console.log('Looking up category:', categorySlug);
    
    const category = await getCategoryBySlug(categorySlug);
    console.log('Category found:', category);
    
    if (!category) {
      console.error('Category not found:', categorySlug);
      return {
        success: false,
        error: `Category '${input.category}' not found`
      };
    }

    // 2. Upload images if provided
    let imageUrls: string[] = [];
    let imageUploadResults;
    
    if (input.images && input.images.length > 0) {
      console.log('Uploading images, count:', input.images.length);
      
      const uploadResult = await uploadImagesToBucket(input.images, {
        bucketName: 'clothing-items',
        folderPath: 'listings',
        maxSizeBytes: 5 * 1024 * 1024, // 5MB
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        upsert: false
      });
      
      console.log('Image upload result:', uploadResult);
      
      imageUrls = uploadResult.successfulUrls;
      imageUploadResults = {
        successCount: uploadResult.successCount,
        failureCount: uploadResult.failureCount,
        errors: uploadResult.errors
      };
      
      // If no images were uploaded successfully, but images were provided
      if (uploadResult.successCount === 0 && input.images.length > 0) {
        console.error('No images uploaded successfully');
        return {
          success: false,
          error: 'Failed to upload images: ' + uploadResult.errors.join(', '),
          imageUploadResults
        };
      }
    } else {
      console.log('No images to upload');
    }

    // 3. Prepare the database record
    const clothingItemData: ClothingItemInsert = {
      owner_id: userId,
      title: input.title,
      description: input.description,
      category_id: category.id,
      size: input.size || null,
      condition: input.condition || null,
      brand: input.brand || null,
      color: input.color || null,
      material: input.material || null,
      tags: input.tags || null,
      images: imageUrls.length > 0 ? imageUrls : null,
      points_value: input.points_value || null,
      exchange_preference: input.exchange_preference || 'both',
      status: 'pending_approval', // Default status
      approval_status: 'pending',
      view_count: 0,
      favorite_count: 0,
      is_featured: false,
      listed_at: null, // Will be set when approved
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 4. Insert into database
    console.log('Inserting clothing item data:', clothingItemData);
    
    const { data, error } = await supabase
      .from('clothing_items')
      .insert([clothingItemData])
      .select()
      .single();

    if (error) {
      console.error('Error creating clothing item:', error);
      return {
        success: false,
        error: 'Failed to create clothing item: ' + error.message
      };
    }
    
    console.log('Successfully created clothing item:', data);

    // 5. Update user's total items listed count
    console.log('Updating user items listed count for user:', userId);
    const { error: rpcError } = await supabase.rpc('increment_user_items_listed', { user_id: userId });
    
    if (rpcError) {
      console.error('Error updating user items count:', rpcError);
      // Don't fail the entire operation for this
    }

    console.log('Clothing item creation completed successfully');
    return {
      success: true,
      item: data,
      imageUploadResults
    };

  } catch (error) {
    console.error('Error in createClothingItem:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Updates an existing clothing item
 * 
 * @param itemId - The ID of the item to update
 * @param updates - The fields to update
 * @param userId - The ID of the user performing the update
 * @returns Promise<CreateClothingItemResult> - Result containing success status and updated item data
 */
export async function updateClothingItem(
  itemId: string,
  updates: Partial<CreateClothingItemInput>,
  userId: string
): Promise<CreateClothingItemResult> {
  const supabase = createClient();
  
  try {
    // 1. Verify ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from('clothing_items')
      .select('*')
      .eq('id', itemId)
      .eq('owner_id', userId)
      .single();

    if (fetchError || !existingItem) {
      return {
        success: false,
        error: 'Item not found or unauthorized'
      };
    }

    // 2. Handle category update if provided
    let categoryId = existingItem.category_id;
    if (updates.category) {
      const category = await getCategoryBySlug(updates.category);
      if (!category) {
        return {
          success: false,
          error: `Category '${updates.category}' not found`
        };
      }
      categoryId = category.id;
    }

    // 3. Handle image uploads if provided
    let imageUrls = existingItem.images as string[] || [];
    let imageUploadResults;
    
    if (updates.images && updates.images.length > 0) {
      const uploadResult = await uploadImagesToBucket(updates.images, {
        bucketName: 'clothing-items',
        folderPath: 'listings',
        maxSizeBytes: 5 * 1024 * 1024,
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        upsert: false
      });
      
      // Replace existing images with new ones
      imageUrls = uploadResult.successfulUrls;
      imageUploadResults = {
        successCount: uploadResult.successCount,
        failureCount: uploadResult.failureCount,
        errors: uploadResult.errors
      };
    }

    // 4. Prepare update data
    const updateData: ClothingItemUpdate = {
      ...(updates.title && { title: updates.title }),
      ...(updates.description && { description: updates.description }),
      ...(updates.category && { category_id: categoryId }),
      ...(updates.size !== undefined && { size: updates.size }),
      ...(updates.condition !== undefined && { condition: updates.condition }),
      ...(updates.brand !== undefined && { brand: updates.brand }),
      ...(updates.color !== undefined && { color: updates.color }),
      ...(updates.material !== undefined && { material: updates.material }),
      ...(updates.tags !== undefined && { tags: updates.tags }),
      ...(updates.images && { images: imageUrls.length > 0 ? imageUrls : null }),
      ...(updates.points_value !== undefined && { points_value: updates.points_value }),
      ...(updates.exchange_preference && { exchange_preference: updates.exchange_preference }),
      updated_at: new Date().toISOString()
    };

    // 5. Update the item
    const { data, error } = await supabase
      .from('clothing_items')
      .update(updateData)
      .eq('id', itemId)
      .eq('owner_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating clothing item:', error);
      return {
        success: false,
        error: 'Failed to update clothing item: ' + error.message
      };
    }

    return {
      success: true,
      item: data,
      imageUploadResults
    };

  } catch (error) {
    console.error('Error in updateClothingItem:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Retrieves a clothing item by ID
 * 
 * @param itemId - The ID of the item to retrieve
 * @returns Promise<ClothingItem | null> - The clothing item or null if not found
 */
export async function getClothingItemById(itemId: string): Promise<ClothingItem | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('clothing_items')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          emoji
        ),
        users_profiles (
          id,
          username,
          full_name,
          avatar_url,
          location
        )
      `)
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Error fetching clothing item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getClothingItemById:', error);
    return null;
  }
}

/**
 * Lists clothing items with optional filters
 * 
 * @param filters - Optional filters to apply
 * @returns Promise<ClothingItem[]> - Array of clothing items
 */
export async function listClothingItems(
  filters: ListClothingItemsFilters = {}
): Promise<ClothingItem[]> {
  const supabase = createClient();
  
  try {
    let query = supabase
      .from('clothing_items')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          emoji
        ),
        users_profiles (
          id,
          username,
          full_name,
          avatar_url,
          location
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.category) {
      query = query.eq('categories.slug', filters.category);
    }
    if (filters.size) {
      query = query.eq('size', filters.size);
    }
    if (filters.condition) {
      query = query.eq('condition', filters.condition);
    }
    if (filters.brand) {
      query = query.ilike('brand', `%${filters.brand}%`);
    }
    if (filters.color) {
      query = query.eq('color', filters.color);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.owner_id) {
      query = query.eq('owner_id', filters.owner_id);
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error listing clothing items:', error);
      throw new Error('Failed to list clothing items');
    }

    return data || [];
  } catch (error) {
    console.error('Error in listClothingItems:', error);
    throw error;
  }
}

/**
 * Deletes a clothing item (soft delete by updating status)
 * 
 * @param itemId - The ID of the item to delete
 * @param userId - The ID of the user performing the deletion
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function deleteClothingItem(
  itemId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('clothing_items')
      .update({ 
        status: 'removed',
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .eq('owner_id', userId);

    if (error) {
      console.error('Error deleting clothing item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteClothingItem:', error);
    return false;
  }
}

/**
 * Gets clothing items for a specific user
 * 
 * @param userId - The ID of the user
 * @param status - Optional status filter
 * @returns Promise<ClothingItem[]> - Array of user's clothing items
 */
export async function getUserClothingItems(
  userId: string,
  status?: string
): Promise<ClothingItem[]> {
  const filters: ListClothingItemsFilters = {
    owner_id: userId,
    ...(status && { status })
  };
  
  return listClothingItems(filters);
} 