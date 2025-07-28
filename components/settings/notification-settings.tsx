'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { NotificationSettings } from '@/lib/types/settings'
import { SettingsSection, SettingsToggle } from './index'
import { getNotificationSettings, updateNotificationSetting } from '@/lib/notification-actions'

interface NotificationSettingsProps {
  initialSettings?: NotificationSettings
  loading?: boolean
}

export function NotificationSettings({ 
  initialSettings, 
  loading = false 
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: initialSettings?.emailNotifications ?? true,
    courseUpdates: initialSettings?.courseUpdates ?? true,
    marketingEmails: initialSettings?.marketingEmails ?? false,
    systemAnnouncements: initialSettings?.systemAnnouncements ?? true
  })

  const [isLoading, setIsLoading] = useState(false)

  // Load settings from backend if not provided
  useEffect(() => {
    const loadSettings = async () => {
      if (!initialSettings) {
        setIsLoading(true)
        try {
          const backendSettings = await getNotificationSettings()
          if (backendSettings) {
            setSettings(backendSettings)
          }
        } catch (error) {
          console.error('Error loading notification settings:', error)
          toast.error('Failed to load notification settings')
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadSettings()
  }, [initialSettings])

  const handleToggle = async (key: keyof NotificationSettings, value: boolean) => {
    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Save to backend
    try {
      const result = await updateNotificationSetting(key, value)
      if (!result.success) {
        // Revert on error
        setSettings(prev => ({ ...prev, [key]: !value }))
        toast.error(result.error || 'Failed to update setting')
      } else {
        toast.success('Setting updated successfully')
      }
    } catch (error) {
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: !value }))
      console.error('Error updating notification setting:', error)
      toast.error('Failed to update setting')
    }
  }



  return (
    <SettingsSection 
      title="Notification Settings"
      description="Manage your email notification preferences"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <SettingsToggle
            id="emailNotifications"
            label="Email Notifications"
            description="Receive updates about your courses and account"
            checked={settings.emailNotifications}
            onChange={(checked) => handleToggle('emailNotifications', checked)}
            disabled={loading || isLoading}
          />

          <SettingsToggle
            id="courseUpdates"
            label="Bookmarked Courses"
            description="Get notified when your bookmarked courses get updated"
            checked={settings.courseUpdates}
            onChange={(checked) => handleToggle('courseUpdates', checked)}
            disabled={loading || isLoading}
          />

          <SettingsToggle
            id="systemAnnouncements"
            label="System Announcements"
            description="Receive important platform updates and announcements"
            checked={settings.systemAnnouncements}
            onChange={(checked) => handleToggle('systemAnnouncements', checked)}
            disabled={loading || isLoading}
          />

          <SettingsToggle
            id="marketingEmails"
            label="Marketing Emails"
            description="Receive promotional content and special offers (optional)"
            checked={settings.marketingEmails}
            onChange={(checked) => handleToggle('marketingEmails', checked)}
            disabled={loading || isLoading}
          />
        </div>


      </div>
    </SettingsSection>
  )
} 