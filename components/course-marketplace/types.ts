import { DateRange } from "react-day-picker"


export interface Course {
  id: number
  title: string
  image: string
  price: number
  difficulty: "Beginner" | "Moderate" | "Advanced"
  duration: string
  durationDays: number
  startDate: string
  endDate: string
  location: string
  distance: number
  category: string
  rating: number
  reviewCount: number
  students: number
  immersion: boolean
  prerequisites: boolean
  certifications: boolean
  environments: string[]
  arenas: string[]
  isBookmarked?: boolean
}

export interface Filters {
  priceRange: [number, number]
  durationRange: [number, number]
  courseTypes: string[]
  difficulties: string[]
  dateRange: DateRange | undefined
  maxDistance: number
  nearMeOnly: boolean
  immersion: boolean
  prerequisites: boolean
  certifications: boolean
  environments: string[]
  arenas: string[]
} 