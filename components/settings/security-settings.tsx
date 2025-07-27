'use client'

import React, { useState } from 'react'
import type { SecuritySettings } from '@/lib/types/settings'
import { SettingsSection, SettingsInput, SettingsButton, SettingsToggle } from './index'

interface SecuritySettingsProps {
  initialSettings?: SecuritySettings
  onSave?: (settings: SecuritySettings) => void
  loading?: boolean
}

export function SecuritySettings({ 
  initialSettings, 
  onSave, 
  loading = false 
}: SecuritySettingsProps) {
  const [formData, setFormData] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: initialSettings?.twoFactorEnabled ?? false
  })

  const [errors, setErrors] = useState<Partial<SecuritySettings>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return errors
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<SecuritySettings> = {}

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required'
      }

      const passwordErrors = validatePassword(formData.newPassword)
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors.join(', ')
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSave?.(formData)
      // Clear form after successful save
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      console.error('Error saving security settings:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggle = (key: keyof SecuritySettings, value: boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsSection 
      title="Security Settings"
      description="Manage your account security and password"
    >
      <div className="space-y-6">
        {/* Password Change Section */}
        <div className="space-y-4">
          <h3 className="text-white font-medium">Change Password</h3>
          
          <SettingsInput
            id="currentPassword"
            label="Current Password"
            type="password"
            value={formData.currentPassword || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, currentPassword: value }))}
            placeholder="Enter your current password"
            error={errors.currentPassword}
            disabled={loading}
          />

          <SettingsInput
            id="newPassword"
            label="New Password"
            type="password"
            value={formData.newPassword || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, newPassword: value }))}
            placeholder="Enter your new password"
            error={errors.newPassword}
            disabled={loading}
          />

          <SettingsInput
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
            placeholder="Confirm your new password"
            error={errors.confirmPassword}
            disabled={loading}
          />

          {/* Password Requirements */}
          {formData.newPassword && (
            <div className="bg-zinc-900 p-4 rounded-md">
              <h4 className="text-white font-medium mb-2">Password Requirements</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li className={formData.newPassword.length >= 8 ? 'text-teal-400' : ''}>
                  ✓ At least 8 characters long
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'text-teal-400' : ''}>
                  ✓ Contains uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.newPassword) ? 'text-teal-400' : ''}>
                  ✓ Contains lowercase letter
                </li>
                <li className={/\d/.test(formData.newPassword) ? 'text-teal-400' : ''}>
                  ✓ Contains number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? 'text-teal-400' : ''}>
                  ✓ Contains special character
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <SettingsToggle
            id="twoFactorEnabled"
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={formData.twoFactorEnabled}
            onChange={(checked) => handleToggle('twoFactorEnabled', checked)}
            disabled={loading}
          />
        </div>

        {/* Account Activity */}
        <div className="bg-zinc-900 p-4 rounded-md">
          <h4 className="text-white font-medium mb-2">Recent Account Activity</h4>
          <div className="space-y-2 text-sm text-zinc-400">
            <div className="flex justify-between">
              <span>Last login</span>
              <span>Today at 2:30 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Login location</span>
              <span>San Francisco, CA</span>
            </div>
            <div className="flex justify-between">
              <span>Device</span>
              <span>Chrome on Mac</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <SettingsButton
            onClick={handleSave}
            loading={isSubmitting || loading}
            disabled={isSubmitting || loading}
          >
            Update Security Settings
          </SettingsButton>
        </div>
      </div>
    </SettingsSection>
  )
} 