import { Heart, ShoppingCart, Star, Repeat2, ArrowLeftRight } from 'lucide-react';
import Image from 'next/image';
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

// Helper function to get image URL (can be easily configured)
const getImageUrl = (imageId: string, fallback?: string) => {
  // You can easily replace these URLs with your own hosted images
  const imageMap: { [key: string]: string } = {
    'vintage-tee': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
    'white-tee': 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop&crop=center',
    'graphic-tee': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop&crop=center',
    'retro-tee': 'https://images.unsplash.com/photo-1583743814966-8936f37f4fc3?w=400&h=400&fit=crop&crop=center',
    // Add more as needed...
  };
  
  return imageMap[imageId] || fallback || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center';
};

// Mock products data
const mockProducts = {
  1: [ // T-Shirts
    {
      id: 1,
      name: "Vintage Band Tee",
      price: 25,
      originalPrice: 45,
      image: "vintage-tee", 
      condition: "Excellent",
      size: "M",
      brand: "Vintage",
      likes: 24,
      description: "A classic vintage band tee from the 90s era. Features original concert tour graphics and authentic distressed finish. Perfect for casual wear or layering.",
      seller: "RetroCollector",
      rating: 4.8
    },
    {
      id: 2,
      name: "Plain White Tee",
      price: 15,
      originalPrice: 30,
      image: "white-tee",
      condition: "Good",
      size: "L",
      brand: "Basic",
      likes: 18,
      description: "Essential plain white tee made from 100% organic cotton. Comfortable fit with reinforced seams. Great for everyday wear.",
      seller: "EcoFashion",
      rating: 4.5
    },
    {
      id: 3,
      name: "Graphic Print Tee",
      price: 20,
      originalPrice: 35,
      image: "graphic-tee",
      condition: "Very Good",
      size: "S",
      brand: "Streetwear",
      likes: 32,
      description: "Bold graphic print tee featuring street art inspired design. Limited edition piece with vibrant colors and premium print quality.",
      seller: "UrbanStyle",
      rating: 4.7
    },
    {
      id: 4,
      name: "Retro Logo Tee",
      price: 30,
      originalPrice: 50,
      image: "retro-tee",
      condition: "Excellent",
      size: "XL",
      brand: "Retro",
      likes: 41,
      description: "Authentic retro logo tee from a classic brand. Features vintage-inspired graphics and comfortable oversized fit.",
      seller: "VintageVault",
      rating: 4.9
    }
  ],
  2: [ // Shirts
    {
      id: 5,
      name: "Business Casual Shirt",
      price: 35,
      originalPrice: 60,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "M",
      brand: "Professional",
      likes: 28,
      description: "Professional business casual shirt with modern fit. Perfect for office wear or smart casual occasions.",
      seller: "OfficeWear",
      rating: 4.6
    },
    {
      id: 6,
      name: "Flannel Shirt",
      price: 28,
      originalPrice: 45,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "L",
      brand: "Outdoor",
      likes: 35,
      description: "Cozy flannel shirt perfect for layering. Made from soft cotton blend with classic plaid pattern.",
      seller: "OutdoorGear",
      rating: 4.4
    },
    {
      id: 14,
      name: "Oxford Button Down",
      price: 42,
      originalPrice: 75,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "S",
      brand: "Classic",
      likes: 31,
      description: "Timeless oxford button-down shirt in crisp white. Perfect for both professional and casual settings.",
      seller: "ClassicMen",
      rating: 4.7
    },
    {
      id: 15,
      name: "Denim Shirt",
      price: 33,
      originalPrice: 55,
      image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=400&fit=crop&crop=center",
      condition: "Very Good",
      size: "XL",
      brand: "Casual",
      likes: 26,
      description: "Comfortable denim shirt with modern cut. Great for layering or wearing as a light jacket.",
      seller: "DenimCo",
      rating: 4.3
    }
  ],
  3: [ // Dresses
    {
      id: 7,
      name: "Summer Floral Dress",
      price: 45,
      originalPrice: 80,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "M",
      brand: "Bohemian",
      likes: 56,
      description: "Beautiful summer dress with vibrant floral print. Lightweight fabric perfect for warm weather.",
      seller: "FloralFashion",
      rating: 4.8
    },
    {
      id: 8,
      name: "Little Black Dress",
      price: 55,
      originalPrice: 90,
      image: "https://images.unsplash.com/photo-1566479179817-c0b9b892e8da?w=400&h=400&fit=crop&crop=center",
      condition: "Very Good",
      size: "S",
      brand: "Elegant",
      likes: 73,
      description: "Classic little black dress suitable for any occasion. Timeless design with modern touches.",
      seller: "ClassicStyle",
      rating: 4.9
    },
    {
      id: 16,
      name: "Maxi Dress",
      price: 38,
      originalPrice: 65,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "L",
      brand: "Boho",
      likes: 44,
      description: "Flowing maxi dress with bohemian print. Perfect for beach days or casual summer events.",
      seller: "BohoChic",
      rating: 4.5
    },
    {
      id: 17,
      name: "Cocktail Dress",
      price: 68,
      originalPrice: 120,
      image: "https://images.unsplash.com/photo-1623659333457-2a5bf18bfd46?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "M",
      brand: "Evening",
      likes: 62,
      description: "Elegant cocktail dress perfect for special occasions. Features sophisticated design and premium fabric.",
      seller: "EveningWear",
      rating: 4.8
    }
  ],
  4: [ // Pants
    {
      id: 9,
      name: "Vintage Jeans",
      price: 40,
      originalPrice: 70,
      image: "https://images.unsplash.com/photo-1542272454315-7ad0b7be4813?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "32",
      brand: "Denim Co",
      likes: 42,
      description: "Authentic vintage jeans with classic cut and fading. Perfect for casual everyday wear.",
      seller: "VintageDenim",
      rating: 4.5
    },
    {
      id: 18,
      name: "Skinny Jeans",
      price: 35,
      originalPrice: 60,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop&crop=center",
      condition: "Very Good",
      size: "30",
      brand: "Modern",
      likes: 38,
      description: "Stylish skinny jeans with stretch fabric for comfort. Perfect fit for contemporary fashion.",
      seller: "ModernDenim",
      rating: 4.4
    },
    {
      id: 19,
      name: "Chinos",
      price: 32,
      originalPrice: 55,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "34",
      brand: "Casual",
      likes: 29,
      description: "Classic chino pants in versatile khaki color. Great for both casual and semi-formal occasions.",
      seller: "CasualWear",
      rating: 4.6
    },
    {
      id: 20,
      name: "Dress Trousers",
      price: 48,
      originalPrice: 85,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "36",
      brand: "Formal",
      likes: 33,
      description: "Professional dress trousers with tailored fit. Perfect for office and formal events.",
      seller: "FormalWear",
      rating: 4.7
    }
  ],
  5: [ // Shoes
    {
      id: 10,
      name: "Classic Sneakers",
      price: 60,
      originalPrice: 120,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
      condition: "Very Good",
      size: "9",
      brand: "Sport",
      likes: 67,
      description: "Comfortable classic sneakers in excellent condition. Perfect for daily wear or light exercise.",
      seller: "SneakerHead",
      rating: 4.7
    },
    {
      id: 21,
      name: "Running Shoes",
      price: 55,
      originalPrice: 110,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "10",
      brand: "Athletic",
      likes: 52,
      description: "High-performance running shoes with excellent cushioning. Great for jogging and gym workouts.",
      seller: "SportGear",
      rating: 4.5
    },
    {
      id: 22,
      name: "Dress Shoes",
      price: 75,
      originalPrice: 150,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "8",
      brand: "Formal",
      likes: 41,
      description: "Premium leather dress shoes for formal occasions. Classic design with modern comfort features.",
      seller: "FormalShoes",
      rating: 4.8
    },
    {
      id: 23,
      name: "Canvas Sneakers",
      price: 28,
      originalPrice: 50,
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "11",
      brand: "Casual",
      likes: 36,
      description: "Comfortable canvas sneakers perfect for casual wear. Classic style that goes with everything.",
      seller: "CasualKicks",
      rating: 4.3
    }
  ],
  6: [ // Bags
    {
      id: 11,
      name: "Leather Handbag",
      price: 75,
      originalPrice: 150,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "One Size",
      brand: "Luxury",
      likes: 84,
      description: "Premium leather handbag with multiple compartments. Elegant design suitable for any occasion.",
      seller: "LuxuryBags",
      rating: 4.9
    },
    {
      id: 24,
      name: "Canvas Backpack",
      price: 35,
      originalPrice: 65,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
      condition: "Very Good",
      size: "One Size",
      brand: "Outdoor",
      likes: 47,
      description: "Durable canvas backpack perfect for daily use. Multiple pockets and comfortable straps.",
      seller: "OutdoorGear",
      rating: 4.4
    },
    {
      id: 25,
      name: "Crossbody Bag",
      price: 42,
      originalPrice: 80,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "One Size",
      brand: "Trendy",
      likes: 58,
      description: "Stylish crossbody bag perfect for hands-free convenience. Compact yet spacious design.",
      seller: "TrendyBags",
      rating: 4.6
    },
    {
      id: 26,
      name: "Laptop Bag",
      price: 68,
      originalPrice: 120,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "15 inch",
      brand: "Professional",
      likes: 39,
      description: "Professional laptop bag with padded compartments. Perfect for work and business travel.",
      seller: "TechBags",
      rating: 4.5
    }
  ],
  7: [ // Hoodies
    {
      id: 12,
      name: "Cozy Hoodie",
      price: 35,
      originalPrice: 65,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "L",
      brand: "Comfort",
      likes: 29,
      description: "Super soft and comfortable hoodie perfect for lounging or casual outings. Warm and cozy fit.",
      seller: "ComfortWear",
      rating: 4.3
    },
    {
      id: 27,
      name: "Zip-Up Hoodie",
      price: 42,
      originalPrice: 75,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "M",
      brand: "Athletic",
      likes: 34,
      description: "Versatile zip-up hoodie perfect for layering. Great for workouts or casual wear.",
      seller: "ActiveWear",
      rating: 4.5
    },
    {
      id: 28,
      name: "Oversized Hoodie",
      price: 38,
      originalPrice: 70,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop&crop=center",
      condition: "Very Good",
      size: "XL",
      brand: "Streetwear",
      likes: 46,
      description: "Trendy oversized hoodie with street style aesthetics. Perfect for a relaxed, fashionable look.",
      seller: "StreetStyle",
      rating: 4.4
    },
    {
      id: 29,
      name: "Pullover Hoodie",
      price: 33,
      originalPrice: 60,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "S",
      brand: "Basic",
      likes: 27,
      description: "Classic pullover hoodie in neutral color. Essential piece for any casual wardrobe.",
      seller: "BasicWear",
      rating: 4.2
    }
  ],
  8: [ // Accessories
    {
      id: 13,
      name: "Designer Sunglasses",
      price: 45,
      originalPrice: 120,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "One Size",
      brand: "Designer",
      likes: 38,
      description: "Stylish designer sunglasses with UV protection. Classic frame design that never goes out of style.",
      seller: "AccessoryPro",
      rating: 4.6
    },
    {
      id: 30,
      name: "Leather Belt",
      price: 28,
      originalPrice: 55,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
      condition: "Very Good",
      size: "34 inch",
      brand: "Classic",
      likes: 22,
      description: "Genuine leather belt with classic buckle. Perfect for both casual and formal outfits.",
      seller: "LeatherGoods",
      rating: 4.4
    },
    {
      id: 31,
      name: "Wool Scarf",
      price: 32,
      originalPrice: 60,
      image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop&crop=center",
      condition: "Excellent",
      size: "One Size",
      brand: "Winter",
      likes: 31,
      description: "Soft wool scarf perfect for cold weather. Elegant pattern and luxurious feel.",
      seller: "WinterWear",
      rating: 4.7
    },
    {
      id: 32,
      name: "Watch",
      price: 85,
      originalPrice: 180,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop&crop=center",
      condition: "Good",
      size: "One Size",
      brand: "Timepiece",
      likes: 56,
      description: "Stylish analog watch with leather strap. Perfect accessory for any professional outfit.",
      seller: "TimeKeeper",
      rating: 4.8
    }
  ]
};

interface ProductsSectionProps {
  selectedCategory: number;
}

export default function ProductsSection({ selectedCategory }: ProductsSectionProps) {
  const products = mockProducts[selectedCategory as keyof typeof mockProducts] || [];
  
  const getCategoryName = (id: number) => {
    const names = {
      1: 'T-Shirts',
      2: 'Shirts',
      3: 'Dresses',
      4: 'Pants',
      5: 'Shoes',
      6: 'Bags',
      7: 'Hoodies',
      8: 'Accessories'
    };
    return names[id as keyof typeof names] || 'Products';
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-16 h-16 bg-black/5 rounded-full blur-xl animate-bounce" style={{animationDuration: '7s'}}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-black/8 rounded-full blur-lg animate-bounce" style={{animationDuration: '9s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Featured {getCategoryName(selectedCategory)}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover sustainable fashion pieces from our curated collection
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[600px] auto-rows-fr relative">
            <div className="contents">
              {products.map((product) => (
              <MorphingDialog
                key={product.id}
                id={`product-${product.id}`}
                transition={{
                  type: 'spring',
                  bounce: 0.05,
                  duration: 0.25,
                }}
              >
                <MorphingDialogTrigger
                  style={{
                    borderRadius: '16px',
                  }}
                  className="flex flex-col overflow-hidden border border-gray-200 bg-white hover:border-gray-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative h-fit will-change-transform"
                >
                  <div className="relative">
                    <MorphingDialogImage
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="h-48 w-full relative"
                    />
                    
                    {/* Condition badge - positioned relative to image container */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                        {product.condition}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <MorphingDialogTitle className="font-semibold text-lg text-black">
                        {product.name}
                      </MorphingDialogTitle>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{product.likes}</span>
                      </div>
                    </div>
                    
                    <MorphingDialogSubtitle className="text-gray-600 mb-2">
                      {product.brand} • Size {product.size}
                    </MorphingDialogSubtitle>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl font-bold text-black">${product.price}</span>
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    </div>
                  </div>
                </MorphingDialogTrigger>

                <MorphingDialogContainer>
                  <MorphingDialogContent
                    style={{
                      borderRadius: '24px',
                    }}
                    className="pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-gray-200 bg-white sm:w-[800px] max-h-[90vh] overflow-y-auto"
                  >
                    {/* Close Button */}
                    <MorphingDialogClose />
                    
                    {/* Main Content Layout */}
                    <div className="flex flex-col lg:flex-row min-h-[600px]">
                      {/* Left Side - Large Product Image */}
                      <div className="lg:w-1/2 relative">
                        <MorphingDialogImage
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="h-80 lg:h-full w-full relative"
                        />
                      </div>
                      
                      {/* Right Side - Product Details */}
                      <div className="lg:w-1/2 p-6 flex flex-col justify-between">
                        <div>
                          <MorphingDialogTitle className="text-3xl font-bold text-black mb-2">
                            {product.name}
                          </MorphingDialogTitle>
                          
                          <MorphingDialogSubtitle className="text-gray-600 text-lg mb-4">
                            {product.brand} • Size {product.size}
                          </MorphingDialogSubtitle>
                          
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="text-4xl font-bold text-black">${product.price}</span>
                            <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center space-x-1">
                              <Star className="h-5 w-5 text-yellow-500 fill-current" />
                              <span className="text-lg font-medium">{product.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-5 w-5 text-red-500" />
                              <span className="text-gray-600">{product.likes} likes</span>
                            </div>
                          </div>

                          <MorphingDialogDescription
                            disableLayoutAnimation
                            variants={{
                              initial: { opacity: 0, y: 20 },
                              animate: { opacity: 1, y: 0 },
                              exit: { opacity: 0, y: 20 },
                            }}
                            className="mb-6"
                          >
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-semibold text-black block">Condition</span>
                                  <span className="text-gray-600">{product.condition}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-black block">Size</span>
                                  <span className="text-gray-600">{product.size}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-black block">Brand</span>
                                  <span className="text-gray-600">{product.brand}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-black block">Seller</span>
                                  <span className="text-gray-600">{product.seller}</span>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-black mb-2">Description</h4>
                                <p className="text-gray-700 leading-relaxed">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </MorphingDialogDescription>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-auto">
                          <button className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-2">
                            <Repeat2 className="h-5 w-5" />
                            <span>Swap</span>
                          </button>
                          <button className="flex-1 bg-white text-black border-2 border-black px-6 py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2">
                            <ArrowLeftRight className="h-5 w-5" />
                            <span>Exchange</span>
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
                            src={getImageUrl(product.image)} 
                            alt={`${product.name} - Main`}
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
            <p className="text-gray-500 text-lg">No products available for this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
