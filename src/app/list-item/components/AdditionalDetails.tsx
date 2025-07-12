"use client";

import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { itemVariants } from "@/lib/animations";

interface AdditionalDetailsProps {
    form: UseFormReturn<any>;
}

// Define some common options for each field
const BRANDS = [
    "Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Gap", "Levi's", "Tommy Hilfiger", 
    "Calvin Klein", "Ralph Lauren", "Hugo Boss", "Armani", "Gucci", "Prada", 
    "Louis Vuitton", "Chanel", "Burberry", "Other"
];

const COLORS = [
    "Black", "White", "Gray", "Navy", "Blue", "Red", "Green", "Yellow", 
    "Orange", "Purple", "Pink", "Brown", "Beige", "Khaki", "Maroon", 
    "Turquoise", "Olive", "Multicolor", "Other"
];

const MATERIALS = [
    "Cotton", "Polyester", "Wool", "Silk", "Linen", "Denim", "Leather", 
    "Synthetic", "Blend", "Cashmere", "Viscose", "Nylon", "Spandex", 
    "Rayon", "Acrylic", "Other"
];

export function AdditionalDetails({ form }: AdditionalDetailsProps) {
    return (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Additional Details</h3>
            
            {/* Brand, Color and Material - Side by Side */}
            <div className="grid grid-cols-3 gap-4">
                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                                            <SelectValue placeholder="Select brand" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="shadow-lg">
                                        {BRANDS.map((brand) => (
                                            <SelectItem key={brand} value={brand}>
                                                {brand}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                                            <SelectValue placeholder="Select color" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="shadow-lg">
                                        {COLORS.map((color) => (
                                            <SelectItem key={color} value={color}>
                                                {color}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="material"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Material</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                                            <SelectValue placeholder="Select material" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="shadow-lg">
                                        {MATERIALS.map((material) => (
                                            <SelectItem key={material} value={material}>
                                                {material}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </motion.div>
            </div>
        </div>
    );
} 