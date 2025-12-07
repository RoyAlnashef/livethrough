'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { NotificationSettings } from '@/lib/types/settings'

// Helper function to create server client with session
async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set(name, '', options)
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Get notification settings for the current user
 */
export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      console.error('Authentication error:', sessionError)
      return null
    }

    const user = session.user

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('notification_preferences')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user notification settings:', userError)
      return null
    }

    // Return default settings if none exist
    if (!userData.notification_preferences) {
      return {
        emailNotifications: true,
        courseUpdates: true,
        marketingEmails: false,
        systemAnnouncements: true
      }
    }

    return userData.notification_preferences as NotificationSettings
  } catch (error) {
    console.error('Error in getNotificationSettings:', error)
    return null
  }
}

/**
 * Update notification settings for the current user
 */
export async function updateNotificationSettings(settings: NotificationSettings): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return { success: false, error: 'Authentication required' }
    }

    const user = session.user

    const { error: updateError } = await supabase
      .from('users')
      .update({ notification_preferences: settings })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating notification settings:', updateError)
      return { success: false, error: 'Failed to update notification settings' }
    }

    // Revalidate the settings page to show updated data
    revalidatePath('/account/settings')
    
    return { success: true }
  } catch (error) {
    console.error('Error in updateNotificationSettings:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Update a single notification setting
 */
export async function updateNotificationSetting(
  key: keyof NotificationSettings, 
  value: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return { success: false, error: 'Authentication required' }
    }

    const user = session.user

    // Get current settings first
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('notification_preferences')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching current notification settings:', fetchError)
      return { success: false, error: 'Failed to fetch current settings' }
    }

    // Update the specific setting
    const currentSettings = userData.notification_preferences || {
      emailNotifications: true,
      courseUpdates: true,
      marketingEmails: false,
      systemAnnouncements: true
    }

    const updatedSettings = {
      ...currentSettings,
      [key]: value
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ notification_preferences: updatedSettings })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating notification setting:', updateError)
      return { success: false, error: 'Failed to update setting' }
    }

    // Revalidate the settings page
    revalidatePath('/account/settings')
    
    return { success: true }
  } catch (error) {
    console.error('Error in updateNotificationSetting:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 