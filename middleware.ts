import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not signed in and the current path starts with /account or /dashboard
  if (!session && (req.nextUrl.pathname.startsWith('/account') || req.nextUrl.pathname.startsWith('/dashboard'))) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  // For dashboard routes, check if user has admin role
  if (session && req.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || !userData || userData.role !== 'admin') {
        // User is not an admin, redirect to home page
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/'
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      // If there's an error checking the user role, redirect to home page
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/account/:path*', '/dashboard/:path*'],
} 