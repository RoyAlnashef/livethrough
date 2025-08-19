import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Filter,
  ChevronDown,
} from "lucide-react"
import { Filters } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface FilterBarProps {
  sortBy: string
  setSortBy: (sort: string) => void
  filters: Filters
  setFilters: (filters: Filters) => void
  filtersOpen: boolean
  setFiltersOpen: (open: boolean) => void
  hasActiveFilters: boolean
  clearFilters: () => void
  environmentOptions: string[]
  difficultyOptions: string[]
  minPrice: number
  maxPrice: number
  onPriceSliderChange?: (value: [number, number]) => void
  hasUserSetPriceRange: boolean
  minDuration: number
  maxDuration: number
  onDurationSliderChange?: (value: [number, number]) => void
  hasUserSetDurationRange?: boolean
  courseTypeOptions: { id: string; name: string }[]
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export function FilterBar({
  sortBy,
  setSortBy,
  filters,
  setFilters,
  filtersOpen,
  setFiltersOpen,
  hasActiveFilters,
  clearFilters,
  environmentOptions,
  difficultyOptions,
  minPrice,
  maxPrice,
  onPriceSliderChange,
  hasUserSetPriceRange: _hasUserSetPriceRange,
  minDuration,
  maxDuration,
  onDurationSliderChange,
  hasUserSetDurationRange: _hasUserSetDurationRange,
  courseTypeOptions,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) {
  // Compute locally if not provided
  const hasUserSetPriceRange = typeof _hasUserSetPriceRange === 'boolean'
    ? _hasUserSetPriceRange
    : (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice);
  const hasUserSetDurationRange = typeof _hasUserSetDurationRange === 'boolean'
    ? _hasUserSetDurationRange
    : (filters.durationRange[0] > minDuration || filters.durationRange[1] < maxDuration);

  // Calculate the number of active filters accurately
  const filterCount = (
    (hasUserSetPriceRange ? 1 : 0) +
    (hasUserSetDurationRange ? 1 : 0) +
    filters.courseTypes.length +
    filters.difficulties.length +
    filters.environments.length +
    filters.arenas.length
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t md:sticky md:top-0 md:left-auto md:right-auto md:border-t-0 md:border-b border-zinc-800 bg-black pb-4 md:pb-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Desktop Filter Buttons - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Type Filter - Text Only */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                    filters.courseTypes.length > 0 ? "border-red-700 bg-red-900/20" : ""
                  }`}
                >
                  Type
                  {filters.courseTypes.length > 0 && (
                    <span className="ml-2 inline-block align-middle">
                      <span className="h-2 w-2 rounded-full bg-teal-500 inline-block"></span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-zinc-800" align="start">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Course Type</h4>
                  {courseTypeOptions.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
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
                      />
                      <Label htmlFor={type.id} className="text-zinc-300">
                        {type.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {/* Environment Filter - Text Only */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                    filters.environments.length > 0 ? "border-red-700 bg-red-900/20" : ""
                  }`}
                >
                  Environment
                  {filters.environments.length > 0 && (
                    <span className="ml-2 inline-block align-middle">
                      <span className="h-2 w-2 rounded-full bg-teal-500 inline-block"></span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-zinc-800" align="start">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Environments</h4>
                  <div className="max-h-[300px] overflow-y-auto">
                    {environmentOptions.map((env) => (
                      <div key={env} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`env-bar-${env}`}
                          checked={filters.environments.includes(env)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                environments: [...filters.environments, env],
                              })
                            } else {
                              setFilters({
                                ...filters,
                                environments: filters.environments.filter((e) => e !== env),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`env-bar-${env}`} className="text-zinc-300">
                          {env}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Price Filter - Text Only */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                    hasUserSetPriceRange ? "border-red-700 bg-red-900/20" : ""
                  }`}
                >
                  Price
                  {hasUserSetPriceRange && (
                    <span className="ml-2 inline-block align-middle">
                      <span className="h-2 w-2 rounded-full bg-teal-500 inline-block"></span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-zinc-800" align="start">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Price Range</h4>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">
                      Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </Label>
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
              </PopoverContent>
            </Popover>

            {/* Difficulty Filter - Text Only */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                    filters.difficulties.length > 0 ? "border-red-700 bg-red-900/20" : ""
                  }`}
                >
                  Difficulty
                  {filters.difficulties.length > 0 && (
                    <span className="ml-2 inline-block align-middle">
                      <span className="h-2 w-2 rounded-full bg-teal-500 inline-block"></span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-zinc-800" align="start">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Difficulty Level</h4>
                  {difficultyOptions.map((difficulty) => (
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
              </PopoverContent>
            </Popover>

            {/* Duration Filter - Text Only */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 ${
                    hasUserSetDurationRange ? "border-red-700 bg-red-900/20" : ""
                  }`}
                >
                  Duration
                  {hasUserSetDurationRange && (
                    <span className="ml-2 inline-block align-middle">
                      <span className="h-2 w-2 rounded-full bg-teal-500 inline-block"></span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-zinc-800" align="start">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Duration Range</h4>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">
                      Duration: {filters.durationRange[0]} - {filters.durationRange[1]} days
                    </Label>
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
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-teal-400 hover:text-teal-300 hover:bg-teal-900/20"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Mobile: Search left, Filters right */}
          <div className="flex md:hidden w-full gap-3">
            <div className="flex-1">
              <form onSubmit={e => e.preventDefault()} className="relative w-full">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="w-full rounded-sm bg-zinc-900 pl-10 py-2 text-base border-zinc-700 text-white placeholder:text-zinc-400 pr-12"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
            <div className="flex-shrink-0 flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`h-10 px-5 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white bg-black border-1 font-semibold transition-colors duration-150 flex items-center justify-center ${
                  hasActiveFilters ? "border-red-700 bg-red-900/20" : ""
                }`}
                style={{ minWidth: '90px' }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {filterCount > 0 && (
                  <Badge variant="secondary" className="rounded-sm ml-2 bg-teal-700 text-white px-2 py-0.5 h-6 min-w-6">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Sort Dropdown - Only show on md and up */}
          <div className="items-center space-x-3 hidden md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                >
                  <span>{sortBy}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border-zinc-800">
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
                <DropdownMenuItem onClick={() => setSortBy("Newest")} className="text-zinc-300 hover:bg-zinc-800">
                  Newest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
} 