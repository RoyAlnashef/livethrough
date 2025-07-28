'use client'

import React, { useState, useEffect } from 'react'
import type { PrivacySettings } from '@/lib/types/settings'
import { SettingsSection, SettingsToggle } from './index'
import { getPrivacySettings, updatePrivacySetting } from '@/lib/privacy-actions'
import { toast } from 'sonner'

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
    allowDataUsage: true,
    allowAnalytics: true
  })

  const [isLoading, setIsLoading] = useState(true)

  // Load privacy settings on component mount
  useEffect(() => {
    const loadPrivacySettings = async () => {
      try {
        const result = await getPrivacySettings()
        if (result.success && result.data) {
          setSettings(result.data)
        } else if (result.error) {
          console.error('Failed to load privacy settings:', result.error)
          toast.error('Failed to load privacy settings')
        }
      } catch (error) {
        console.error('Error loading privacy settings:', error)
        toast.error('Failed to load privacy settings')
      } finally {
        setIsLoading(false)
      }
    }

    loadPrivacySettings()
  }, [])

  const handleToggle = async (key: keyof PrivacySettings, value: boolean) => {
    // Optimistic update
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Save to backend
    try {
      const result = await updatePrivacySetting(key, value)
      if (!result.success) {
        // Revert on error
        setSettings(prev => ({ ...prev, [key]: !value }))
        toast.error(result.error || 'Failed to update setting')
      } else {
        toast.success('Setting updated successfully')
        onSave?.(settings)
      }
    } catch (error) {
      // Revert on error
      setSettings(prev => ({ ...prev, [key]: !value }))
      console.error('Error updating privacy setting:', error)
      toast.error('Failed to update setting')
    }
  }

  if (isLoading) {
    return (
      <SettingsSection 
        title="Privacy Settings"
        description="Control your privacy and data usage preferences"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </SettingsSection>
    )
  }

  return (
    <SettingsSection 
      title="Privacy Settings"
      description="Control your privacy and data usage preferences"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <SettingsToggle
            id="allowDataUsage"
            label="Allow Data Usage"
            description="Allow us to use your data to improve our services"
            checked={settings.allowDataUsage}
            onChange={(checked) => handleToggle('allowDataUsage', checked)}
            disabled={loading || isLoading}
          />

          <SettingsToggle
            id="allowAnalytics"
            label="Analytics & Performance"
            description="Help us improve by allowing analytics and performance monitoring"
            checked={settings.allowAnalytics}
            onChange={(checked) => handleToggle('allowAnalytics', checked)}
            disabled={loading || isLoading}
          />
        </div>
      </div>
    </SettingsSection>
  )
} 