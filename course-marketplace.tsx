"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "./components/ui/date-picker"
import {
  MapPin,
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
import type { DateRange } from "react-day-picker"
import { Header } from "@/components/header"
import { supabase } from "@/lib/supabase"
import { FilterBar } from "@/components/course-marketplace/filter-bar"
import { Input } from "@/components/ui/input"
import { CourseCard } from "./components/course-marketplace/course-card"

interface Filters {
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

export default function CourseMarketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("Most Popular")
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 1000],
    durationRange: [1, 40],
    courseTypes: [],
    difficulties: [],
    dateRange: undefined,
    maxDistance: 500,
    nearMeOnly: false,
    immersion: false,
    prerequisites: false,
    certifications: false,
    environments: [],
    arenas: [],
  })
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      const { data, error } = await supabase.from("courses").select("*")
      if (error) {
        console.error("Error fetching courses:", error)
        setCourses([])
      } else {
        setCourses(data || [])
      }
      setLoading(false)
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    if (sortBy === "Closest" && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
            setLocationError(null)
          },
          (error) => {
            setLocationError("Location access denied or unavailable.")
          }
        )
      } else {
        setLocationError("Geolocation is not supported by this browser.")
      }
    }
  }, [sortBy, userLocation])

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
      if (course.durationDays < filters.durationRange[0] || course.durationDays > filters.durationRange[1]) {
        return false
      }
      // Course type filter
      if (filters.courseTypes.length > 0 && !filters.courseTypes.includes(course.category)) {
        return false
      }
      // Difficulty filter
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(course.difficulty)) {
        return false
      }
      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const courseStartDate = new Date(course.startDate)
        const courseEndDate = new Date(course.endDate)
        if (filters.dateRange.from && courseEndDate < filters.dateRange.from) {
          return false
        }
        if (filters.dateRange.to && courseStartDate > filters.dateRange.to) {
          return false
        }
      }
      // Distance filter
      if (filters.nearMeOnly && course.distance > 50) {
        return false
      }
      if (course.distance > filters.maxDistance) {
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
      if (filters.environments.length > 0) {
        const hasMatchingEnvironment = filters.environments.some((env) => course.environments.includes(env))
        if (!hasMatchingEnvironment) {
          return false
        }
      }
      // Arenas filter
      if (filters.arenas.length > 0) {
        const hasMatchingArena = filters.arenas.some((arena) => course.arenas.includes(arena))
        if (!hasMatchingArena) {
          return false
        }
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
        filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        break
      case "Closest":
        if (userLocation) {
          filtered.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        } else {
          // If location not available, fall back to Most Popular
          filtered.sort((a, b) => b.students - a.students)
        }
        break
      case "Most Popular":
      default:
        filtered.sort((a, b) => b.students - a.students)
        break
    }

    return filtered
  }, [filters, sortBy, courses, searchQuery, userLocation])

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
      priceRange: [0, 1000],
      durationRange: [1, 40],
      courseTypes: [],
      difficulties: [],
      dateRange: undefined,
      maxDistance: 500,
      nearMeOnly: false,
      immersion: false,
      prerequisites: false,
      certifications: false,
      environments: [],
      arenas: [],
    })
    setFiltersOpen(false)
  }

  const hasActiveFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000 ||
    filters.durationRange[0] > 1 ||
    filters.durationRange[1] < 40 ||
    filters.courseTypes.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.dateRange?.from ||
    filters.dateRange?.to ||
    filters.maxDistance < 500 ||
    filters.nearMeOnly ||
    filters.immersion ||
    filters.prerequisites ||
    filters.certifications ||
    filters.environments.length > 0 ||
    filters.arenas.length > 0

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <Header />

      <FilterBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        hasActiveFilters={Boolean(hasActiveFilters)}
        clearFilters={clearFilters}
      />

      {/* Filters Slide-in Panel */}
      {filtersOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setFiltersOpen(false)} />

          {/* Slide-in Panel */}
          <div
            className={`fixed left-0 top-0 h-full w-full sm:w-[400px] bg-black border-r border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              filtersOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFiltersOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Show all filters on mobile, only additional filters on desktop */}
                {/* Course Type - Mobile Only */}
                <div className="space-y-3 md:hidden">
                  <h3 className="text-white font-medium">Course Type</h3>
                  <div className="space-y-3">
                    {[
                      { value: "Survival", label: "Survival" },
                      { value: "Subsistence", label: "Subsistence Living" },
                      { value: "Tactical", label: "Tactical Training" },
                    ].map((type) => (
                      <div key={type.value} className="flex items-center space-x-3">
                        <Checkbox
                          id={`mobile-type-${type.value}`}
                          checked={filters.courseTypes.includes(type.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                courseTypes: [...filters.courseTypes, type.value],
                              })
                            } else {
                              setFilters({
                                ...filters,
                                courseTypes: filters.courseTypes.filter((t) => t !== type.value),
                              })
                            }
                          }}
                          className="border-zinc-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                        />
                        <Label htmlFor={`mobile-type-${type.value}`} className="text-zinc-300 text-sm">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty - Mobile Only */}
                <div className="space-y-3 md:hidden">
                  <h3 className="text-white font-medium">Difficulty</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["Beginner", "Intermediate", "Advanced", "Expert"].map((difficulty) => (
                      <div key={difficulty} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-diff-${difficulty}`}
                          checked={filters.difficulties.includes(difficulty)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                difficulties: [...filters.difficulties, difficulty],
                              })
                            } else {
                              setFilters({
                                ...filters,
                                difficulties: filters.difficulties.filter((d) => d !== difficulty),
                              })
                            }
                          }}
                          className="border-zinc-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                        />
                        <Label htmlFor={`mobile-diff-${difficulty}`} className="text-zinc-300 text-sm">
                          {difficulty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration - Mobile Only */}
                <div className="space-y-3 md:hidden">
                  <h3 className="text-white font-medium">Duration</h3>
                  <div className="space-y-3">
                    <div className="text-sm text-zinc-300">
                      {filters.durationRange[0]} - {filters.durationRange[1]} Days
                    </div>
                    <Slider
                      value={filters.durationRange}
                      onValueChange={(value) => setFilters({ ...filters, durationRange: value as [number, number] })}
                      max={40}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Price - Mobile Only */}
                <div className="space-y-3 md:hidden">
                  <h3 className="text-white font-medium">Price</h3>
                  <div className="space-y-3">
                    <div className="text-sm text-zinc-300">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </div>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                      max={1000}
                      min={0}
                      step={25}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Date - Mobile Only */}
                <div className="space-y-3 md:hidden">
                  <h3 className="text-white font-medium">Date Range</h3>
                  <DatePicker
                    dateRange={filters.dateRange}
                    onDateRangeChange={(range) => setFilters({ ...filters, dateRange: range })}
                    placeholder="Select date range"
                  />
                </div>

                {/* Location - Mobile Only */}
                <div className="space-y-3 md:hidden">
                  <h3 className="text-white font-medium">Location</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="mobile-near-me"
                        checked={filters.nearMeOnly}
                        onCheckedChange={(checked) => setFilters({ ...filters, nearMeOnly: checked as boolean })}
                        className="border-zinc-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                      />
                      <Label htmlFor="mobile-near-me" className="text-zinc-300 text-sm">
                        Within 50 miles of me
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-zinc-300">Maximum Distance: {filters.maxDistance} miles</div>
                      <Slider
                        value={[filters.maxDistance]}
                        onValueChange={(value) => setFilters({ ...filters, maxDistance: value[0] })}
                        max={500}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Length Filter - Desktop and Mobile */}
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Length</h3>
                  <div className="space-y-3">
                    <div className="text-sm text-zinc-300">
                      {filters.durationRange[0]} - {filters.durationRange[1]} Days
                    </div>
                    <Slider
                      value={filters.durationRange}
                      onValueChange={(value) => setFilters({ ...filters, durationRange: value as [number, number] })}
                      max={40}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Immersion - Desktop and Mobile */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Immersion</h3>
                      <p className="text-xs text-zinc-400 mt-1">Courses that completely remove you from civilization</p>
                    </div>
                    <Switch
                      checked={filters.immersion}
                      onCheckedChange={(checked) => setFilters({ ...filters, immersion: checked })}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  </div>
                </div>

                {/* Prerequisites - Desktop and Mobile */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Prerequisites</h3>
                      <p className="text-xs text-zinc-400 mt-1">Courses with prerequisite courses or skills required</p>
                    </div>
                    <Switch
                      checked={filters.prerequisites}
                      onCheckedChange={(checked) => setFilters({ ...filters, prerequisites: checked })}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  </div>
                </div>

                {/* Certifications - Desktop and Mobile */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Certifications offered</h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Courses that offer certifications upon their completion
                      </p>
                    </div>
                    <Switch
                      checked={filters.certifications}
                      onCheckedChange={(checked) => setFilters({ ...filters, certifications: checked })}
                      className="data-[state=checked]:bg-teal-600"
                    />
                  </div>
                </div>

                {/* Environments - Desktop and Mobile */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Environments</h3>
                    <p className="text-xs text-zinc-400 mb-4">
                      Filter by a specific ecological environment or training arena
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium text-zinc-300 mb-3 uppercase tracking-wider">BIOME</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Arctic Tundra",
                            "Alpine Tundra",
                            "Coniferous Forest",
                            "Grassland",
                            "Deciduous Forest",
                            "Desert",
                            "Tropical Rain Forest",
                            "Urban Sprawl",
                          ].map((environment) => (
                            <div key={environment} className="flex items-center space-x-2">
                              <Checkbox
                                id={`mobile-env-${environment.replace(/\s+/g, "-")}`}
                                checked={filters.environments.includes(environment)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFilters({
                                      ...filters,
                                      environments: [...filters.environments, environment],
                                    })
                                  } else {
                                    setFilters({
                                      ...filters,
                                      environments: filters.environments.filter((e) => e !== environment),
                                    })
                                  }
                                }}
                                className="border-zinc-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                              />
                              <Label
                                htmlFor={`mobile-env-${environment.replace(/\s+/g, "-")}`}
                                className="text-xs text-zinc-300"
                              >
                                {environment}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-medium text-zinc-300 mb-3 uppercase tracking-wider">ARENA</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {["Indoor Range", "Outdoor Range", "Gym", "Classroom", "Road & Track"].map((arena) => (
                            <div key={arena} className="flex items-center space-x-2">
                              <Checkbox
                                id={`mobile-arena-${arena.replace(/\s+/g, "-")}`}
                                checked={filters.arenas.includes(arena)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFilters({
                                      ...filters,
                                      arenas: [...filters.arenas, arena],
                                    })
                                  } else {
                                    setFilters({
                                      ...filters,
                                      arenas: filters.arenas.filter((a) => a !== arena),
                                    })
                                  }
                                }}
                                className="border-zinc-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                              />
                              <Label
                                htmlFor={`mobile-arena-${arena.replace(/\s+/g, "-")}`}
                                className="text-xs text-zinc-300"
                              >
                                {arena}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setFiltersOpen(false)}
                  className="flex-1 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                >
                  Clear
                </Button>
                <Button onClick={() => setFiltersOpen(false)} className="flex-1 bg-red-700 hover:bg-red-700 text-white">
                  Show {filteredCourses.length} courses
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Course Count + Heading Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-white">{filteredCourses.length}</span>{" "}
              <span className="text-zinc-400">Courses</span>
            </h1>
            {hasActiveFilters && <p className="text-zinc-400 text-sm">Filtered from {courses.length} total courses</p>}
          </div>
          <div className="flex flex-col items-end w-full max-w-md">
            <form
              onSubmit={e => e.preventDefault()}
              className="relative w-full"
            >
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full rounded-lg bg-zinc-900 pl-10 py-5 text-lg border-zinc-700 text-white placeholder:text-zinc-400"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 pb-12">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg mb-4">No courses found matching your filters.</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onBookmarkToggle={handleBookmarkToggle}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

