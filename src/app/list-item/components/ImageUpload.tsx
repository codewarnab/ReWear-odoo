"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { itemVariants } from "@/lib/animations";
import { toast } from "sonner";

interface ImageUploadProps {
    form: UseFormReturn<any>;
}

export function ImageUpload({ form }: ImageUploadProps) {
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);

    // Update form whenever imageFiles changes
    useEffect(() => {
        form.setValue('images', imageFiles);
    }, [imageFiles, form]);

    const handleImageUpload = async (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload only image files", {
                    icon: <AlertCircle className="h-4 w-4" />
                });
                return false;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB", {
                    icon: <AlertCircle className="h-4 w-4" />
                });
                return false;
            }
            return true;
        });

        if (imageFiles.length + validFiles.length > 5) {
            toast.error("You can upload up to 5 images only", {
                icon: <AlertCircle className="h-4 w-4" />
            });
            return;
        }

        // Process valid files
        const filePromises = validFiles.map(file => {
            return new Promise<{ preview: string; file: File }>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    resolve({ preview: result, file });
                };
                reader.readAsDataURL(file);
            });
        });

        try {
            const results = await Promise.all(filePromises);
            const newPreviews = results.map(r => r.preview);
            const newFiles = results.map(r => r.file);

            setImagePreview(prev => [...prev, ...newPreviews]);
            setImageFiles(prev => [...prev, ...newFiles]);
        } catch (error) {
            toast.error("Error processing images", {
                icon: <AlertCircle className="h-4 w-4" />
            });
        }
    };

    const removeImage = (index: number) => {
        setImagePreview(prev => prev.filter((_: string, i: number) => i !== index));
        setImageFiles(prev => prev.filter((_: File, i: number) => i !== index));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files);
        }
    };

    return (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Images</h3>
            
            <motion.div variants={itemVariants}>
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    {/* Drop Zone */}
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center shadow-md transition-all duration-200 ${dragActive
                                                ? "border-blue-500 bg-blue-50 shadow-lg"
                                                : "border-gray-300 hover:border-gray-400 hover:shadow-lg"
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                        <div className="mt-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="shadow-sm hover:shadow-md transition-shadow duration-200"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                            >
                                                Choose Images
                                            </Button>
                                            <p className="mt-2 text-sm text-gray-600">
                                                or drag and drop here
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            PNG, JPG, GIF up to 5MB each (max 5 images)
                                        </p>
                                    </div>

                                    {/* Hidden File Input */}
                                    <input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                        className="hidden"
                                    />

                                    {/* Image Preview */}
                                    {imagePreview.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {imagePreview.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={image}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:shadow-lg"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>
                                Add up to 5 clear photos of your item
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </motion.div>
        </div>
    );
} 