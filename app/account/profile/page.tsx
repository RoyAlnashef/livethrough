export default function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      
      <div className="bg-zinc-900 p-6 rounded-lg">
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-zinc-800"></div>
            <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">
              Change Photo
            </button>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 mb-2">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-2">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Phone"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 