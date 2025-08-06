'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const emailSchema = z.string().email('Please enter a valid email address')

export async function subscribeToNewsletter(email: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    // Validate email
    const validatedEmail = emailSchema.parse(email.toLowerCase().trim())
    
    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
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
              // Server Component context
            }
          },
          remove(name: string, options: Record<string, unknown>) {
            try {
              cookieStore.set(name, '', options)
            } catch {
              // Server Component context
            }
          },
        },
      }
    )

    // Insert email subscription
    const { error } = await supabase
      .from('email_subscriptions')
      .insert([{ email: validatedEmail }])

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.',
          error: 'DUPLICATE_EMAIL'
        }
      }
      throw error
    }

    return {
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
      error: 'UNKNOWN_ERROR'
    }
  }
}

export async function getNewsletterSubscriptions(): Promise<{
  success: boolean;
  data?: Array<{
    id: string;
    email: string;
    created_at: string;
  }>;
  error?: string;
}> {
  try {
    // Create Supabase client with admin permissions
    const cookieStore = await cookies()
    const supabase = createServerClient(
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
              // Server Component context
            }
          },
          remove(name: string, options: Record<string, unknown>) {
            try {
              cookieStore.set(name, '', options)
            } catch {
              // Server Component context
            }
          },
        },
      }
    )

    // Fetch all newsletter subscriptions
    const { data, error } = await supabase
      .from('email_subscriptions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching newsletter subscriptions:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    console.error('Newsletter subscriptions fetch error:', error)
    return {
      success: false,
      error: 'Failed to fetch newsletter subscriptions'
    }
  }
}

export async function deleteNewsletterSubscription(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Create Supabase client with admin permissions
    const cookieStore = await cookies()
    const supabase = createServerClient(
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
              // Server Component context
            }
          },
          remove(name: string, options: Record<string, unknown>) {
            try {
              cookieStore.set(name, '', options)
            } catch {
              // Server Component context
            }
          },
        },
      }
    )

    // Delete the subscription
    const { error } = await supabase
      .from('email_subscriptions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting newsletter subscription:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Newsletter subscription deletion error:', error)
    return {
      success: false,
      error: 'Failed to delete newsletter subscription'
    }
  }
}

export async function deleteNewsletterSubscriptions(ids: string[]): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Create Supabase client with admin permissions
    const cookieStore = await cookies()
    const supabase = createServerClient(
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
              // Server Component context
            }
          },
          remove(name: string, options: Record<string, unknown>) {
            try {
              cookieStore.set(name, '', options)
            } catch {
              // Server Component context
            }
          },
        },
      }
    )

    // Delete multiple subscriptions
    const { error } = await supabase
      .from('email_subscriptions')
      .delete()
      .in('id', ids)

    if (error) {
      console.error('Error deleting newsletter subscriptions:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Newsletter subscriptions deletion error:', error)
    return {
      success: false,
      error: 'Failed to delete newsletter subscriptions'
    }
  }
} 