'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-white">
      <div className="text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-zinc-400 mb-4">Failed to load course details.</p>
        <button
          onClick={reset}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  )
} 