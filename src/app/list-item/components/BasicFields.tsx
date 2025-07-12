"use client";

import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { itemVariants } from "@/lib/animations";

interface BasicFieldsProps {
    form: UseFormReturn<any>;
}

export function BasicFields({ form }: BasicFieldsProps) {
    return (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            {/* Title Field */}
            <motion.div variants={itemVariants}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Title *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g., Vintage Floral Summer Dress"
                                    {...field}
                                    className="bg-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:shadow-lg"
                                />
                            </FormControl>
                            <FormDescription>
                                Give your item a catchy, descriptive title
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </motion.div>

            {/* Description Field */}
            <motion.div variants={itemVariants}>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell others about your item - its story, fit, material, etc."
                                    className="min-h-[120px] bg-white shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:shadow-lg"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                {field.value?.length || 0}/500 characters
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </motion.div>
        </div>
    );
} 