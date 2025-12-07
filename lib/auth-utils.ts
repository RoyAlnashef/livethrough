import { supabase } from './supabase'

export interface UserRole {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'student' | 'instructor'
  created_at: string
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return false

    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    return !error && userData?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Get the current user's role information
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error || !userData) return null
    return userData as UserRole
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

/**
 * Get all admin users
 */
export async function getAdminUsers(): Promise<UserRole[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin users:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
} 