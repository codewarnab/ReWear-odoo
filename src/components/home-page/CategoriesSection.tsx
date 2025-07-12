'use client';

import { 
  GiShirt, 
  GiTrousers, 
  GiDress, 
  GiSonicShoes, 
  GiHandBag, 
  GiSunglasses,
  GiHoodie,
  GiBelt
} from 'react-icons/gi';
import { FaTshirt, FaUserTie } from 'react-icons/fa';
import { PiCoatHangerBold } from 'react-icons/pi';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/supabase';
import ProductsSection from './ProductsSection';

// Type for category with item count
type CategoryWithCount = Tables<'categories'> & {
  item_count: number;
};

// Icon mapping for categories
const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: any } = {
    't-shirts': FaTshirt,
    'tshirts': FaTshirt,
    'shirts': GiShirt,
    'dresses': GiDress,
    'pants': GiTrousers,
    'jeans': GiTrousers,
    'trousers': GiTrousers,
    'shoes': GiSonicShoes,
    'sneakers': GiSonicShoes,
    'boots': GiSonicShoes,
    'bags': GiHandBag,
    'handbags': GiHandBag,
    'backpacks': GiHandBag,
    'hoodies': GiHoodie,
    'sweaters': GiHoodie,
    'jackets': GiHoodie,
    'accessories': GiSunglasses,
    'belts': GiBelt,
    'watches': GiSunglasses,
    'formal': FaUserTie,
  };
  
  const key = categoryName.toLowerCase().replace(/\s+/g, '-');
  return iconMap[key] || PiCoatHangerBold;
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Fetch categories with item counts
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return;
      }

      // Fetch item counts for each category
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('clothing_items')
            .select('id')
            .eq('category_id', category.id)
            .eq('approval_status', 'approved')
            .eq('status', 'listed');

          if (itemsError) {
            console.error(`Error fetching items for category ${category.id}:`, itemsError);
            return { ...category, item_count: 0 };
          }

          return { ...category, item_count: itemsData?.length || 0 };
        })
      );

      setCategories(categoriesWithCounts);
      
      // Don't auto-select any category initially - show all products
      // Users can click on categories to filter
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
              Shop by Category
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Loading categories...
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="h-20 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-black/5 rounded-full blur-xl animate-bounce" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-black/8 rounded-full blur-lg animate-bounce" style={{animationDuration: '6s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-black/4 rounded-full blur-2xl animate-bounce" style={{animationDuration: '10s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Shop by Category
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover sustainable fashion across all your favorite clothing categories
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* All Items Option */}
            <div
              onClick={() => setSelectedCategory(null)}
              className={`group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-3 border overflow-hidden ${
                selectedCategory === null 
                  ? 'bg-black text-white border-black scale-105' 
                  : 'bg-white border-gray-200 hover:border-black'
              }`}
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              {/* Floating micro animations */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-black/10 rounded-full animate-ping group-hover:animate-bounce"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-black/20 rounded-full animate-pulse group-hover:animate-ping"></div>

              {/* Icon Container */}
              <div className="relative flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className={`rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3 ${
                  selectedCategory === null 
                    ? 'bg-white' 
                    : 'bg-black group-hover:bg-gray-800'
                }`}>
                  <PiCoatHangerBold className={`h-8 w-8 group-hover:scale-110 transition-transform duration-300 ${
                    selectedCategory === null 
                      ? 'text-black' 
                      : 'text-white'
                  }`} />
                </div>
              </div>

              {/* Category Info */}
              <div className="text-center relative z-10">
                <h3 className={`font-semibold text-lg mb-2 transition-colors duration-300 group-hover:scale-105 transform ${
                  selectedCategory === null 
                    ? 'text-white' 
                    : 'text-black group-hover:text-gray-800'
                }`}>
                  All Items
                </h3>
                <p className={`text-sm mb-3 transition-colors duration-300 ${
                  selectedCategory === null 
                    ? 'text-gray-300' 
                    : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  Browse everything available
                </p>
                <p className={`font-medium text-sm transition-all duration-300 ${
                  selectedCategory === null 
                    ? 'text-white font-semibold' 
                    : 'text-black group-hover:font-semibold'
                }`}>
                  View all
                </p>
              </div>

              {/* Animated hover indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 transform transition-transform duration-300 origin-left ${
                selectedCategory === null 
                  ? 'bg-white scale-x-100' 
                  : 'bg-black scale-x-0 group-hover:scale-x-100'
              }`}></div>
              
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </div>

            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-3 border overflow-hidden ${
                    selectedCategory === category.id 
                      ? 'bg-black text-white border-black scale-105' 
                      : 'bg-white border-gray-200 hover:border-black'
                  }`}
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  {/* Floating micro animations */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-black/10 rounded-full animate-ping group-hover:animate-bounce"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-black/20 rounded-full animate-pulse group-hover:animate-ping"></div>

                  {/* Icon Container */}
                  <div className="relative flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className={`rounded-2xl p-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3 ${
                      selectedCategory === category.id 
                        ? 'bg-white' 
                        : 'bg-black group-hover:bg-gray-800'
                    }`}>
                      <IconComponent className={`h-8 w-8 group-hover:scale-110 transition-transform duration-300 ${
                        selectedCategory === category.id 
                          ? 'text-black' 
                          : 'text-white'
                      }`} />
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="text-center relative z-10">
                    <h3 className={`font-semibold text-lg mb-2 transition-colors duration-300 group-hover:scale-105 transform ${
                      selectedCategory === category.id 
                        ? 'text-white' 
                        : 'text-black group-hover:text-gray-800'
                    }`}>
                      {category.name}
                    </h3>
                    <p className={`text-sm mb-3 transition-colors duration-300 ${
                      selectedCategory === category.id 
                        ? 'text-gray-300' 
                        : 'text-gray-600 group-hover:text-gray-700'
                    }`}>
                      {category.description || 'Quality items available'}
                    </p>
                    <p className={`font-medium text-sm transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'text-white font-semibold' 
                        : 'text-black group-hover:font-semibold'
                    }`}>
                      {category.item_count} {category.item_count === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {/* Animated hover indicator */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 transform transition-transform duration-300 origin-left ${
                    selectedCategory === category.id 
                      ? 'bg-white scale-x-100' 
                      : 'bg-black scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                  
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Products Section - Always shown, with optional category filtering */}
      <ProductsSection selectedCategoryId={selectedCategory} />
    </section>
  );
}
