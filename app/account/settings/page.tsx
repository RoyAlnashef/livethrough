'use client'

import { useState, useEffect } from 'react'
import { SettingsSkeleton } from '@/components/account'

export default function Settings() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for settings data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <SettingsSkeleton />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      
      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
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

        {/* Notification Settings */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Email Notifications</p>
                <p className="text-sm text-zinc-400">Receive updates about your courses and account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Course Updates</p>
                <p className="text-sm text-zinc-400">Get notified when new content is added to your courses</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-4">Privacy Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Profile Visibility</p>
                <p className="text-sm text-zinc-400">Allow other users to view your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-zinc-900 p-6 rounded-lg border border-red-600">
          <h2 className="text-lg font-semibold text-white mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div>
              <p className="text-white mb-2">Delete Account</p>
              <p className="text-sm text-zinc-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 