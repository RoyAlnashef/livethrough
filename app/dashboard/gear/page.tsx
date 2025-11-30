import { Breadcrumbs } from "@/components/dashboard/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Search, DollarSign, AlertTriangle } from "lucide-react"

export const metadata = {
  title: "Gear - Dashboard",
}

export default function GearPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Gear" },
        ]}
      />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Gear</h1>
          <p className="text-zinc-400 text-sm">
            Manage and track all equipment and gear inventory
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search gear..."
              className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-500"
            />
          </div>
          <Button className="bg-teal-700 hover:bg-teal-800 text-white">
            + Add Gear
          </Button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <Package className="w-4 h-4" />
              <span className="text-sm">Total Items</span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">156</div>
            <div className="text-xs text-zinc-500">Across all locations</div>
          </div>
          <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">Total Value</span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">$45,678</div>
            <div className="text-xs text-zinc-500">Equipment inventory</div>
          </div>
          <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Low Stock</span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">8</div>
            <div className="text-xs text-zinc-500">Items need restocking</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-zinc-400 mb-4">
            No gear items found. Add your first item to get started.
          </div>
        </div>
      </div>
    </div>
  )
} 