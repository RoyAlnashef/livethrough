'use client'

import { useState, useEffect } from 'react'
import { SettingsSkeleton } from '@/components/account'
import {
  ProfileInformation,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  DangerZone
} from '@/components/settings'

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
        <ProfileInformation 
          onSave={(data) => console.log('Profile saved:', data)}
        />
        
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
      </div>
    </div>
  )
} 