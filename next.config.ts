import type { NextConfig } from "next";
import { uploadCoursePhoto, getCoursePhotoUrl, deleteCoursePhoto, listCoursePhotos } from '@/lib/supabase-storage'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
