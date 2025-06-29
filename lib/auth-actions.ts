'use server'

import { createClient } from '@supabase/supabase-js'
// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

const createAdminClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables for admin client')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/*
const isCallerAdmin = async (supabaseAdminClient: ReturnType<typeof createAdminClient>): Promise<boolean> => {
    const cookieStore = cookies()
    const supabaseServerClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                set(name: string, value: string, options: any) {
                    cookieStore.set(name, value, options)
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                remove(name: string, options: any) {
                    cookieStore.set(name, '', options)
                },
            },
        }
    )

    const { data: { session } } = await supabaseServerClient.auth.getSession()
    if (!session?.user) return false

    // Use the admin client to check role, bypassing RLS
    const { data: userData, error } = await supabaseAdminClient
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    return !error && userData?.role === 'admin'
}
*/


export async function createFirstAdmin(
  email: string, 
  fullName: string, 
  password?: string
): Promise<{ success: boolean; message: string }> {
  const supabaseAdmin = createAdminClient()
  
  try {
    // Check if any admin already exists
    const { data: existingAdmins, error: existingError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (existingError) throw existingError;

    if (existingAdmins && existingAdmins.length > 0) {
      return { success: false, message: 'Admin user already exists. Use promoteToAdmin instead.' }
    }

    // Create the user in auth.users first
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })

    if (authError || !authData.user) {
      return { success: false, message: `Failed to create user: ${authError?.message || 'Unknown error'}` }
    }

    // Create the user record in users table with admin role
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
        role: 'admin'
      }])

    if (userError) {
      // If creating the user record fails, we should delete the auth user to avoid orphans
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return { success: false, message: `Failed to create user record: ${userError.message}` }
    }

    return { success: true, message: 'First admin user created successfully' }
  } catch (error) {
    console.error('Error creating first admin:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { success: false, message: errorMessage }
  }
}

/*
export async function promoteToAdmin(userId: string): Promise<{ success: boolean; message: string }> {
  const supabaseAdmin = createAdminClient()
  try {
    if (!await isCallerAdmin(supabaseAdmin)) {
      return { success: false, message: 'Only admins can promote users to admin role' }
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userId)

    if (error) {
      return { success: false, message: `Failed to promote user: ${error.message}` }
    }

    return { success: true, message: 'User promoted to admin successfully' }
  } catch (error) {
    console.error('Error promoting user to admin:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function demoteFromAdmin(userId: string): Promise<{ success: boolean; message: string }> {
  const supabaseAdmin = createAdminClient()
  try {
    if (!await isCallerAdmin(supabaseAdmin)) {
      return { success: false, message: 'Only admins can demote users from admin role' }
    }

    const { error } = await supabaseAdmin
      .from('users')
      .update({ role: 'student' })
      .eq('id', userId)

    if (error) {
      return { success: false, message: `Failed to demote user: ${error.message}` }
    }

    return { success: true, message: 'User demoted from admin successfully' }
  } catch (error) {
    console.error('Error demoting user from admin:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}
*/ 