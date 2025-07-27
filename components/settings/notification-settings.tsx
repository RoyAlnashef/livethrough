'use client'

import React, { useState } from 'react'
import type { NotificationSettings } from '@/lib/types/settings'
import { SettingsSection, SettingsToggle, SettingsButton } from './index'

interface NotificationSettingsProps {
  initialSettings?: NotificationSettings
  onSave?: (settings: NotificationSettings) => void
  loading?: boolean
}

export function NotificationSettings({ 
  initialSettings, 
  onSave, 
  loading = false 
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: initialSettings?.emailNotifications ?? true,
    courseUpdates: initialSettings?.courseUpdates ?? true,
    marketingEmails: initialSettings?.marketingEmails ?? false,
    systemAnnouncements: initialSettings?.systemAnnouncements ?? true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await onSave?.(settings)
    } catch (error) {
      console.error('Error saving notification settings:', error)
    } finally {
      setIsSubmitting(false)
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
            disabled={loading}
          />

          <SettingsToggle
            id="courseUpdates"
            label="Course Updates"
            description="Get notified when new content is added to your courses"
            checked={settings.courseUpdates}
            onChange={(checked) => handleToggle('courseUpdates', checked)}
            disabled={loading}
          />

          <SettingsToggle
            id="systemAnnouncements"
            label="System Announcements"
            description="Receive important platform updates and announcements"
            checked={settings.systemAnnouncements}
            onChange={(checked) => handleToggle('systemAnnouncements', checked)}
            disabled={loading}
          />

          <SettingsToggle
            id="marketingEmails"
            label="Marketing Emails"
            description="Receive promotional content and special offers (optional)"
            checked={settings.marketingEmails}
            onChange={(checked) => handleToggle('marketingEmails', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end">
          <SettingsButton
            onClick={handleSave}
            loading={isSubmitting || loading}
            disabled={isSubmitting || loading}
          >
            Save Preferences
          </SettingsButton>
        </div>
      </div>
    </SettingsSection>
  )
} 