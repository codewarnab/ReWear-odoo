"use client";

import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    CATEGORIES, 
    CONDITIONS, 
    getCategoryEmoji, 
    getSizesForCategory, 
    getSizeLabelForCategory 
} from "@/lib/validations/listing";
import { itemVariants } from "@/lib/animations";

interface ItemDetailsProps {
    form: UseFormReturn<any>;
}

export function ItemDetails({ form }: ItemDetailsProps) {
    return (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Item Details</h3>
            
            {/* Category, Size and Condition - Side by Side */}
            <div className="grid grid-cols-3 gap-4">
                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="shadow-lg">
                                        {CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                <div className="flex items-center gap-2">
                                                    <span>{getCategoryEmoji(category)}</span>
                                                    <span>{category}</span>
                                                </div>
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
                        name="size"
                        render={({ field }) => {
                            const selectedCategory = form.watch("category");
                            const availableSizes = selectedCategory ? getSizesForCategory(selectedCategory) : [];
                            const sizeLabel = selectedCategory ? getSizeLabelForCategory(selectedCategory) : "Size";
                            
                            return (
                                <FormItem>
                                    <FormLabel>{sizeLabel} *</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                        disabled={!selectedCategory}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 disabled:shadow-sm">
                                                <SelectValue 
                                                    placeholder={selectedCategory ? `Select ${sizeLabel.toLowerCase()}` : "Select category first"} 
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="shadow-lg">
                                            {availableSizes.map((size) => (
                                                <SelectItem key={size} value={size}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Condition *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="shadow-lg">
                                        {CONDITIONS.map((condition) => (
                                            <SelectItem key={condition} value={condition}>
                                                {condition}
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