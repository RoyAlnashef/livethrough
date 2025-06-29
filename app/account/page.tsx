export default function AccountDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-zinc-400">Courses Enrolled</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div>
              <p className="text-zinc-400">Courses Completed</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <p className="text-zinc-400">No recent activity</p>
        </div>
      </div>
    </div>
  )
} 