"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import type { Filters } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  X,
  Search,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/header"
import { supabase } from "@/lib/supabase"
import { FilterBar } from "@/components/course-marketplace/filter-bar"
import { Input } from "@/components/ui/input"
import { CourseCard } from "./components/course-marketplace/course-card"
import { CourseList } from "./components/course-marketplace/course-list"
import { useAuth } from "@/lib/auth-context"
import LiveThroughFooter from "@/components/LiveThroughFooter"
import { FilterSidebar } from "@/components/course-marketplace/filter-sidebar"


export default function CourseMarketplace() {
  const [sortBy, setSortBy] = useState("Newest")
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000],
    durationRange: [1, 40],
    courseTypes: [],
    difficulties: [],
    environments: [],
    arenas: [],
  })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const [environmentOptions, setEnvironmentOptions] = useState<string[]>([])
  const [difficultyOptions, setDifficultyOptions] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [hasUserSetPriceRange, setHasUserSetPriceRange] = useState(false)
  const [minDuration, setMinDuration] = useState(1)
  const [maxDuration, setMaxDuration] = useState(40)
  const [courseTypeOptions, setCourseTypeOptions] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      const { data, error } = await supabase
        .from("courses")
        .select("id,title,price,duration,difficulty,environment,photo_url,location,schools(name,logo_url),status,course_type_id,created_at,course_types(id,name)")
        .eq('status', 'Published')
      if (error) {
        console.error("Error fetching courses:", error)
        setCourses([])
      } else {
        // Map the joined course_types to course_type
        const transformed = (data || []).map((course: any) => ({
          ...course,
          course_type: course.course_types ? course.course_types : undefined
        }))
        setCourses(transformed)
      }
      setLoading(false)
    }
    fetchCourses()
  }, [])

  // Fetch unique environments from Supabase
  useEffect(() => {
    async function fetchEnvironmentOptions() {
      const { data, error } = await supabase
        .from("courses")
        .select("environment")
      console.log('Supabase environment data:', data)
      if (!error && data) {
        const allEnvs: string[] = []
        data.forEach((course) => {
          if (!course.environment) return
          // If environment is a string, try to parse it as JSON
          if (typeof course.environment === 'string') {
            try {
              const parsed = JSON.parse(course.environment)
              if (Array.isArray(parsed)) {
                allEnvs.push(...parsed)
              }
            } catch {
              // Not a JSON string, skip
            }
          } else if (Array.isArray(course.environment)) {
            allEnvs.push(...course.environment)
          }
        })
        const uniqueEnvs = Array.from(new Set(allEnvs)).sort()
        setEnvironmentOptions(uniqueEnvs)
      }
    }
    fetchEnvironmentOptions()
  }, [])

  // Fetch unique difficulties from Supabase
  useEffect(() => {
    async function fetchDifficultyOptions() {
      const { data, error } = await supabase
        .from("courses")
        .select("difficulty")
      console.log('Supabase difficulty data:', data)
      if (!error && data) {
        const allDiffs: string[] = []
        data.forEach((course) => {
          if (course.difficulty && typeof course.difficulty === 'string') {
            allDiffs.push(course.difficulty)
          }
        })
        const order = ["Beginner", "Intermediate", "Advanced", "Expert"]
        const uniqueDiffs = Array.from(new Set(allDiffs))
          .filter(diff => order.includes(diff))
          .sort((a, b) => order.indexOf(a) - order.indexOf(b))
        setDifficultyOptions(uniqueDiffs)
      }
    }
    fetchDifficultyOptions()
  }, [])

  // Fetch all course prices and compute min/max
  useEffect(() => {
    async function fetchPriceRange() {
      const { data, error } = await supabase
        .from("courses")
        .select("price")
      if (!error && data && data.length > 0) {
        const prices = data
          .map((course) => typeof course.price === 'number' ? course.price : parseFloat(course.price))
          .filter((price) => !isNaN(price))
        if (prices.length > 0) {
          setMinPrice(Math.min(...prices))
          setMaxPrice(Math.max(...prices))
        }
      }
    }
    fetchPriceRange()
  }, [])

  // Fetch all course durations and compute min/max
  useEffect(() => {
    async function fetchDurationRange() {
      const { data, error } = await supabase
        .from("courses")
        .select("duration")
      if (!error && data && data.length > 0) {
        const durations = data
          .map((course) => typeof course.duration === 'number' ? course.duration : parseInt(course.duration))
          .filter((duration): duration is number => typeof duration === 'number' && !isNaN(duration))
        if (durations.length > 0) {
          setMinDuration(Math.min(...durations))
          setMaxDuration(Math.max(...durations))
        }
      }
    }
    fetchDurationRange()
  }, [])

  // Update filters initialization to use minPrice, maxPrice, minDuration, and maxDuration, but only if user hasn't interacted
  useEffect(() => {
    if (!hasUserSetPriceRange) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
      }))
    }
  }, [minPrice, maxPrice, hasUserSetPriceRange])

  // Add after the useEffect for priceRange sync
  useEffect(() => {
    // Only update if the user hasn't set a custom duration range
    setFilters((prev) => {
      const isDefault =
        (prev.durationRange[0] === 1 && prev.durationRange[1] === 40) ||
        (prev.durationRange[0] === minDuration && prev.durationRange[1] === maxDuration);
      if (isDefault && (minDuration !== 1 || maxDuration !== 40)) {
        return {
          ...prev,
          durationRange: [minDuration, maxDuration],
        };
      }
      return prev;
    });
  }, [minDuration, maxDuration]);

  // Fetch unique course types from Supabase
  useEffect(() => {
    async function fetchCourseTypeOptions() {
      const { data, error } = await supabase
        .from("course_types")
        .select("id, name")
      if (!error && data) {
        setCourseTypeOptions(data)
      }
    }
    fetchCourseTypeOptions()
  }, [])

  const handleBookmarkToggle = async (courseId: number, isBookmarked: boolean) => {
    if (!isAuthenticated) return

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .insert([{ course_id: courseId }])
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('course_id', courseId)
        if (error) throw error
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      // Optionally show an error message to the user
    }
  }

  // Filter courses based on current filters
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      // Price filter
      if (course.price < filters.priceRange[0] || course.price > filters.priceRange[1]) {
        return false
      }
      // Duration filter
      const courseDuration = typeof course.duration === 'number' ? course.duration : parseInt(course.duration)
      if (courseDuration < filters.durationRange[0] || courseDuration > filters.durationRange[1]) {
        return false
      }
      // Course type filter
      if (filters.courseTypes.length > 0 && !filters.courseTypes.includes(course.course_type_id)) {
        return false
      }
      // Difficulty filter
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(course.difficulty)) {
        return false
      }
      // Environment filter
      if (
        filters.environments.length > 0 &&
        (!Array.isArray(course.environment) ||
          !course.environment.some((env: string) => filters.environments.includes(env)))
      ) {
        return false
      }
      return true
    })

    // Search filter (by title or description)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(course => {
        const title = course.title?.toLowerCase() || ""
        const description = course.description?.toLowerCase() || ""
        return title.includes(q) || description.includes(q)
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "Price: Low to High":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "Price: High to Low":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "Newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "Most Popular":
      default:
        filtered.sort((a, b) => b.students - a.students)
        break
    }

    return filtered
  }, [courses, filters, sortBy, searchQuery])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-900/50 text-green-300 border-green-700"
      case "Intermediate":
        return "bg-yellow-900/50 text-yellow-300 border-yellow-700"
      case "Advanced":
        return "bg-red-900/50 text-red-300 border-red-700"
      default:
        return "bg-gray-700 text-gray-300 border-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [minPrice, maxPrice],
      durationRange: [minDuration, maxDuration],
      courseTypes: [],
      difficulties: [],
      environments: [],
      arenas: [],
    })
    setHasUserSetPriceRange(false)
  }

  // Compute hasUserSetDurationRange dynamically
  const hasUserSetDurationRange = filters.durationRange[0] > minDuration || filters.durationRange[1] < maxDuration;

  // Automatically unset hasUserSetPriceRange if priceRange matches default
  useEffect(() => {
    if (
      filters.priceRange[0] === minPrice &&
      filters.priceRange[1] === maxPrice
    ) {
      setHasUserSetPriceRange(false);
    }
  }, [filters.priceRange, minPrice, maxPrice]);

  // In hasActiveFilters, use the computed hasUserSetDurationRange
  const hasActiveFilters =
    hasUserSetPriceRange ||
    hasUserSetDurationRange ||
    filters.courseTypes.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.environments.length > 0 ||
    filters.arenas.length > 0;

  return (
    <div className="text-zinc-100 pt-20 md:pt-0">
      <Header />

      <FilterBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        hasActiveFilters={Boolean(hasActiveFilters)}
        clearFilters={clearFilters}
        environmentOptions={environmentOptions}
        difficultyOptions={difficultyOptions}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceSliderChange={(value) => { setHasUserSetPriceRange(true); setFilters({ ...filters, priceRange: value }) }}
        hasUserSetPriceRange={hasUserSetPriceRange}
        minDuration={minDuration}
        maxDuration={maxDuration}
        onDurationSliderChange={(value) => { setFilters({ ...filters, durationRange: value }) }}
        hasUserSetDurationRange={hasUserSetDurationRange}
        courseTypeOptions={courseTypeOptions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Filters Slide-in Panel */}
      <>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
            filtersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`} 
          onClick={() => setFiltersOpen(false)} 
        />

        {/* Slide-in Panel */}
        {filtersOpen && (
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            filteredCoursesCount={filteredCourses.length}
            onClose={() => setFiltersOpen(false)}
            environmentOptions={environmentOptions}
            difficultyOptions={difficultyOptions}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceSliderChange={(value) => { setHasUserSetPriceRange(true); setFilters({ ...filters, priceRange: value }) }}
            minDuration={minDuration}
            maxDuration={maxDuration}
            onDurationSliderChange={(value) => { setFilters({ ...filters, durationRange: value }) }}
            courseTypeOptions={courseTypeOptions}
          />
        )}
      </>

      {/* Course Count + Heading Section */}
      <div className="container mx-auto px-4 pt-8 md:mt-4 mb-6">
        <div className="flex flex-col items-start md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white flex items-end gap-3">
              <span className="text-white">{filteredCourses.length}</span>{" "}
              <span className="flex flex-col items-start justify-center ml-2">
                {hasActiveFilters && (
                  <span className="text-zinc-400 text-base font-normal">
                    <span className="font-bold text-white text-sm">of {courses.length}</span>
                  </span>
                )}
                <span className="text-zinc-400 text-6xl md:text-4xl lg:text-6xl">Courses</span>
              </span>
            </h1>
          </div>
          {/* Desktop search bar (hidden on mobile) */}
          <div className="hidden md:flex flex-col items-end w-full max-w-sm">
            <form
              onSubmit={e => e.preventDefault()}
              className="relative w-full"
            >
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full rounded-lg bg-zinc-900 pl-10 py-5 text-lg border-zinc-700 text-white placeholder:text-zinc-400 pr-12"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-500"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 pb-16">
          <CourseList courses={filteredCourses} loading={loading} />
        </div>
        <LiveThroughFooter />
      </main>
    </div>
  )
}

