'use client'

import { useState, useEffect } from 'react'
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs'
// import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Users, Shield, /* UserMinus, UserPlus, */ Search } from 'lucide-react'
import { getAdminUsers, getCurrentUserRole } from '@/lib/auth-utils'
// import { promoteToAdmin, demoteFromAdmin } from '@/lib/auth-actions'
import { toast } from 'sonner'
/*
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
*/
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/lib/auth-utils'

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<UserRole[]>([])
  const [allUsers, setAllUsers] = useState<UserRole[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const currentUserData = await getCurrentUserRole()
      setCurrentUser(currentUserData)

      // Get all admin users
      const adminUsersData = await getAdminUsers()
      setAdminUsers(adminUsersData)

      // Get all users
      const { data: allUsersData, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllUsers(allUsersData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch user data')
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const nonAdminUsers = filteredUsers.filter(user => user.role !== 'admin')

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Breadcrumbs
          segments={[
            { name: "Dashboard", href: "/dashboard" },
            { name: "Admin Users" },
          ]}
        />
        <div className="text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Admin Users" },
        ]}
      />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Admin User Management</h1>
          <p className="text-zinc-400 text-sm">
            Manage admin privileges for LiveThrough users
          </p>
        </div>

        {/* Current Admin Users */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-semibold text-white">Current Admin Users</h2>
            <Badge variant="secondary" className="bg-teal-900 text-teal-400">
              {adminUsers.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {adminUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-900 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{user.full_name}</div>
                    <div className="text-sm text-zinc-400">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-teal-900 text-teal-400">
                    Admin
                  </Badge>
                  {currentUser?.id === user.id && (
                    <Badge variant="outline" className="border-zinc-600 text-zinc-400">
                      Current User
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {adminUsers.length === 0 && (
              <div className="text-center py-8 text-zinc-400">
                No admin users found
              </div>
            )}
          </div>
        </div>

        {/* Promote Users to Admin */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-zinc-400" />
            <h2 className="text-xl font-semibold text-white">Promote Users to Admin</h2>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {nonAdminUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{user.full_name}</div>
                    <div className="text-sm text-zinc-400">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                    {user.role}
                  </Badge>
                </div>
              </div>
            ))}
            
            {nonAdminUsers.length === 0 && (
              <div className="text-center py-8 text-zinc-400">
                {searchQuery ? 'No users found matching your search' : 'No users available for promotion'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 