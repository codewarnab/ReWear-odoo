import { z } from "zod";

// Define the categories, sizes, and conditions as constants
export const CATEGORIES = [
  "Dresses",
  "Tops",
  "Bottoms",
  "Outerwear",
  "Shoes",
  "Accessories",
  "Bags",
  "Jewelry",
  "Activewear",
  "Formal Wear",
  "Casual Wear",
  "Vintage",
  "Other"
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

// Map categories to their appropriate size arrays
export const CATEGORY_SIZE_MAP: Record<string, readonly string[]> = {
  "Dresses": CLOTHING_SIZES,
  "Tops": CLOTHING_SIZES,
  "Bottoms": NUMERIC_SIZES,
  "Outerwear": CLOTHING_SIZES,
  "Shoes": SHOE_SIZES,
  "Accessories": ACCESSORY_SIZES,
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
    "Shoes": "Shoe Size",
    "Jewelry": "Ring Size",
    "Bags": "Size",
    "Accessories": "Size",
    "Bottoms": "Size (Numeric)",
    "Dresses": "Size",
    "Tops": "Size",
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

// Create the validation schema with dynamic size validation
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
    .enum(CATEGORIES, {
      message: "Please select a valid category"
    }),
  
  size: z
    .string()
    .min(1, "Please select a size"),
  
  condition: z
    .enum(CONDITIONS, {
      message: "Please select a valid condition"
    }),
  
  images: z
    .array(z.string().url("Invalid image URL"))
    .max(5, "You can upload up to 5 images")
    .optional(),
  
  location: z.object({
    address: z.string().min(1, "Address is required"),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  
  isAvailable: z.boolean().default(true),
  
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms and conditions"
    })
}).refine((data) => {
  // Validate that the size is valid for the selected category
  const availableSizes = getSizesForCategory(data.category);
  return availableSizes.includes(data.size);
}, {
  message: "Please select a valid size for the selected category",
  path: ["size"]
});

export type ListingFormData = z.infer<typeof listingSchema>;

// Helper function to get category emoji
export const getCategoryEmoji = (category: string): string => {
  const categoryEmojiMap: Record<string, string> = {
    "Dresses": "👗",
    "Tops": "👕", 
    "Bottoms": "👖",
    "Outerwear": "🧥",
    "Shoes": "👟",
    "Accessories": "👜",
    "Bags": "🎒",
    "Jewelry": "💍",
    "Activewear": "🏃",
    "Formal Wear": "👔",
    "Casual Wear": "👕",
    "Vintage": "🕰️",
    "Other": "📦"
  };
  
  return categoryEmojiMap[category] || "📦";
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