import { Course } from './types'
import { CourseCard } from './course-card'
import { Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CourseListProps {
  courses: Course[]
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export function CourseList({ courses, viewMode, onViewModeChange }: CourseListProps) {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Set<number>>(new Set())

  const handleBookmarkToggle = (courseId: number, isBookmarked: boolean) => {
    setBookmarkedCourses(prev => {
      const newSet = new Set(prev)
      if (isBookmarked) {
        newSet.add(courseId)
      } else {
        newSet.delete(courseId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewModeChange('list')}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={{
              ...course,
              isBookmarked: bookmarkedCourses.has(course.id)
            }}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ))}
      </div>
    </div>
  )
} 