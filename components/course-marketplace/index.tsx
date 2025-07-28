"use client"

import { useState, useMemo, useEffect } from "react"
import { FilterSidebar } from "./filter-sidebar"
import { CourseList } from "./course-list"
import { Filters, Course } from "@/lib/types"
import { supabase } from "@/lib/supabase"

export default function CourseMarketplace() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000],
    durationRange: [1, 14],
    courseTypes: [],
    difficulties: [],
    environments: [],
    arenas: []
  })
  const [courseTypeOptions, setCourseTypeOptions] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses')
        .select('id,title,price,duration,difficulty,environment,photo_url,location,schools(name,logo_url)')

      if (error) {
        console.error("Error fetching courses:", error)
        setCourses([])
      } else {
        const transformedData = data.map(course => ({
          ...course,
          schools: Array.isArray(course.schools) ? course.schools[0] : course.schools
        }));
        setCourses(transformedData as Course[]);
      }
      setLoading(false)
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    async function fetchCourseTypes() {
      const { data, error } = await supabase.from("course_types").select("id, name")
      if (!error && data) setCourseTypeOptions(data)
    }
    fetchCourseTypes()
  }, [])

  // Extract unique environment options from mock data
  const environmentOptions = useMemo(() => {
    const allEnvs: string[] = []
    courses.forEach((course) => {
      if (course.environment && Array.isArray(course.environment)) {
        allEnvs.push(...course.environment)
      }
    })
    return Array.from(new Set(allEnvs)).sort()
  }, [courses])

  // Extract unique difficulty options from mock data
  const difficultyOptions = useMemo(() => {
    const allDiffs: string[] = []
    courses.forEach((course) => {
      if (course.difficulty && typeof course.difficulty === 'string') {
        allDiffs.push(course.difficulty)
      }
    })
    const order = ["Beginner", "Intermediate", "Advanced", "Expert"]
    return Array.from(new Set(allDiffs))
      .filter(diff => order.includes(diff))
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
  }, [courses])

  const filteredCourses = courses.filter((course: Course) => {
    // Price filter
    if (course.price < filters.priceRange[0] || course.price > filters.priceRange[1]) {
      return false
    }

    // Duration filter
    if (course.durationDays && (course.durationDays < filters.durationRange[0] || course.durationDays > filters.durationRange[1])) {
      return false
    }

    // Environment filter
    if (filters.environments.length > 0 && !course.environment.some(env => filters.environments.includes(env))) {
      return false
    }

    // Arenas filter
    if (filters.arenas.length > 0 && (!course.arenas || !course.arenas.some(arena => filters.arenas.includes(arena)))) {
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
      environments: [],
      arenas: []
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          clearFilters={clearFilters}
          filteredCoursesCount={filteredCourses.length}
          onClose={() => {}}
          environmentOptions={environmentOptions}
          difficultyOptions={difficultyOptions}
          courseTypeOptions={courseTypeOptions}
        />
        <div className="flex-1">
          <CourseList
            courses={filteredCourses}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
} 