import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar-placeholder.iran.liara.run',
        port: '',
        pathname: '/avatars**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '**',
      },
      // Add any other image domains you might use
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
