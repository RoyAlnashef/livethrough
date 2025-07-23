import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Filters {
  priceRange: [number, number]
  durationRange: [number, number]
  courseTypes: string[]
  difficulties: string[]
  environments: string[]
  arenas: string[]
}

interface FilterSidebarProps {
  filters: Filters
  setFilters: (filters: Filters) => void
  clearFilters: () => void
  filteredCoursesCount: number
  onClose: () => void
  environmentOptions: string[]
  difficultyOptions: string[]
  minPrice?: number
  maxPrice?: number
  onPriceSliderChange?: (value: [number, number]) => void
  minDuration?: number
  maxDuration?: number
  onDurationSliderChange?: (value: [number, number]) => void
  courseTypeOptions: { id: string; name: string }[]
}

export function FilterSidebar({ filters, setFilters, clearFilters, filteredCoursesCount, onClose, environmentOptions, difficultyOptions, minPrice = 0, maxPrice = 1000, onPriceSliderChange, minDuration = 1, maxDuration = 40, onDurationSliderChange, courseTypeOptions }: FilterSidebarProps) {
  // Compute hasUserSetPriceRange and hasUserSetDurationRange dynamically
  const hasUserSetPriceRange = filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice;
  const hasUserSetDurationRange = filters.durationRange[0] > minDuration || filters.durationRange[1] < maxDuration;

  const hasActiveFilters =
    hasUserSetPriceRange ||
    hasUserSetDurationRange ||
    filters.courseTypes.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.environments.length > 0 ||
    filters.arenas.length > 0

  return (
    <div
      className={`fixed left-0 top-0 h-full w-full sm:w-[400px] bg-black border-r border-zinc-800 z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden translate-x-0`}
    >
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-6">
          {/* Course Type Section */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Course Type</h3>
            <div className="space-y-3">
              {courseTypeOptions.map((type) => (
                <div key={type.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`mobile-type-${type.id}`}
                    checked={filters.courseTypes.includes(type.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filters,
                          courseTypes: [...filters.courseTypes, type.id],
                        })
                      } else {
                        setFilters({
                          ...filters,
                          courseTypes: filters.courseTypes.filter((t) => t !== type.id),
                        })
                      }
                    }}
                    className="border-zinc-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                  />
                  <Label htmlFor={`mobile-type-${type.id}`} className="text-zinc-300 text-sm">
                    {type.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          {/* Environment Section (Hard-coded) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Environments</h3>
              <p className="text-xs text-zinc-400 mb-4">
                Filter by a specific ecological environment
              </p>
              <div className="grid grid-cols-2 gap-2">
                {environmentOptions.map((environment) => (
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
          </div>

          {/* Price Section */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Price</h3>
            <div className="space-y-3">
              <div className="text-sm text-zinc-300">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
                {hasUserSetPriceRange && (
                  <span className="ml-2 inline-block align-middle">
                    <span className="h-2 w-2 rounded-full bg-teal-500 inline-block"></span>
                  </span>
                )}
              </div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => {
                  if (onPriceSliderChange) {
                    onPriceSliderChange(value as [number, number])
                  } else {
                    setFilters({ ...filters, priceRange: value as [number, number] })
                  }
                }}
                max={maxPrice}
                min={minPrice}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Difficulty Section */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Difficulty</h3>
            <div className="grid grid-cols-2 gap-3">
              {difficultyOptions.map((difficulty) => (
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

          {/* Duration Section */}
          <div className="space-y-3">
            <h3 className="text-white font-medium">Duration</h3>
            <div className="space-y-3">
              {minDuration === 1 && maxDuration === 40 ? (
                <div className="h-6 bg-zinc-800 rounded w-1/2 animate-pulse" />
              ) : (
                <>
                  <div className="text-sm text-zinc-300">
                    {filters.durationRange[0]} - {filters.durationRange[1]} days
                    {hasUserSetDurationRange && (
                      <span className="ml-2 inline-block align-middle">
                        <span className="h-2 w-2 rounded-full bg-teal-500 inline-block"></span>
                      </span>
                    )}
                  </div>
                  <Slider
                    value={filters.durationRange}
                    onValueChange={(value) => {
                      if (onDurationSliderChange) {
                        onDurationSliderChange(value as [number, number])
                      } else {
                        setFilters({ ...filters, durationRange: value as [number, number] })
                      }
                    }}
                    max={maxDuration}
                    min={minDuration}
                    step={1}
                    className="w-full"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-black px-6 pt-4 pb-8 border-t border-zinc-800 z-10">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={cn(
              "flex-1 border-zinc-700 bg-transparent text-zinc-300 transition-colors duration-200",
              hasActiveFilters
                ? "text-teal-500 hover:bg-zinc-800"
                : "text-zinc-500 cursor-not-allowed",
            )}
          >
            Clear
          </Button>
          <Button onClick={onClose} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
            {filteredCoursesCount} Courses
          </Button>
        </div>
      </div>
    </div>
  )
} 