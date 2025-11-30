import { Skeleton } from "@/components/ui/skeleton"

export function CourseCardSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />
      
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Price and location skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Difficulty and environment skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Duration skeleton */}
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

export function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index} 
          className="fade-in"
          style={{ 
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'both'
          }}
        >
          <CourseCardSkeleton />
        </div>
      ))}
    </div>
  )
} 