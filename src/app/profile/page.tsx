import EditProfileForm from "./EditProfileForm";

export default function EditProfilePage() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_MAPS_API_KEY is not set in the environment variables.");
    // Optionally, render a fallback UI or throw an error
    return <div>Configuration error: Google Maps API key is missing.</div>;
  }

  return <EditProfileForm apiKey={apiKey} />;
} 