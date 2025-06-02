"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface DatePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  placeholder?: string
}

export function DatePicker({ dateRange, onDateRangeChange, placeholder = "Pick a date range" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder
    if (!range.to) return format(range.from, "MMM dd, yyyy")
    return `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd, yyyy")}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-black border-zinc-700 text-zinc-300 hover:bg-zinc-900"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(dateRange)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black border-zinc-800" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={2}
          className="bg-black"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-zinc-400",
            caption_label: "text-sm font-medium text-zinc-400",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 text-zinc-500 hover:text-zinc-300",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-zinc-500 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-zinc-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal text-zinc-300 hover:bg-zinc-800 hover:text-white aria-selected:opacity-100",
            day_selected: "bg-red-600 text-white hover:bg-red-700 hover:text-white focus:bg-red-600 focus:text-white",
            day_today: "bg-zinc-800 text-white",
            day_outside: "text-zinc-600 opacity-50",
            day_disabled: "text-zinc-600 opacity-50",
            day_range_middle: "aria-selected:bg-zinc-800 aria-selected:text-white",
            day_hidden: "invisible",
          }}
        />
        <div className="flex justify-between p-3 border-t border-zinc-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onDateRangeChange(undefined)
              setIsOpen(false)
            }}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Clear
          </Button>
          <Button size="sm" onClick={() => setIsOpen(false)} className="bg-red-600 hover:bg-red-700 text-white">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
