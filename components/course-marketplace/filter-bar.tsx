import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "@/components/ui/date-picker"
import {
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  X,
} from "lucide-react"
import type { DateRange } from "react-day-picker"

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

interface FilterBarProps {
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  sortBy: string
  setSortBy: (sort: string) => void
  filters: Filters
  setFilters: (filters: Filters) => void
  filtersOpen: boolean
  setFiltersOpen: (open: boolean) => void
  hasActiveFilters: boolean
  clearFilters: () => void
}

export function FilterBar({
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  filters,
  setFilters,
  filtersOpen,
  setFiltersOpen,
  hasActiveFilters,
  clearFilters,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            {/* Desktop Filter Buttons - Hidden on Mobile */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Near Me Filter */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                      filters.nearMeOnly ? "border-red-700 bg-red-900/20" : ""
                    }`}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Near Me
                    {filters.nearMeOnly && (
                      <Badge variant="secondary" className="ml-2 bg-red-700 text-white">
                        1
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-zinc-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Location Filters</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="near-me"
                        checked={filters.nearMeOnly}
                        onCheckedChange={(checked) => setFilters({ ...filters, nearMeOnly: checked as boolean })}
                      />
                      <Label htmlFor="near-me" className="text-zinc-300">
                        Within 50 miles of me
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Maximum Distance: {filters.maxDistance} miles</Label>
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
                </DialogContent>
              </Dialog>

              {/* Dates Filter */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                      filters.dateRange?.from || filters.dateRange?.to ? "border-red-700 bg-red-900/20" : ""
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Dates
                    {(filters.dateRange?.from || filters.dateRange?.to) && (
                      <Badge variant="secondary" className="ml-2 bg-red-700 text-white">
                        1
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-zinc-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Date Range</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <DatePicker
                      dateRange={filters.dateRange}
                      onDateRangeChange={(range) => setFilters({ ...filters, dateRange: range })}
                      placeholder="Select date range"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              {/* Price Filter */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                      filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? "border-red-700 bg-red-900/20" : ""
                    }`}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Price
                    {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) && (
                      <Badge variant="secondary" className="ml-2 bg-red-700 text-white">
                        1
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-zinc-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Price Range</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-300">
                        Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </Label>
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
                </DialogContent>
              </Dialog>

              {/* Difficulty Filter */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                      filters.difficulties.length > 0 ? "border-red-700 bg-red-900/20" : ""
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Difficulty
                    {filters.difficulties.length > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-red-700 text-white">
                        {filters.difficulties.length}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-zinc-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">Difficulty Level</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {["Beginner", "Moderate", "Advanced"].map((difficulty) => (
                      <div key={difficulty} className="flex items-center space-x-2">
                        <Checkbox
                          id={difficulty}
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
                        />
                        <Label htmlFor={difficulty} className="text-zinc-300">
                          {difficulty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                  filters.immersion ||
                  filters.prerequisites ||
                  filters.certifications ||
                  filters.environments.length > 0 ||
                  filters.arenas.length > 0
                    ? "border-red-700 bg-red-900/20"
                    : ""
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                More Filters
                {(filters.immersion ||
                  filters.prerequisites ||
                  filters.certifications ||
                  filters.environments.length > 0 ||
                  filters.arenas.length > 0) && (
                  <Badge variant="secondary" className="ml-2 bg-red-700 text-white">
                    {
                      [
                        filters.immersion,
                        filters.prerequisites,
                        filters.certifications,
                        ...filters.environments,
                        ...filters.arenas,
                      ].filter(Boolean).length
                    }
                  </Badge>
                )}
              </Button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                  hasActiveFilters ? "border-red-700 bg-red-900/20" : ""
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-red-700 text-white">
                    {
                      [
                        filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
                        filters.durationRange[0] > 1 || filters.durationRange[1] < 40,
                        ...filters.courseTypes,
                        ...filters.difficulties,
                        Boolean(filters.dateRange?.from) || Boolean(filters.dateRange?.to),
                        filters.nearMeOnly,
                        filters.immersion,
                        filters.prerequisites,
                        filters.certifications,
                        ...filters.environments,
                        ...filters.arenas,
                      ].filter(Boolean).length
                    }
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                >
                  <span className="hidden sm:inline">{sortBy}</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border-zinc-800">
                <DropdownMenuItem
                  onClick={() => setSortBy("Most Popular")}
                  className="text-zinc-300 hover:bg-zinc-800"
                >
                  Most Popular
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("Price: Low to High")}
                  className="text-zinc-300 hover:bg-zinc-800"
                >
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("Price: High to Low")}
                  className="text-zinc-300 hover:bg-zinc-800"
                >
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("Closest")}
                  className="text-zinc-300 hover:bg-zinc-800"
                >
                  Closest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Newest")} className="text-zinc-300 hover:bg-zinc-800">
                  Newest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Toggle */}
            <div className="flex border border-zinc-700 rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-r-none ${viewMode === "grid" ? "bg-zinc-700" : "bg-transparent hover:bg-zinc-800"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-l-none ${viewMode === "list" ? "bg-zinc-700" : "bg-transparent hover:bg-zinc-800"}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 