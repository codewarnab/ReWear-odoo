"use client";

import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { itemVariants } from "@/lib/animations";

interface TermsAndConditionsProps {
    form: UseFormReturn<any>;
}

export function TermsAndConditions({ form }: TermsAndConditionsProps) {
    return (
        <motion.div variants={itemVariants}>
            <FormField
                control={form.control}
                name="agreedToTerms"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I agree to the terms and conditions *
                            </Label>
                            <FormDescription>
                                By listing this item, you agree to our{" "}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:underline"
                                    onClick={() => window.open("/terms", "_blank")}
                                >
                                    Terms of Service
                                </button>{" "}
                                and{" "}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:underline"
                                    onClick={() => window.open("/privacy", "_blank")}
                                >
                                    Privacy Policy
                                </button>
                            </FormDescription>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
        </motion.div>
    );
} 