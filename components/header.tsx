"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuthModal } from "@/components/course-marketplace/auth-modal-context"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function Header() {
  const { openAuthModal } = useAuthModal()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => checkAuth())
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleMyCoursesClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      openAuthModal()
    }
    // else, allow navigation
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    // Optionally, you can redirect or show a toast here
  }

  return (
    <header className="border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 font-sans">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/livethrough-logo-lockup-red.svg"
                alt="LIVETHROUGH"
                width={180}
                height={32}
                priority
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors font-roboto">
              Become a Host
            </Link>
            <Link
              href="/account/courses"
              className="text-zinc-400 hover:text-white transition-colors font-roboto"
              onClick={handleMyCoursesClick}
            >
              My Courses
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-white transition-colors font-roboto"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="text-zinc-400 hover:text-white transition-colors font-roboto"
              >
                Log In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
} 