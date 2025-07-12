"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LocationPicker } from "@/components/ui/location-picker";
import { itemVariants } from "@/lib/animations";

interface LocationFieldProps {
    form: UseFormReturn<any>;
}

export function LocationField({ form }: LocationFieldProps) {
    return (
        <motion.div variants={itemVariants}>
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                        </FormLabel>
                        <FormControl>
                            <div className="rounded-lg overflow-hidden  transition-shadow duration-200">
                                <LocationPicker
                                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                                    value={field.value ? { lat: field.value.lat, lng: field.value.lng } : undefined}
                                    onValueChange={(latLng, address) => {
                                        if (latLng) {
                                            field.onChange({
                                                lat: latLng.lat,
                                                lng: latLng.lng,
                                                address: address || `${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`
                                            });
                                        } else {
                                            field.onChange(undefined);
                                        }
                                    }}
                                    placeholder="Click to select location"
                                    defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
                                />
                            </div>
                        </FormControl>
                        <FormDescription>
                            Help others find items near them
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </motion.div>
    );
} 