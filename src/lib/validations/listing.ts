import { z } from "zod";
import { getCategories, getCategoryEmoji as getDbCategoryEmoji } from "@/lib/supabase/categories";

// Fallback categories for schema validation (updated to match database)
export const DEFAULT_CATEGORIES = [
  "tops",
  "bottoms", 
  "outerwear",
  "dresses",
  "footwear", // Updated from "Shoes" to match database
  "accessories"
] as const;

// Category-specific sizing systems
export const CLOTHING_SIZES = [
  "XS",
  "S", 
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL"
] as const;

export const SHOE_SIZES = [
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "12.5",
  "13",
  "13.5",
  "14"
] as const;

export const NUMERIC_SIZES = [
  "0",
  "2",
  "4",
  "6", 
  "8",
  "10",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24"
] as const;

export const JEWELRY_SIZES = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13"
] as const;

export const ACCESSORY_SIZES = [
  "One Size",
  "Small",
  "Medium",
  "Large"
] as const;

export const NO_SIZE = [
  "One Size"
] as const;

// All possible sizes (union of all size arrays)
export const ALL_SIZES = [
  ...CLOTHING_SIZES,
  ...SHOE_SIZES,
  ...NUMERIC_SIZES,
  ...JEWELRY_SIZES,
  ...ACCESSORY_SIZES,
  ...NO_SIZE
] as const;

// Map categories to their appropriate size arrays (updated to match database)
export const CATEGORY_SIZE_MAP: Record<string, readonly string[]> = {
  "tops": CLOTHING_SIZES,
  "bottoms": NUMERIC_SIZES,
  "outerwear": CLOTHING_SIZES,
  "dresses": CLOTHING_SIZES,
  "footwear": SHOE_SIZES,
  "accessories": ACCESSORY_SIZES,
  // Legacy mappings for backward compatibility
  "Tops": CLOTHING_SIZES,
  "Bottoms": NUMERIC_SIZES,
  "Outerwear": CLOTHING_SIZES,
  "Dresses": CLOTHING_SIZES,
  "Footwear": SHOE_SIZES,
  "Accessories": ACCESSORY_SIZES,
  "Shoes": SHOE_SIZES,
  "Bags": NO_SIZE,
  "Jewelry": JEWELRY_SIZES,
  "Activewear": CLOTHING_SIZES,
  "Formal Wear": CLOTHING_SIZES,
  "Casual Wear": CLOTHING_SIZES,
  "Vintage": CLOTHING_SIZES,
  "Other": ACCESSORY_SIZES
};

// Helper function to get available sizes for a category
export const getSizesForCategory = (category: string): readonly string[] => {
  return CATEGORY_SIZE_MAP[category] || ACCESSORY_SIZES;
};

// Helper function to get size label for a category
export const getSizeLabelForCategory = (category: string): string => {
  const sizeLabels: Record<string, string> = {
    "footwear": "Shoe Size",
    "accessories": "Size",
    "bottoms": "Size (Numeric)",
    "tops": "Size",
    "dresses": "Size",
    "outerwear": "Size",
    // Legacy mappings for backward compatibility
    "Footwear": "Shoe Size",
    "Shoes": "Shoe Size",
    "Jewelry": "Ring Size",
    "Bags": "Size",
    "Accessories": "Size",
    "Bottoms": "Size (Numeric)",
    "Tops": "Size",
    "Dresses": "Size",
    "Outerwear": "Size",
    "Activewear": "Size",
    "Formal Wear": "Size",
    "Casual Wear": "Size",
    "Vintage": "Size",
    "Other": "Size"
  };
  
  return sizeLabels[category] || "Size";
};

export const CONDITIONS = [
  "New with tags",
  "Like new",
  "Excellent", 
  "Good",
  "Fair",
  "Poor"
] as const;

// Exchange preference options
export const EXCHANGE_PREFERENCES = [
  "swap_only",
  "points_only", 
  "both"
] as const;

// Basic schema with fallback categories
export const listingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters")
    .regex(/^[a-zA-Z0-9\s\-.,!?']+$/, "Title contains invalid characters"),
  
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  
  category: z
    .string()
    .min(1, "Please select a category"),
  
  size: z
    .string()
    .min(1, "Please select a size"),
  
  condition: z
    .enum(CONDITIONS, {
      message: "Please select a valid condition"
    }),
  
  brand: z
    .string()
    .max(50, "Brand name cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  
  color: z
    .string()
    .max(30, "Color cannot exceed 30 characters")
    .optional()
    .or(z.literal("")),
  
  material: z
    .string()
    .max(50, "Material cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  
  tags: z
    .array(z.string().max(20, "Tag cannot exceed 20 characters"))
    .max(10, "You can add up to 10 tags")
    .optional(),
  
  images: z
    .array(z.any()) // Accept File objects from the form
    .max(5, "You can upload up to 5 images")
    .optional(),
  
  pointsValue: z
    .number()
    .min(0, "Points value must be positive")
    .max(10000, "Points value cannot exceed 10,000")
    .optional(),
  
  exchangePreference: z
    .enum(EXCHANGE_PREFERENCES, {
      message: "Please select a valid exchange preference"
    })
    .optional()
    .default("both"),
  
  location: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }).optional(),
  
  isAvailable: z.boolean().default(true),
  
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms and conditions"
    })
});

// Dynamic schema creation function with database categories
export async function createListingSchema() {
  const categories = await getCategories();
  const categoryNames = categories.map(cat => cat.name);
  
  return listingSchema.extend({
    category: z
      .enum(categoryNames as [string, ...string[]], {
        message: "Please select a valid category"
      })
  }).refine((data) => {
    // Validate that the size is valid for the selected category
    const availableSizes = getSizesForCategory(data.category);
    return availableSizes.includes(data.size);
  }, {
    message: "Please select a valid size for the selected category",
    path: ["size"]
  });
}

// Validation function that works with database categories
export async function validateListingData(data: any) {
  const schema = await createListingSchema();
  return schema.parse(data);
}

export type ListingFormData = z.infer<typeof listingSchema>;

// Helper function to get category emoji (now uses database)
export const getCategoryEmoji = async (category: string): Promise<string> => {
  try {
    return await getDbCategoryEmoji(category);
  } catch (error) {
    console.error('Error fetching category emoji:', error);
    // Fallback to hardcoded mapping
    const fallbackEmojiMap: Record<string, string> = {
      "Tops": "👕",
      "Bottoms": "👖",
      "Outerwear": "🧥",
      "Dresses": "👗",
      "Footwear": "👟",
      "Accessories": "👜",
      // Legacy mappings
      "Shoes": "👟",
      "Bags": "🎒",
      "Jewelry": "💍",
      "Activewear": "🏃",
      "Formal Wear": "👔",
      "Casual Wear": "👕",
      "Vintage": "🕰️",
      "Other": "📦"
    };
    
    return fallbackEmojiMap[category] || "📦";
  }
};

// Synchronous version for backward compatibility
export const getCategoryEmojiSync = (category: string): string => {
  const fallbackEmojiMap: Record<string, string> = {
    "Tops": "👕",
    "Bottoms": "👖",
    "Outerwear": "🧥",
    "Dresses": "👗",
    "Footwear": "👟",
    "Accessories": "👜",
    // Legacy mappings
    "Shoes": "👟",
    "Bags": "🎒",
    "Jewelry": "💍",
    "Activewear": "🏃",
    "Formal Wear": "👔",
    "Casual Wear": "👕",
    "Vintage": "🕰️",
    "Other": "📦"
  };
  
  return fallbackEmojiMap[category] || "📦";
};

// Helper function to get random background color
export const getRandomBgColor = (): string => {
  const colors = [
    "bg-yellow-100",
    "bg-blue-100", 
    "bg-green-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-red-100",
    "bg-orange-100",
    "bg-teal-100",
    "bg-gray-100"
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}; 