'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PrivacySettings } from '@/lib/types/settings'
import { revalidatePath } from 'next/cache'

// Helper function to create server client
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
 * Get the current user's privacy settings
 */
export async function getPrivacySettings(): Promise<{ 
  success: boolean; 
  data?: PrivacySettings; 
  error?: string 
}> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user privacy settings from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('privacy_settings')
      .eq('id', session.user.id)
      .single()

    if (userError) {
      console.error('Error fetching privacy settings:', userError)
      return { success: false, error: 'Failed to fetch privacy settings' }
    }

    // Transform database fields to PrivacySettings format
    const privacySettings: PrivacySettings = {
      allowDataUsage: userData.privacy_settings?.allowDataUsage ?? true,
      allowAnalytics: userData.privacy_settings?.allowAnalytics ?? true
    }

    return { success: true, data: privacySettings }
  } catch (error) {
    console.error('Error in getPrivacySettings:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Update the current user's privacy settings
 */
export async function updatePrivacySettings(settings: PrivacySettings): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Update user privacy settings in users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        privacy_settings: {
          allowDataUsage: settings.allowDataUsage,
          allowAnalytics: settings.allowAnalytics
        }
      })
      .eq('id', session.user.id)

    if (updateError) {
      console.error('Error updating privacy settings:', updateError)
      return { success: false, error: 'Failed to update privacy settings' }
    }

    // Revalidate the settings page to show updated data
    revalidatePath('/account/settings')

    return { success: true }
  } catch (error) {
    console.error('Error in updatePrivacySettings:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 

/**
 * Update a single privacy setting
 */
export async function updatePrivacySetting(
  key: keyof PrivacySettings, 
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
      .select('privacy_settings')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching current privacy settings:', fetchError)
      return { success: false, error: 'Failed to fetch current settings' }
    }

    // Update the specific setting
    const currentSettings = userData.privacy_settings || {
      allowDataUsage: true,
      allowAnalytics: true
    }

    const updatedSettings = {
      ...currentSettings,
      [key]: value
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ privacy_settings: updatedSettings })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating privacy setting:', updateError)
      return { success: false, error: 'Failed to update setting' }
    }

    // Revalidate the settings page
    revalidatePath('/account/settings')
    
    return { success: true }
  } catch (error) {
    console.error('Error in updatePrivacySetting:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 