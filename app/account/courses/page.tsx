export default function MyCourses() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for course cards */}
        <div className="bg-zinc-900 rounded-lg overflow-hidden">
          <div className="aspect-video bg-zinc-800"></div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Course Title</h3>
            <p className="text-zinc-400 text-sm mb-4">Course description goes here...</p>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Progress: 0%</span>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 