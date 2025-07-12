"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { itemVariants, buttonHoverProps } from "@/lib/animations";

interface FormActionsProps {
    isLoading: boolean;
    onCancel: () => void;
}

export function FormActions({ isLoading, onCancel }: FormActionsProps) {
    return (
        <motion.div variants={itemVariants} className="pt-4">
            <div className="flex flex-col gap-3">
                <motion.div {...buttonHoverProps}>
                    <Button
                        type="submit"
                        className="w-full shadow-md hover:shadow-lg transition-shadow duration-200"
                        disabled={isLoading}
                        size="lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Listing...
                            </>
                        ) : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                List Item
                            </>
                        )}
                    </Button>
                </motion.div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    Cancel
                </Button>
            </div>
        </motion.div>
    );
} 