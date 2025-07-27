'use client'

import React, { useState } from 'react'
import { SettingsSection, SettingsInput, SettingsButton } from './index'

interface DangerZoneProps {
  onDeleteAccount?: (password: string) => void
  onExportData?: () => void
  loading?: boolean
}

export function DangerZone({ 
  onDeleteAccount, 
  onExportData, 
  loading = false 
}: DangerZoneProps) {
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) return

    setIsDeleting(true)
    try {
      await onDeleteAccount?.(deletePassword)
      setShowDeleteConfirmation(false)
      setDeletePassword('')
    } catch (error) {
      console.error('Error deleting account:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      await onExportData?.()
    } catch (error) {
      console.error('Error exporting data:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <SettingsSection 
      title="Danger Zone"
      description="Irreversible and destructive actions"
      className="border-red-600"
    >
      <div className="space-y-6">
        {/* Data Export */}
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-medium mb-2">Export Your Data</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Download a copy of all your data including profile information, course bookmarks, and activity history.
            </p>
            <SettingsButton
              onClick={handleExportData}
              loading={isExporting || loading}
              disabled={isExporting || loading}
              variant="secondary"
            >
              Export Data
            </SettingsButton>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-medium mb-2">Delete Account</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            {!showDeleteConfirmation ? (
              <SettingsButton
                onClick={() => setShowDeleteConfirmation(true)}
                variant="danger"
                disabled={loading}
              >
                Delete Account
              </SettingsButton>
            ) : (
              <div className="space-y-4 p-4 bg-red-900/20 border border-red-600 rounded-md">
                <div className="space-y-2">
                  <p className="text-red-400 text-sm font-medium">
                    ⚠️ This action cannot be undone
                  </p>
                  <p className="text-sm text-zinc-400">
                    This will permanently delete your account and all associated data including:
                  </p>
                  <ul className="text-sm text-zinc-400 list-disc list-inside space-y-1">
                    <li>Your profile information</li>
                    <li>All course bookmarks and favorites</li>
                    <li>Account activity and history</li>
                    <li>All personal data and preferences</li>
                  </ul>
                </div>

                <SettingsInput
                  id="deletePassword"
                  label="Confirm Password"
                  type="password"
                  value={deletePassword}
                  onChange={setDeletePassword}
                  placeholder="Enter your password to confirm"
                  required
                />

                <div className="flex gap-3">
                  <SettingsButton
                    onClick={handleDeleteAccount}
                    loading={isDeleting || loading}
                    disabled={isDeleting || loading || !deletePassword.trim()}
                    variant="danger"
                  >
                    {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}
                  </SettingsButton>
                  <SettingsButton
                    onClick={() => {
                      setShowDeleteConfirmation(false)
                      setDeletePassword('')
                    }}
                    variant="secondary"
                    disabled={isDeleting || loading}
                  >
                    Cancel
                  </SettingsButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-zinc-900 p-4 rounded-md">
          <h4 className="text-white font-medium mb-2">Legal Information</h4>
          <div className="text-sm text-zinc-400 space-y-2">
            <p>
              By deleting your account, you acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>All your data will be permanently removed</li>
              <li>This action cannot be undone</li>
              <li>You may lose access to purchased content</li>
              <li>We will comply with GDPR data deletion requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </SettingsSection>
  )
} 