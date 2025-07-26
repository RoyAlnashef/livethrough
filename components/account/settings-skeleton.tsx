import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 fade-in">
      {/* Title skeleton */}
      <Skeleton className="h-8 w-32" />
      
      <div className="space-y-6">
        {/* Profile Information Section */}
        <div className="bg-zinc-900 p-6 rounded-lg">
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

        {/* Notification Settings Section */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="w-11 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <Skeleton className="h-6 w-36 mb-4" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="w-11 h-6 rounded-full" />
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-zinc-900 p-6 rounded-lg border border-red-600">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-4 w-80 mb-4" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 