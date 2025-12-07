import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-white">
      <div className="text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold mb-2">Course not found</h2>
        <p className="text-zinc-400 mb-4">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link
          href="/marketplace/courses"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg inline-block"
        >
          Browse all courses
        </Link>
      </div>
    </div>
  )
} 