"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', currentUser.id)
            .single()

          if (error) {
            console.error("Error fetching user role:", error)
            setIsAdmin(false)
          } else {
            setIsAdmin(userData?.role === 'admin')
          }
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Error in checkSession:", error)
        setUser(null)
        setIsAdmin(false)
      } finally {
      setIsLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      // When auth state changes, re-check role, but don't set loading back to true
      // This avoids a flicker when the user logs in/out.
      // We'll rely on the initial load's `isLoading`.
      if (currentUser) {
        supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .single()
          .then(({ data: userData, error }) => {
            if (error) {
              console.error("Error fetching user role on auth change:", error)
              setIsAdmin(false)
            } else {
              setIsAdmin(userData?.role === 'admin')
            }
          })
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
} 