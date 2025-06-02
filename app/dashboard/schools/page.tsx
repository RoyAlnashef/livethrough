import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { School, Search, MapPin } from "lucide-react"

export const metadata = {
  title: "Schools - Dashboard",
}

export default function SchoolsPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Schools" },
        ]}
      />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Schools</h1>
          <p className="text-zinc-400 text-sm">
            Manage and view all registered schools
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search schools..."
              className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <Button className="bg-teal-700 hover:bg-teal-800 text-white">
            + Add School
          </Button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <School className="w-4 h-4" />
              <span className="text-sm">Total Schools</span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">18</div>
            <div className="text-xs text-zinc-500">Across 12 states</div>
          </div>
          <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Active Locations</span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">24</div>
            <div className="text-xs text-zinc-500">Training facilities</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-zinc-400 mb-4">
            No schools found. Add your first school to get started.
          </div>
        </div>
      </div>
    </div>
  )
} 