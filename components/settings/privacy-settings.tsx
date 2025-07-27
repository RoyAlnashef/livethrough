'use client'

import React, { useState } from 'react'
import type { PrivacySettings } from '@/lib/types/settings'
import { SettingsSection, SettingsToggle, SettingsButton } from './index'

interface PrivacySettingsProps {
  initialSettings?: PrivacySettings
  onSave?: (settings: PrivacySettings) => void
  loading?: boolean
}

export function PrivacySettings({ 
  initialSettings, 
  onSave, 
  loading = false 
}: PrivacySettingsProps) {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: initialSettings?.profileVisibility ?? 'private',
    courseActivityVisibility: initialSettings?.courseActivityVisibility ?? 'private',
    allowDataUsage: initialSettings?.allowDataUsage ?? true,
    allowAnalytics: initialSettings?.allowAnalytics ?? true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleVisibilityChange = (key: 'profileVisibility' | 'courseActivityVisibility', value: 'public' | 'private') => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await onSave?.(settings)
    } catch (error) {
      console.error('Error saving privacy settings:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SettingsSection 
      title="Privacy Settings"
      description="Control your privacy and data usage preferences"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-white font-medium">Profile Visibility</label>
              <p className="text-sm text-zinc-400 mt-1">Control who can see your profile information</p>
            </div>
            <div className="flex gap-4 ml-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={settings.profileVisibility === 'public'}
                  onChange={(e) => handleVisibilityChange('profileVisibility', e.target.value as 'public' | 'private')}
                  className="mr-2"
                />
                <span className="text-white">Public</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={settings.profileVisibility === 'private'}
                  onChange={(e) => handleVisibilityChange('profileVisibility', e.target.value as 'public' | 'private')}
                  className="mr-2"
                />
                <span className="text-white">Private</span>
              </label>
            </div>
          </div>

          {/* Course Activity Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-white font-medium">Course Activity Visibility</label>
              <p className="text-sm text-zinc-400 mt-1">Control who can see your course activity and bookmarks</p>
            </div>
            <div className="flex gap-4 ml-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="courseActivityVisibility"
                  value="public"
                  checked={settings.courseActivityVisibility === 'public'}
                  onChange={(e) => handleVisibilityChange('courseActivityVisibility', e.target.value as 'public' | 'private')}
                  className="mr-2"
                />
                <span className="text-white">Public</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="courseActivityVisibility"
                  value="private"
                  checked={settings.courseActivityVisibility === 'private'}
                  onChange={(e) => handleVisibilityChange('courseActivityVisibility', e.target.value as 'public' | 'private')}
                  className="mr-2"
                />
                <span className="text-white">Private</span>
              </label>
            </div>
          </div>

          <SettingsToggle
            id="allowDataUsage"
            label="Allow Data Usage"
            description="Allow us to use your data to improve our services"
            checked={settings.allowDataUsage}
            onChange={(checked) => handleToggle('allowDataUsage', checked)}
            disabled={loading}
          />

          <SettingsToggle
            id="allowAnalytics"
            label="Analytics & Performance"
            description="Help us improve by allowing analytics and performance monitoring"
            checked={settings.allowAnalytics}
            onChange={(checked) => handleToggle('allowAnalytics', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end">
          <SettingsButton
            onClick={handleSave}
            loading={isSubmitting || loading}
            disabled={isSubmitting || loading}
          >
            Save Privacy Settings
          </SettingsButton>
        </div>
      </div>
    </SettingsSection>
  )
} 