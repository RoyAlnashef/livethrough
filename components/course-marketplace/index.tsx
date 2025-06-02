"use client"

import { useState } from "react"
import { FilterSidebar } from "./filter-sidebar"
import { CourseList } from "./course-list"
import { courses } from "./mock-data"
import { Filters, Course } from "./types"

export default function CourseMarketplace() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000],
    durationRange: [1, 14],
    courseTypes: [],
    difficulties: [],
    dateRange: undefined,
    maxDistance: 500,
    nearMeOnly: false,
    immersion: false,
    prerequisites: false,
    certifications: false,
    environments: [],
    arenas: []
  })

  const filteredCourses = courses.filter((course: Course) => {
    // Price filter
    if (course.price < filters.priceRange[0] || course.price > filters.priceRange[1]) {
      return false
    }

    // Duration filter
    if (course.durationDays < filters.durationRange[0] || course.durationDays > filters.durationRange[1]) {
      return false
    }

    // Distance filter
    if (filters.nearMeOnly && course.distance > filters.maxDistance) {
      return false
    }

    // Date range filter
    if (filters.dateRange?.from && new Date(course.startDate) < filters.dateRange.from) {
      return false
    }
    if (filters.dateRange?.to && new Date(course.endDate) > filters.dateRange.to) {
      return false
    }

    // Immersion filter
    if (filters.immersion && !course.immersion) {
      return false
    }

    // Prerequisites filter
    if (filters.prerequisites && !course.prerequisites) {
      return false
    }

    // Certifications filter
    if (filters.certifications && !course.certifications) {
      return false
    }

    // Environments filter
    if (filters.environments.length > 0 && !course.environments.some(env => filters.environments.includes(env))) {
      return false
    }

    // Arenas filter
    if (filters.arenas.length > 0 && !course.arenas.some(arena => filters.arenas.includes(arena))) {
      return false
    }

    return true
  })

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      durationRange: [1, 14],
      courseTypes: [],
      difficulties: [],
      dateRange: undefined,
      maxDistance: 500,
      nearMeOnly: false,
      immersion: false,
      prerequisites: false,
      certifications: false,
      environments: [],
      arenas: []
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
        />
        <div className="flex-1">
          <CourseList
            courses={filteredCourses}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>
    </div>
  )
} 