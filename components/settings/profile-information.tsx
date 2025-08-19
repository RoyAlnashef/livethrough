'use client'

import React, { useState, useEffect } from 'react'
import { ProfileData } from '@/lib/types/settings'
import { SettingsSection, SettingsInput, SettingsButton } from './index'
import { getUserProfile, updateUserProfile, uploadProfilePhoto } from '@/lib/profile-actions'
import { toast } from 'sonner'

interface ProfileInformationProps {
  initialData?: ProfileData
  onSave?: (data: ProfileData) => void
  loading?: boolean
}

export function ProfileInformation({ 
  initialData, 
  onSave, 
  loading = false 
}: ProfileInformationProps) {
  const [formData, setFormData] = useState<ProfileData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    bio: initialData?.bio || '',
    avatarUrl: initialData?.avatarUrl || ''
  })

  const [errors, setErrors] = useState<Partial<ProfileData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const result = await getUserProfile()
        if (result.success && result.data) {
          setFormData(result.data)
        } else if (result.error) {
          toast.error(result.error)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileData> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const result = await updateUserProfile(formData)
      if (result.success) {
        toast.success('Profile updated successfully!')
        onSave?.(formData)
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const result = await uploadProfilePhoto(file)
        if (result.success && result.avatarUrl) {
          setFormData(prev => ({ ...prev, avatarUrl: result.avatarUrl! }))
          toast.success('Profile photo updated successfully!')
        } else {
          toast.error(result.error || 'Failed to upload photo')
        }
      } catch (error) {
        console.error('Error uploading photo:', error)
        toast.error('An unexpected error occurred')
      }
    }
  }

  return (
    <SettingsSection 
      title="Profile Information"
      description="Update your personal information and profile photo"
    >
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-zinc-900 overflow-hidden">
              {formData.avatarUrl ? (
                <img 
                  src={formData.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h3 className="text-white font-medium">Profile Photo</h3>
            <p className="text-sm text-zinc-400">Upload a new profile photo</p>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsInput
            id="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
            placeholder="Enter your first name"
            required
            error={errors.firstName}
          />
          
          <SettingsInput
            id="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
            placeholder="Enter your last name"
            required
            error={errors.lastName}
          />
          
          <SettingsInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
            placeholder="Enter your email address"
            required
            error={errors.email}
          />
          
          <SettingsInput
            id="phone"
            label="Phone"
            type="tel"
            value={formData.phone || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
            placeholder="Enter your phone number"
            error={errors.phone}
          />
        </div>

        {/* Bio Field */}
                <div>
          <label className="block text-zinc-400 mb-2">Bio</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <SettingsButton
            onClick={handleSave}
            loading={isSubmitting || loading || isLoading}
            disabled={isSubmitting || loading || isLoading}
          >
            Save Changes
          </SettingsButton>
        </div>
      </div>
    </SettingsSection>
  )
} 