"use client";

import { useEffect, useState } from "react";
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
    getCategoryEmojiSync,
    getRandomBgColor,
    validateListingData,
} from "@/lib/validations/listing";
import { containerVariants } from "@/lib/animations";
import { toast } from "sonner";
import { useSession } from "@/contexts/SessionContext";
import { createClothingItem, CreateClothingItemInput } from "@/lib/supabase/clothingItems";

// Import the new components
import { BasicFields } from "./BasicFields";
import { ImageUpload } from "./ImageUpload";
import { ItemDetails } from "./ItemDetails";
import { AdditionalDetails } from "./AdditionalDetails";
import { LocationField } from "./LocationField";
import { TermsAndConditions } from "./TermsAndConditions";
import { FormActions } from "./FormActions";

interface ListingFormProps {
    onSubmit?: (data: ListingFormData) => void;
    isLoading?: boolean;
}

export default function ListingForm({ onSubmit, isLoading: externalLoading = false }: ListingFormProps) {
    const router = useRouter();
    const { user, userProfile, isLoading: sessionLoading, isAuthenticated, error: sessionError } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState(false);

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

    // Add timeout for loading state
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        if (sessionLoading) {
            timeoutId = setTimeout(() => {
                console.log('⏰ Session loading taking too long, showing timeout message');
                setLoadingTimeout(true);
            }, 8000); // 8 second timeout
        } else {
            setLoadingTimeout(false);
        }
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [sessionLoading]);

    // Check if user is authenticated
    useEffect(() => {
        console.log('Auth check:', { sessionLoading, isAuthenticated, user: !!user, sessionError });
        if (!sessionLoading && !isAuthenticated && !sessionError) {
            console.log('User not authenticated, redirecting to login');
            toast.error("Authentication required", {
                description: "Please sign in to list an item.",
                icon: <AlertCircle className="h-4 w-4" />
            });
            router.push("/login");
        }
    }, [sessionLoading, isAuthenticated, router, user, sessionError]);

    // Watch for category changes and clear size field
    const selectedCategory = form.watch("category");
    useEffect(() => {
        if (selectedCategory) {
            // Clear the size field when category changes
            form.setValue("size", "");
        }
    }, [selectedCategory, form]);

    const handleSubmit = async (data: ListingFormData) => {
        console.log('Form submission started with data:', { ...data, images: data.images?.length || 0 });
        
        if (!user) {
            console.log('No user found, showing auth error');
            toast.error("Authentication required", {
                description: "Please sign in to list an item.",
                icon: <AlertCircle className="h-4 w-4" />
            });
            return;
        }

        console.log('Setting isSubmitting to true');
        setIsSubmitting(true);
        
        try {
            // Validate required fields
            if (!data.category) {
                console.log('Category validation failed - no category selected');
                toast.error("Category is required", {
                    description: "Please select a category for your item.",
                    icon: <AlertCircle className="h-4 w-4" />
                });
                return;
            }

            console.log('Category validation passed:', data.category);

            // Prepare the clothing item data
            const clothingItemData: CreateClothingItemInput = {
                title: data.title,
                description: data.description || undefined,
                category: data.category as string, // Already validated above
                size: data.size || undefined,
                condition: data.condition || undefined,
                brand: data.brand || undefined,
                color: data.color || undefined,
                material: data.material || undefined,
                tags: data.tags || undefined,
                images: data.images || undefined, // File objects from the form
                points_value: data.pointsValue || undefined,
                exchange_preference: data.exchangePreference || 'both',
                location: data.location ? {
                    address: data.location.address,
                    city: data.location.city || "Unknown",
                    state: data.location.state || "Unknown", 
                    country: data.location.country || "Unknown",
                    coordinates: data.location.coordinates || {
                        lat: data.location.lat,
                        lng: data.location.lng
                    }
                } : undefined,
            };

            // Create the clothing item in the database
            console.log('Calling createClothingItem with data:', clothingItemData);
            console.log('User ID:', user.id);
            
            const result = await createClothingItem(clothingItemData, user.id);
            console.log('createClothingItem result:', result);

            if (result.success) {
                // Show success message with details
                const successMessage = result.imageUploadResults 
                    ? `Item listed successfully! ${result.imageUploadResults.successCount} images uploaded.`
                    : "Item listed successfully!";

                toast.success("Item listed successfully!", {
                    description: successMessage,
                    icon: <Check className="h-4 w-4" />
                });

                // If there were image upload failures, show a warning
                if (result.imageUploadResults && result.imageUploadResults.failureCount > 0) {
                    toast.warning("Some images failed to upload", {
                        description: `${result.imageUploadResults.failureCount} images couldn't be uploaded. ${result.imageUploadResults.errors.join(', ')}`,
                        icon: <AlertCircle className="h-4 w-4" />
                    });
                }

                if (onSubmit) {
                    onSubmit(data);
                } else {
                    // Redirect to dashboard
                    router.push("/dashboard");
                }
            } else {
                // Handle error
                toast.error("Failed to list item", {
                    description: result.error || "Please try again later.",
                    icon: <AlertCircle className="h-4 w-4" />
                });
            }
        } catch (error) {
            console.error('Error submitting listing:', error);
            toast.error("Failed to list item", {
                description: error instanceof Error ? error.message : "Please try again later.",
                icon: <AlertCircle className="h-4 w-4" />
            });
        } finally {
            console.log('Setting isSubmitting to false');
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    // Show loading state while session is loading
    console.log('Render check - sessionLoading:', sessionLoading, 'isAuthenticated:', isAuthenticated, 'sessionError:', sessionError);
    
    if (sessionLoading || loadingTimeout) {
        console.log('Showing loading state because sessionLoading is true or timeout occurred');
        return (
            <div className="max-w-6xl mx-auto">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">
                                    {loadingTimeout 
                                        ? "Still loading... This is taking longer than expected."
                                        : "Loading authentication..."
                                    }
                                </p>
                                {loadingTimeout && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm text-gray-500">
                                            If this continues, please check your connection or refresh the page.
                                        </p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Refresh Page
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show error state if session failed to load
    if (sessionError) {
        console.log('Showing error state because sessionError:', sessionError);
        return (
            <div className="max-w-6xl mx-auto">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Error</h3>
                                <p className="text-gray-600 mb-4">{sessionError}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Don't render form if user is not authenticated
    if (!isAuthenticated) {
        return null;
    }

    const isLoading = isSubmitting || externalLoading;

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
                                    <AdditionalDetails form={form} />
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