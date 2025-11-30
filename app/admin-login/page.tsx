'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminUsers } from '@/lib/auth-utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  const checkAdminSetup = useCallback(async () => {
    try {
      const adminUsers = await getAdminUsers()
      if (adminUsers.length === 0) {
        // No admin exists, redirect to setup
        router.push('/admin-setup')
        return
      }
      setIsChecking(false)
    } catch (error) {
      console.error('Error checking admin setup:', error)
      toast.error('Error checking admin setup')
      setIsChecking(false)
    }
  }, [router])

  useEffect(() => {
    checkAdminSetup()
  }, [checkAdminSetup])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        // Check if the user is an admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (userError || userData?.role !== 'admin') {
          toast.error('Access denied. Admin privileges required.')
          await supabase.auth.signOut()
          return
        }

        toast.success('Login successful!')
        router.push('/dashboard/courses')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Checking admin setup...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/images/logo-mark.svg"
              alt="LiveThrough"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-200">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-200">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Need to set up admin access?{' '}
              <Button
                variant="link"
                onClick={() => router.push('/admin-setup')}
                className="text-teal-400 hover:text-teal-300 p-0 h-auto"
              >
                Create first admin
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 