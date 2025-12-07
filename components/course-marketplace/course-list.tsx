import React, { useState, useEffect, useRef } from "react"
import { Course } from '@/lib/types'
import { CourseCard, CourseCardSkeleton } from './course-card'
import { useBookmarks } from '@/lib/useBookmarks'

function AnimatedCard({ children, batchIndex }: { children: React.ReactNode, batchIndex: number }) {
  const [show, setShow] = React.useState(false)
  React.useEffect(() => {
    const timeout = setTimeout(() => setShow(true), batchIndex * 50)
    return () => clearTimeout(timeout)
  }, [batchIndex])
  return (
    <div
      className={`transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {children}
    </div>
  )
}

interface CourseListProps {
  courses: Course[]
  loading: boolean
}

export function CourseList({ courses, loading }: CourseListProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const [visibleCount, setVisibleCount] = useState(18)
  const [loadingState, setLoadingState] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleBookmarkToggle = (courseId: string) => {
    toggleBookmark(courseId.toString())
  }

  useEffect(() => {
    if (loadingState) return;
    if (visibleCount >= courses.length) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingState(true)
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 18, courses.length))
            setLoadingState(false)
          }, 400)
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    )
    const sentinel = sentinelRef.current
    if (sentinel) {
      observer.observe(sentinel)
    }
    return () => {
      if (sentinel) observer.unobserve(sentinel)
    }
  }, [loadingState, visibleCount, courses.length])

  const displayedCourses = courses.slice(0, visibleCount)
  const hasMore = visibleCount < courses.length

  // Calculate batch-relative index for animation
  const BATCH_SIZE = 18

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-zinc-300">
            <div className="h-8 w-48 bg-zinc-700 rounded-md animate-pulse" />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 pt-4 gap-6">
        {displayedCourses.filter(course => course.id).map((course, index) => {
          // batchIndex is index within the current batch
          const batchIndex = index % BATCH_SIZE
          return (
            <AnimatedCard key={course.id} batchIndex={batchIndex}>
              <CourseCard 
                course={{
                  ...course,
                  environment: course.environment ?? [],
                  isBookmarked: isBookmarked(course.id!.toString())
                }}
                onBookmarkToggle={handleBookmarkToggle}
              />
            </AnimatedCard>
          )
        })}
      </div>
      {/* Sentinel for infinite scroll */}
      {hasMore && <div ref={sentinelRef} className="h-8" />}
      {loadingState && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-transparent" />
        </div>
      )}
    </div>
  )
} 