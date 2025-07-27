import React from 'react'

export interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  bio?: string
  avatarUrl?: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  courseUpdates: boolean
  marketingEmails: boolean
  systemAnnouncements: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  courseActivityVisibility: 'public' | 'private'
  allowDataUsage: boolean
  allowAnalytics: boolean
}

export interface SecuritySettings {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  twoFactorEnabled: boolean
}

export interface SettingsFormData {
  profile: ProfileData
  notifications: NotificationSettings
  privacy: PrivacySettings
  security: SecuritySettings
}

export interface SettingsSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export interface SettingsToggleProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export interface SettingsInputProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'password'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

export interface SettingsButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  className?: string
} 