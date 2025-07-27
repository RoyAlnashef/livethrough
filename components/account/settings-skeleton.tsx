import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
  return (
    <div className="flex h-screen bg-black">
      {/* Navigation Skeleton */}
      <div className="w-64 p-6 space-y-2">
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Profile Information Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 