"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
    listingSchema,
    ListingFormData,
    getCategoryEmoji,
    getRandomBgColor,
} from "@/lib/validations/listing";
import { containerVariants } from "@/lib/animations";
import { toast } from "sonner";

// Import the new components
import { BasicFields } from "./BasicFields";
import { ImageUpload } from "./ImageUpload";
import { ItemDetails } from "./ItemDetails";
import { LocationField } from "./LocationField";
import { TermsAndConditions } from "./TermsAndConditions";
import { FormActions } from "./FormActions";

interface ListingFormProps {
    onSubmit?: (data: ListingFormData) => void;
    isLoading?: boolean;
}

export default function ListingForm({ onSubmit, isLoading = false }: ListingFormProps) {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            title: "",
            description: "",
            images: [],
            isAvailable: true,
            agreedToTerms: false,
        },
    });

    // Watch for category changes and clear size field
    const selectedCategory = form.watch("category");
    useEffect(() => {
        if (selectedCategory) {
            // Clear the size field when category changes
            form.setValue("size", "");
        }
    }, [selectedCategory, form]);

    const handleSubmit = async (data: ListingFormData) => {
        try {
            // Add generated fields
            const itemData = {
                ...data,
                id: Date.now().toString(),
                emoji: getCategoryEmoji(data.category),
                bgColor: getRandomBgColor(),
                status: 'Listed' as const,
                listedDate: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
            };

            if (onSubmit) {
                onSubmit(data);
            } else {
                // Default behavior - show success and redirect
                toast.success("Item listed successfully!", {
                    description: "Your item has been added to the marketplace.",
                    icon: <Check className="h-4 w-4" />
                });
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("Failed to list item", {
                description: "Please try again later.",
                icon: <AlertCircle className="h-4 w-4" />
            });
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
        >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="">
                    <p className="text-center text-gray-600">
                        Fill in the details below to list your item on the marketplace
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <BasicFields form={form} />
                                    <ImageUpload form={form} />
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <ItemDetails form={form} />
                                    <LocationField form={form} />
                                    <TermsAndConditions form={form} />
                                    <FormActions isLoading={isLoading} onCancel={handleCancel} />
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>
    );
} 