export interface CourseType {
  id: string; // UUID
  name: string;
  description?: string;
  created_at?: string;
}

export interface Course {
  id?: string
  title: string
  description?: string
  price: number
  duration: number
  difficulty: string
  environment: string[]
  prerequisites?: string
  skills?: string[]
  location: string
  latitude?: number
  longitude?: number
  status?: "Draft" | "Published" | "Archived"
  photo_url: string[]
  course_type_id?: string // UUID reference to course_types
  school_id?: string
  durationDays?: number
  startDate?: string
  endDate?: string
  category?: string
  rating?: number
  reviewCount?: number
  students?: number
  arenas?: string[]
  isBookmarked?: boolean
  // Optionally, include the joined object for convenience
  course_type?: CourseType
}

export interface School {
  id: string
  name: string
  description?: string
  website?: string
  logo_url?: string
  contact_email?: string
  location?: string
  created_by?: string
  created_at?: string
  contact_phone?: string
  address?: string
  facebook_url?: string
  twitter_url?: string
  instagram_url?: string
  youtube_url?: string
  tiktok_url?: string
}

export interface Filters {
  priceRange: [number, number]
  durationRange: [number, number]
  courseTypes: string[]
  difficulties: string[]
  environments: string[]
  arenas: string[]
} 

