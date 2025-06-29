'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFirstAdmin } from '@/lib/auth-actions'
import { getAdminUsers } from '@/lib/auth-utils'
import { toast } from 'sonner'
import { Shield, User, Mail, Lock } from 'lucide-react'
import Image from 'next/image'

export default function AdminSetupPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [canAccess, setCanAccess] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  const checkAdminAccess = useCallback(async () => {
    try {
      const adminUsers = await getAdminUsers()
      if (adminUsers.length > 0) {
        // Admin already exists, redirect to home
        router.push('/')
        return
      }
      setCanAccess(true)
    } catch (error) {
      console.error('Error checking admin access:', error)
      toast.error('Error checking admin access')
    } finally {
      setIsChecking(false)
    }
  }, [router])

  useEffect(() => {
    checkAdminAccess()
  }, [checkAdminAccess])

  const validateForm = () => {
    if (!email || !fullName || !password || !confirmPassword) {
      toast.error('All fields are required')
      return false
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const result = await createFirstAdmin(email, fullName, password)
      
      if (result.success) {
        toast.success('Admin account created successfully! Check your email for a confirmation link, then you can log in.')
        router.push('/')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Checking admin access...</div>
      </div>
    )
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Access denied</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
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
            Admin Setup
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Create the first admin account for LiveThrough
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-zinc-200">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-200">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Create Admin Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 