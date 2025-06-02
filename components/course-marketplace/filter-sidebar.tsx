import { Filters } from './types'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "@/components/ui/date-picker"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"
import { DateRange } from "react-day-picker"

interface FilterSidebarProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
  onClearFilters: () => void
}

export function FilterSidebar({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) {
  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleDurationChange = (value: number[]) => {
    onFilterChange({ ...filters, durationRange: [value[0], value[1]] })
  }

  const handleDistanceChange = (value: number[]) => {
    onFilterChange({ ...filters, maxDistance: value[0] })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFilterChange({ ...filters, dateRange: range })
  }

  const handleSwitchChange = (key: keyof Filters, value: boolean) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const handleCheckboxChange = (key: keyof Filters, value: string) => {
    const currentValues = filters[key] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    onFilterChange({ ...filters, [key]: newValues })
  }

  return (
    <div className="w-64 p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Price Range</Label>
          <Slider
            defaultValue={filters.priceRange}
            max={1000}
            step={50}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        <div>
          <Label>Duration (Days)</Label>
          <Slider
            defaultValue={filters.durationRange}
            max={14}
            step={1}
            onValueChange={handleDurationChange}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{filters.durationRange[0]} days</span>
            <span>{filters.durationRange[1]} days</span>
          </div>
        </div>

        <div>
          <Label>Distance</Label>
          <Slider
            defaultValue={[filters.maxDistance]}
            max={500}
            step={10}
            onValueChange={handleDistanceChange}
          />
          <div className="text-sm text-gray-500">
            Up to {filters.maxDistance} miles
          </div>
        </div>

        <div>
          <Label>Date Range</Label>
          <DatePicker
            dateRange={filters.dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.nearMeOnly}
              onCheckedChange={() => handleSwitchChange('nearMeOnly', !filters.nearMeOnly)}
            />
            <Label>Near Me Only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.immersion}
              onCheckedChange={() => handleSwitchChange('immersion', !filters.immersion)}
            />
            <Label>Immersion Courses</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.prerequisites}
              onCheckedChange={() => handleSwitchChange('prerequisites', !filters.prerequisites)}
            />
            <Label>With Prerequisites</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.certifications}
              onCheckedChange={() => handleSwitchChange('certifications', !filters.certifications)}
            />
            <Label>With Certifications</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Environments</Label>
          {['Urban Sprawl', 'Coniferous Forest', 'Deciduous Forest', 'Desert', 'Grassland', 'Alpine Tundra', 'Arctic Tundra', 'Tropical Rain Forest'].map((env) => (
            <div key={env} className="flex items-center space-x-2">
              <Checkbox
                id={`env-${env}`}
                checked={filters.environments.includes(env)}
                onCheckedChange={() => handleCheckboxChange('environments', env)}
              />
              <Label htmlFor={`env-${env}`}>{env}</Label>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Arenas</Label>
          {['Indoor Range', 'Outdoor Range', 'Classroom', 'Gym'].map((arena) => (
            <div key={arena} className="flex items-center space-x-2">
              <Checkbox
                id={`arena-${arena}`}
                checked={filters.arenas.includes(arena)}
                onCheckedChange={() => handleCheckboxChange('arenas', arena)}
              />
              <Label htmlFor={`arena-${arena}`}>{arena}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 