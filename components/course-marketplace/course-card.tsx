"use client"

import { useState } from "react"
import { Bookmark, Shield, Clock, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Course } from './types'
import { useAuthModal } from "./auth-modal-context"

interface CourseCardProps {
  course: Course
  onBookmarkToggle?: (id: number, isBookmarked: boolean) => void
  isAuthenticated?: boolean
}

export function CourseCard({ course, onBookmarkToggle, isAuthenticated = false }: CourseCardProps) {
  const [bookmarked, setBookmarked] = useState(course.isBookmarked || false)
  const [imageError, setImageError] = useState(false)
  const { openAuthModal } = useAuthModal()

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }

    const newBookmarkedState = !bookmarked
    setBookmarked(newBookmarkedState)
    onBookmarkToggle?.(course.id, newBookmarkedState)
  }

  const getPlaceholderImage = () => {
    // Generate a placeholder image based on the course category
    const category = (course.category || '').toLowerCase()
    const colors = {
      survival: 'bg-green-900',
      tactical: 'bg-blue-900',
      default: 'bg-zinc-800'
    }
    const color = colors[category as keyof typeof colors] || colors.default

    return (
      <div className={`w-full h-full ${color} flex items-center justify-center`}>
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🏕️</div>
          <div className="text-zinc-400 text-sm font-medium">{course.category || 'Course'}</div>
        </div>
      </div>
    )
  }

  const getDifficultyColor = () => {
    switch (course.difficulty) {
      case "Beginner":
        return "text-green-400"
      case "Moderate":
        return "text-orange-400"
      case "Advanced":
        return "text-red-400"
      default:
        return "text-zinc-400"
    }
  }

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800 overflow-hidden group hover:shadow-xl transition-shadow duration-300 py-0">
      <div className="relative">
        {/* Featured Image */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-lg">
          {!course.image || imageError ? (
            getPlaceholderImage()
          ) : (
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
              onError={() => setImageError(true)}
            />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-lg" />

          {/* Course Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-lg font-medium mb-1">{course.title}</h3>

            {/* Price and Rating */}
            <div className="flex items-center gap-3">
              <Badge className="bg-cyan-600 hover:bg-cyan-600 text-white font-semibold rounded-sm px-1">${course.price}</Badge>
              <span className="text-zinc-300 text-sm font-medium">{course.location}</span>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmarkClick}
                className="h-8 w-8 text-white hover:bg-white/20 transition-colors ml-auto"
              >
                <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-white" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="px-4 py-4 bg-zinc-900">
          <div className="grid grid-cols-3 gap-4 text-sm">
            {/* Difficulty */}
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-cyan-600" />
              <div>
                <div className="text-zinc-400 text-xs">Difficulty</div>
                <div className={`font-medium ${getDifficultyColor()}`}>{course.difficulty}</div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-cyan-600" />
              <div>
                <div className="text-zinc-400 text-xs">Duration</div>
                <div className="text-white font-medium">{course.duration}</div>
              </div>
            </div>

            {/* Next Date */}
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-cyan-600" />
              <div>
                <div className="text-zinc-400 text-xs">Next</div>
                <div className="text-white font-medium">{new Date(course.startDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 