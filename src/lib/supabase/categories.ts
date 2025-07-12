import { createClient } from './client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  emoji: string;
  sort_order: number;
}

/**
 * Fetch all categories from the database
 * @returns Promise<Category[]> - Array of categories sorted by sort_order
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    throw error;
  }
}

/**
 * Get category by slug
 * @param slug - Category slug
 * @returns Promise<Category | null> - Category object or null if not found
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    return null;
  }
}

/**
 * Get category names for use in validation schemas
 * @returns Promise<string[]> - Array of category names
 */
export async function getCategoryNames(): Promise<string[]> {
  const categories = await getCategories();
  return categories.map(category => category.name);
}

/**
 * Get category emoji by name
 * @param categoryName - Category name
 * @returns Promise<string> - Category emoji or default emoji
 */
export async function getCategoryEmoji(categoryName: string): Promise<string> {
  const categories = await getCategories();
  const category = categories.find(cat => cat.name === categoryName);
  return category?.emoji || '📦';
} 