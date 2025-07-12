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
import { useState } from 'react';
import ProductsSection from './ProductsSection';

const categories = [
  {
    id: 1,
    name: 'T-Shirts',
    icon: FaTshirt,
    description: 'Casual & trendy tees',
    count: '250+ items'
  },
  {
    id: 2,
    name: 'Shirts',
    icon: GiShirt,
    description: 'Formal & casual shirts',
    count: '180+ items'
  },
  {
    id: 3,
    name: 'Dresses',
    icon: GiDress,
    description: 'Elegant & casual dresses',
    count: '320+ items'
  },
  {
    id: 4,
    name: 'Pants',
    icon: GiTrousers,
    description: 'Jeans, trousers & more',
    count: '200+ items'
  },
  {
    id: 5,
    name: 'Shoes',
    icon: GiSonicShoes,
    description: 'Sneakers, heels & boots',
    count: '150+ items'
  },
  {
    id: 6,
    name: 'Bags',
    icon: GiHandBag,
    description: 'Handbags & backpacks',
    count: '90+ items'
  },
  {
    id: 7,
    name: 'Hoodies',
    icon: GiHoodie,
    description: 'Cozy hoodies & sweaters',
    count: '120+ items'
  },
  {
    id: 8,
    name: 'Accessories',
    icon: GiSunglasses,
    description: 'Watches, belts & more',
    count: '80+ items'
  }
];

export default function CategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState(1);

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
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
                    {category.description}
                  </p>
                  <p className={`font-medium text-sm transition-all duration-300 ${
                    selectedCategory === category.id 
                      ? 'text-white font-semibold' 
                      : 'text-black group-hover:font-semibold'
                  }`}>
                    {category.count}
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
      </div>
      
      {/* Products Section */}
      <ProductsSection selectedCategory={selectedCategory} />
    </section>
  );
}
