"use client"

import { useState } from "react"
import { Bookmark, Shield, Clock, Trees, ImageIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Course } from '@/lib/types'
import { useAuthModal } from "./auth-modal-context"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from '@/lib/auth-context'

interface CourseCardProps {
  course: Course
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void
}

export function CourseCard({ course, onBookmarkToggle }: CourseCardProps) {
  const [imageError, setImageError] = useState(false)
  const { openAuthModal } = useAuthModal()
  const { isAuthenticated } = useAuth()

  let parsedUrls: string[] = []
  if (course.photo_url) {
    try {
      if (Array.isArray(course.photo_url)) {
        parsedUrls = course.photo_url
      } else if (typeof course.photo_url === 'string') {
        const parsed = JSON.parse(course.photo_url)
        if (Array.isArray(parsed)) {
          parsedUrls = parsed
        }
      }
    } catch {
      // Malformed photo_url, do nothing and the placeholder will be used.
    }
  }

  const imageUrl = parsedUrls.length > 0 ? parsedUrls[0] : null

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      openAuthModal('signup')
      return
    }
    if (course.id) {
      onBookmarkToggle?.(course.id, !course.isBookmarked)
    }
  }

  const getPlaceholderImage = () => {
    return (
      <div className="w-full h-full bg-zinc-800 flex flex-col items-center justify-center text-center p-4">
        <ImageIcon className="w-12 h-12 text-zinc-500 mb-2" />
        <div className="text-zinc-400 text-sm font-medium">{course.category || 'Course'}</div>
      </div>
    )
  }

  return (
    <Link href={`/marketplace/courses/${course.id}`} className="block group" tabIndex={-1}>
      <Card className="w-full bg-zinc-900 border-zinc-800 overflow-hidden group hover:shadow-xl transition-shadow duration-300 py-0">
        <div className="relative">
          {/* Featured Image */}
          <div className="relative aspect-[3/2] lg:aspect-[3/2] w-full overflow-hidden rounded-t-lg">
            {!imageUrl || imageError ? (
              getPlaceholderImage()
            ) : (
              <Image
                src={imageUrl}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 md:via-black/60 lg:via-black/40 to-transparent rounded-t-lg" />

            {/* Course Title */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white text-lg font-medium mb-1">{course.title}</h3>

              {/* Price and Rating */}
              <div className="flex items-center gap-3">
                <Badge className="bg-teal-600 hover:bg-teal-600 text-white font-semibold rounded-sm px-1">${course.price}</Badge>
                <span className="text-zinc-300 text-sm font-medium">{course.location}</span>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBookmarkClick}
                  className={`h-8 w-8 hover:bg-white/20 transition-colors ml-auto ${course.isBookmarked ? "border-teal-500 text-teal-500" : "text-white border-zinc-700"}`}
                >
                  <Bookmark className={`h-5 w-5 ${course.isBookmarked ? "fill-current" : "text-teal-500"}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Info Section */}
          <div className="px-4 py-4 bg-zinc-950">
            <div className="grid grid-cols-3 gap-4 text-sm">
              {/* Difficulty */}
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-teal-600" />
                <div className="text-white">{course.difficulty}</div>
              </div>
              

              {/* Environment */}
              <div className="flex items-start gap-2">
                <Trees className="h-4 w-4 text-teal-600" />
                <div className="text-white">
                    {(course.environment ?? []).length > 0
                      ? (course.environment ?? []).join(", ")
                      : "None"}
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                <div className="text-white">
                    {course.duration ? `${course.duration} days` : 'N/A'}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 animate-pulse">
      <div className="w-full h-48 bg-zinc-800"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 w-3/4 bg-zinc-700 rounded-md"></div>
        <div className="h-4 w-1/2 bg-zinc-700 rounded-md"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-1/4 bg-zinc-700 rounded-md"></div>
          <div className="h-8 w-8 bg-zinc-700 rounded-full"></div>
        </div>
      </div>
    </div>
  )
} 