'use client'

import { useState, useEffect } from 'react'
import { SettingsSkeleton } from '@/components/account'
import {
  SettingsNavigation,
  ProfileInformation,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  DangerZone
} from '@/components/settings'

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('profile')

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

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileInformation />
        )
      case 'notifications':
        return (
          <NotificationSettings 
            onSave={(settings) => console.log('Notification settings saved:', settings)}
          />
        )
      case 'privacy':
        return (
          <PrivacySettings 
            onSave={(settings) => console.log('Privacy settings saved:', settings)}
          />
        )
      case 'security':
        return (
          <SecuritySettings 
            onSave={(settings) => console.log('Security settings saved:', settings)}
          />
        )
      case 'danger':
        return (
          <DangerZone 
            onDeleteAccount={(password) => console.log('Delete account with password:', password)}
            onExportData={() => console.log('Export data')}
          />
        )
              case 'legal':
          return (
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
              <div className="pb-4 mb-6 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-white">Legal Information</h2>
              </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium">Privacy Policy</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Learn about how we collect, use, and protect your personal information.
                  </p>
                </div>
                <button className="px-3 py-1 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors ml-4">
                  View Privacy Policy
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium">Terms of Service</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Read our terms and conditions for using the platform.
                  </p>
                </div>
                <button className="px-3 py-1 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors ml-4">
                  View Terms of Service
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium">Cookie Policy</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Understand how we use cookies and similar technologies.
                  </p>
                </div>
                <button className="px-3 py-1 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors ml-4">
                  View Cookie Policy
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <ProfileInformation 
            onSave={(data) => console.log('Profile saved:', data)}
          />
        )
    }
  }

  return (
    <div className="flex bg-black">
      {/* Desktop Navigation - Hidden on md and smaller */}
      <div className="hidden lg:block">
        <SettingsNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto pb-6 pt-0 lg:pt-6">
        <div className="max-w-4xl">
          {/* Mobile: Show all sections */}
          <div className="lg:hidden space-y-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="space-y-6">
              <ProfileInformation />
              <NotificationSettings 
                onSave={(settings) => console.log('Notification settings saved:', settings)}
              />
              <PrivacySettings 
                onSave={(settings) => console.log('Privacy settings saved:', settings)}
              />
              <SecuritySettings 
                onSave={(settings) => console.log('Security settings saved:', settings)}
              />
              <DangerZone 
                onDeleteAccount={(password) => console.log('Delete account with password:', password)}
                onExportData={() => console.log('Export data')}
              />
              {/* Legal Information for mobile */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
                <div className="pb-4 mb-6 border-b border-zinc-800">
                  <h2 className="text-lg font-semibold text-white">Legal Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Privacy Policy</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Learn about how we collect, use, and protect your personal information.
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors ml-4">
                      View Privacy Policy
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Terms of Service</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Read our terms and conditions for using the platform.
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors ml-4">
                      View Terms of Service
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Cookie Policy</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Understand how we use cookies and similar technologies.
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-teal-600 text-white rounded-sm hover:bg-teal-700 transition-colors ml-4">
                      View Cookie Policy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop: Show single section based on navigation */}
          <div className="hidden lg:block">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
} 