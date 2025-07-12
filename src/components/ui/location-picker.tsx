"use client";

import {
    APIProvider,
    Map as GoogleMap,
    Marker,
} from "@vis.gl/react-google-maps";
import { MapPinnedIcon, Navigation, Loader2 } from "lucide-react";
import { useCallback, useState, useEffect, type ComponentProps } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { coordinatesToAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export type Props = ComponentProps<typeof GoogleMap> & {
    apiKey: string;
    value?: google.maps.LatLngLiteral;
    defaultValue?: google.maps.LatLngLiteral;
    onValueChange?: (value?: google.maps.LatLngLiteral, address?: string) => void;
    // Added optional props
    defaultCenter?: google.maps.LatLngLiteral;
    disabled?: boolean;
    placeholder?: string;
    theme?: "light" | "dark" | "system";
};

// India's center coordinates as default
const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

export function LocationPicker({
    apiKey,
    className,
    defaultValue,
    onValueChange,
    value,
    defaultCenter = INDIA_CENTER, // Default to India's center
    disabled = false,
    placeholder = "Select a location",
    theme = "system",
    ...props
}: Props) {
    const isControlled = onValueChange !== undefined;
    const [internalValue, setInternalValue] = useState<
        google.maps.LatLngLiteral | undefined
    >(defaultValue);

    // Location permission and loading states
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationPermission, setLocationPermission] = useState<
        "granted" | "denied" | "prompt" | "unsupported"
    >("prompt");
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(
        defaultCenter
    );
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    
    // Address state
    const [address, setAddress] = useState<string>("");
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    // Detect system dark mode preference
    const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const isDarkMode =
        theme === "dark" || (theme === "system" && systemPrefersDark);

    // Get actual value for controlled/uncontrolled pattern
    const actualValue = isControlled ? value : internalValue;

    // Check geolocation support and permissions on mount
    useEffect(() => {
        const checkLocationSupport = async () => {
            if (!navigator.geolocation) {
                setLocationPermission("unsupported");
                return;
            }

            // Check if permissions API is available
            if (navigator.permissions) {
                try {
                    const permission = await navigator.permissions.query({
                        name: "geolocation",
                    });
                    setLocationPermission(permission.state as any);
                    
                    // Listen for permission changes
                    permission.addEventListener("change", () => {
                        setLocationPermission(permission.state as any);
                    });
                } catch (error) {
                    console.warn("Permissions API not supported");
                }
            }
        };

        checkLocationSupport();
    }, []);

    // Fetch address when coordinates change
    useEffect(() => {
        const fetchAddress = async () => {
            if (!actualValue || !apiKey) return;
            
            setIsLoadingAddress(true);
            try {
                const fetchedAddress = await coordinatesToAddress(
                    { lat: actualValue.lat, lng: actualValue.lng },
                    apiKey
                );
                setAddress(fetchedAddress);
            } catch (error) {
                console.error("Error fetching address:", error);
                setAddress(`${actualValue.lat.toFixed(4)}, ${actualValue.lng.toFixed(4)}`);
            } finally {
                setIsLoadingAddress(false);
            }
        };

        fetchAddress();
    }, [actualValue, apiKey]);

    // Memoize handleChange to prevent unnecessary re-renders
    const handleChange = useCallback(
        (latLng?: google.maps.LatLngLiteral | null) => {
            const newValue = latLng ?? undefined;

            if (!isControlled) {
                setInternalValue(newValue);
            }

            // We'll pass the address in the effect below, for now just pass coordinates
            onValueChange?.(newValue, undefined);
        },
        [isControlled, onValueChange]
    );

    // Notify parent when address changes
    useEffect(() => {
        if (actualValue && address) {
            onValueChange?.(actualValue, address);
        }
    }, [actualValue, address, onValueChange]);

    // Function to get user's current location
    const getCurrentLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser");
            return;
        }

        setIsGettingLocation(true);

        try {
            const position = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 60000, // Cache for 1 minute
                        }
                    );
                }
            );

            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // Update map center and selected location
            setMapCenter(userLocation);
            handleChange(userLocation);
            setLocationPermission("granted");
            setMapKey(prev => prev + 1); // Force map re-render with new center
        } catch (error) {
            console.error("Error getting location:", error);
            setLocationPermission("denied");
            
            // Show user-friendly error message based on error type
            if (error instanceof GeolocationPositionError) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.warn("Location permission denied by user");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.warn("Location information is unavailable");
                        break;
                    case error.TIMEOUT:
                        console.warn("Location request timed out");
                        break;
                }
            }
        } finally {
            setIsGettingLocation(false);
        }
    }, [handleChange]);

    // Auto-request location when component mounts if permission is granted
    useEffect(() => {
        if (locationPermission === "granted" && !actualValue) {
            getCurrentLocation();
        }
    }, [locationPermission, getCurrentLocation, actualValue]);

    // Key to force map re-render when location changes
    const [mapKey, setMapKey] = useState(0);

    // Update map center when value changes
    useEffect(() => {
        if (actualValue) {
            setMapCenter(actualValue);
        } else {
            setMapCenter(defaultCenter);
        }
        setMapKey(prev => prev + 1);
    }, [actualValue, defaultCenter]);

    // Format the display value for the button
    const displayValue = actualValue
        ? isLoadingAddress
            ? "Loading address..."
            : address || `${actualValue.lat.toFixed(4)}, ${actualValue.lng.toFixed(4)}`
        : placeholder;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline" // Match shadcn input style
                    disabled={disabled}
                    className={cn(
                        "justify-start text-left font-normal", // Match input layout
                        "h-10 px-3 py-2", // Match input sizing
                        "bg-background", // Ensure background matches form inputs
                        !actualValue && "text-muted-foreground" // Muted text when no value
                    )}
                >
                    <span className="truncate flex items-center gap-2">
                        {isLoadingAddress && <Loader2 className="w-4 h-4 animate-spin" />}
                        {displayValue}
                    </span>
                    <span className="ml-auto">
                        <MapPinnedIcon />
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Pick a location</DialogTitle>
                    <DialogDescription>
                        Double-click to place a marker, then drag it to adjust the location.
                    </DialogDescription>
                </DialogHeader>
                
                {/* Location controls */}
                <div className="flex gap-2 mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        disabled={
                            disabled || 
                            isGettingLocation || 
                            locationPermission === "unsupported"
                        }
                        className="flex items-center gap-2"
                    >
                        {isGettingLocation ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Navigation className="h-4 w-4" />
                        )}
                        {isGettingLocation ? "Getting location..." : "Use my location"}
                    </Button>
                    
                    {locationPermission === "denied" && (
                        <span className="text-sm text-muted-foreground flex items-center">
                            Location access denied. Please enable location services.
                        </span>
                    )}
                    
                    {locationPermission === "unsupported" && (
                        <span className="text-sm text-muted-foreground flex items-center">
                            Geolocation is not supported by your browser.
                        </span>
                    )}
                </div>

                <div className="min-h-[400px] rounded-md border overflow-hidden" style={{ touchAction: 'pan-x pan-y' }}>
                    <APIProvider apiKey={apiKey}>
                        <GoogleMap
                            key={mapKey}
                            gestureHandling="greedy"
                            defaultZoom={props.defaultZoom ?? 6}
                            defaultCenter={actualValue ?? mapCenter}
                            zoom={actualValue ? 15 : 6} // Zoom in when location is selected
                            zoomControl={true}
                            mapTypeControl={false}
                            scaleControl={true}
                            streetViewControl={false}
                            rotateControl={false}
                            fullscreenControl={true}
                            {...props}
                            className={cn(
                                "w-full h-full min-h-[400px]",
                                className
                            )}
                            disableDoubleClickZoom
                            onDblclick={(ev) => !disabled && handleChange(ev.detail.latLng)}
                            onIdle={() => setIsMapInitialized(true)}
                            styles={isDarkMode ? darkMapStyle : lightMapStyle}
                        >
                        {actualValue && (
                            <Marker
                                position={actualValue}
                                draggable={!disabled}
                                onDragEnd={(ev) =>
                                    !disabled && handleChange(ev.latLng?.toJSON())
                                }
                            />
                        )}
                    </GoogleMap>
                </APIProvider>
                </div>
                
                {/* Display current address */}
                {actualValue && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground">Selected location:</div>
                        <div className="font-medium">
                            {isLoadingAddress ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading address...
                                </div>
                            ) : (
                                address || `${actualValue.lat.toFixed(6)}, ${actualValue.lng.toFixed(6)}`
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {actualValue.lat.toFixed(6)}, {actualValue.lng.toFixed(6)}
                        </div>
                    </div>
                )}
                
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={disabled}>
                            Close
                        </Button>
                    </DialogClose>
                    {actualValue && (
                        <Button
                            variant="destructive"
                            onClick={() => handleChange(undefined)}
                            disabled={disabled}
                        >
                            Clear Selection
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Shadcn-inspired light theme (based on default Tailwind colors)
const lightMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#f7fafc" }] }, // gray-50
    { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] }, // white
    { elementType: "labels.text.fill", stylers: [{ color: "#4a5568" }] }, // gray-700
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#cbd5e0" }], // gray-300
    },
    {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [{ color: "#718096" }], // gray-600
    },
    {
        featureType: "administrative.land_parcel",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4a5568" }], // gray-700
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#718096" }], // gray-600
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#e2e8f0" }], // gray-200
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#718096" }], // gray-600
    },
    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ color: "#edf2f7" }], // gray-100
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#718096" }], // gray-600
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#e2e8f0" }], // gray-200
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#cbd5e0" }], // gray-300
    },
    {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [{ color: "#a0aec0" }], // gray-400
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#bee3f8" }], // blue-200 adjusted for water
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#718096" }], // gray-600
    },
];

// Shadcn-inspired dark theme (based on default Tailwind colors)
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1a202c" }] }, // gray-900
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a202c" }] }, // gray-900
    { elementType: "labels.text.fill", stylers: [{ color: "#a0aec0" }] }, // gray-400
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#4a5568" }], // gray-700
    },
    {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [{ color: "#a0aec0" }], // gray-400
    },
    {
        featureType: "administrative.land_parcel",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#e2e8f0" }], // gray-200
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#a0aec0" }], // gray-400
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#2d3748" }], // gray-800
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#a0aec0" }], // gray-400
    },
    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ color: "#2d3748" }], // gray-800
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#a0aec0" }], // gray-400
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{ color: "#4a5568" }], // gray-700
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#718096" }], // gray-600
    },
    {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [{ color: "#a0aec0" }], // gray-400
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#2c5282" }], // blue-800 adjusted for water
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#a0aec0" }], // gray-400
    },
];