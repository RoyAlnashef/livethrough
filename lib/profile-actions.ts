'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ProfileData } from '@/lib/types/settings'
import { revalidatePath } from 'next/cache'
import { processImage } from '@/lib/image-processing'

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
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
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
 * Get the current user's profile data
 */
export async function getUserProfile(): Promise<{ 
  success: boolean; 
  data?: ProfileData; 
  error?: string 
}> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('full_name, email, phone, bio, avatar_url')
      .eq('id', session.user.id)
      .single()

    if (userError) {
      console.error('Error fetching user profile:', userError)
      return { success: false, error: 'Failed to fetch profile data' }
    }

    // Transform database fields to ProfileData format
    const profileData: ProfileData = {
      firstName: userData.full_name?.split(' ')[0] || '',
      lastName: userData.full_name?.split(' ').slice(1).join(' ') || '',
      email: userData.email || session.user.email || '',
      phone: userData.phone || '',
      bio: userData.bio || '',
      avatarUrl: userData.avatar_url || ''
    }

    return { success: true, data: profileData }
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Update the current user's profile data
 */
export async function updateUserProfile(data: ProfileData): Promise<{ 
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

    // Combine first and last name for full_name field
    const fullName = `${data.firstName} ${data.lastName}`.trim()

    // Update user profile in users table
    const { error: updateError } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        phone: data.phone || null,
        bio: data.bio || null
      })
      .eq('id', session.user.id)

    if (updateError) {
      console.error('Error updating user profile:', updateError)
      return { success: false, error: 'Failed to update profile' }
    }

    // Revalidate the settings page to show updated data
    revalidatePath('/account/settings')
    
    return { success: true }
  } catch (error) {
    console.error('Error in updateUserProfile:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Upload a profile photo and update the user's avatar_url
 */
export async function uploadProfilePhoto(file: File): Promise<{ 
  success: boolean; 
  avatarUrl?: string; 
  error?: string 
}> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Validate file
    if (!file || file.size > 5 * 1024 * 1024) { // 5MB limit
      return { success: false, error: 'File too large. Maximum size is 5MB.' }
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' }
    }

    // Process image with Sharp (convert to WebP, resize, optimize)
    const processedImage = await processImage(file, {
      maxWidth: 400,  // Profile photos don't need to be huge
      maxHeight: 400,
      quality: 80,
      format: 'webp'
    })

    // Create user-specific folder structure
    const userId = session.user.id
    const fileName = `avatar-${Date.now()}.webp`
    const filePath = `${userId}/${fileName}`

    // Upload processed image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, processedImage.buffer, {
        contentType: processedImage.mimeType,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return { success: false, error: 'Failed to upload image' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Update user's avatar_url in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating avatar URL:', updateError)
      return { success: false, error: 'Failed to update profile photo' }
    }

    // Revalidate the settings page
    revalidatePath('/account/settings')
    
    return { success: true, avatarUrl: publicUrl }
  } catch (error) {
    console.error('Error in uploadProfilePhoto:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 