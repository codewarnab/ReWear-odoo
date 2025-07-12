import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Types for geocoding
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
}

export interface GeocodeError {
  message: string;
  status: string;
}

/**
 * Converts latitude and longitude coordinates to a human-readable address
 * using Google Maps Geocoding API
 * 
 * @param coordinates - Object containing lat and lng properties
 * @param apiKey - Google Maps API key
 * @returns Promise that resolves to formatted address string
 * @throws Error if geocoding fails or API returns error
 */
export async function coordinatesToAddress(
  coordinates: Coordinates,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("Google Maps API key is required");
  }

  if (!coordinates.lat || !coordinates.lng) {
    throw new Error("Invalid coordinates provided");
  }

  // Validate coordinate ranges
  if (coordinates.lat < -90 || coordinates.lat > 90) {
    throw new Error("Latitude must be between -90 and 90 degrees");
  }

  if (coordinates.lng < -180 || coordinates.lng > 180) {
    throw new Error("Longitude must be between -180 and 180 degrees");
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeocodeResponse = await response.json();

    // Check if the geocoding was successful
    if (data.status !== 'OK') {
      throw new Error(`Geocoding failed with status: ${data.status}`);
    }

    // Check if we have results
    if (!data.results || data.results.length === 0) {
      throw new Error("No address found for the provided coordinates");
    }

    // Return the first (most accurate) formatted address
    return data.results[0].formatted_address;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get address: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while geocoding");
  }
}

/**
 * Converts latitude and longitude coordinates to a human-readable address
 * with error handling that returns a fallback string instead of throwing
 * 
 * @param coordinates - Object containing lat and lng properties
 * @param apiKey - Google Maps API key
 * @param fallback - Fallback string to return if geocoding fails
 * @returns Promise that resolves to formatted address string or fallback
 */
export async function coordinatesToAddressSafe(
  coordinates: Coordinates,
  apiKey: string,
  fallback: string = "Address not available"
): Promise<string> {
  try {
    return await coordinatesToAddress(coordinates, apiKey);
  } catch (error) {
    console.error("Geocoding error:", error);
    return fallback;
  }
}
