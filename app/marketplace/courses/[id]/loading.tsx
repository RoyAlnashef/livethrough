export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <div className="text-lg">Loading course details...</div>
      </div>
    </div>
  )
} 