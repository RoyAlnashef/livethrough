"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuthModal } from "@/components/course-marketplace/auth-modal-context"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Header() {
  const { openAuthModal } = useAuthModal()
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMyCoursesClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      openAuthModal()
    }
    // else, allow navigation
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSignUpClick = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authModalInitialState', 'signup')
    }
    openAuthModal()
  }

  const handleLogInClick = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authModalInitialState', 'login')
    }
    openAuthModal()
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="border-b border-zinc-800 bg-black font-sans md:relative fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
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
            <span className="hidden lg:block text-zinc-400 text-md font-roboto">
              Learn to survive anything.
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {isAdmin && (
              <Link
                href="/dashboard/courses"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors font-roboto"
              >
                Admin
              </Link>
            )}
            <Link
              href="/"
              className={`text-sm font-roboto transition-colors ${
                pathname === "/" 
                  ? "text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Browse Courses
            </Link>
            {isAuthenticated ? (
              <Link
                href="/account/courses"
                className={`text-sm font-roboto transition-colors ${
                  pathname.startsWith("/account") 
                    ? "text-white" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                My Account
              </Link>
            ) : (
              <Link
                href="/account/courses"
                className={`text-sm font-roboto transition-colors ${
                  pathname.startsWith("/account") 
                    ? "text-white" 
                    : "text-zinc-400 hover:text-white"
                }`}
                onClick={handleMyCoursesClick}
              >
                My Courses
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-sm text-zinc-400 hover:text-white transition-colors font-roboto"
              >
                Log Out
              </button>
            ) : (
              <>
                <button
                  onClick={handleLogInClick}
                  className="text-sm text-zinc-400 hover:text-white transition-colors font-roboto"
                >
                  Log In
                </button>
                <Button
                  onClick={handleSignUpClick}
                  variant="outline"
                  className="ml-0 text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-teal-500"
                >
                  Sign Up
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-zinc-950 z-[60] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
        onClick={toggleMobileMenu}
      >
        <div 
          className="flex flex-col items-center justify-center h-full space-y-8 relative bg-topo-overlay"
          onClick={(e) => e.stopPropagation()}
          style={{ height: '100vh'}}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo and Tagline */}
          <div className="flex flex-col items-center space-y-6 pb-8 border-b border-zinc-800 mb-12 max-w-sm mx-auto">
            <Image
              src="/images/livethrough-logo-lockup-red.svg"
              alt="LIVETHROUGH"
              width={180}
              height={32}
              priority
              className="h-8 w-auto"
            />
            <p className="text-zinc-400 text-xl text-center font-roboto">
                Find the best courses, and learn how to survive anything.
              </p>
          </div>
          {isAdmin && (
            <Link
              href="/dashboard/courses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-300 transition-colors font-roboto text-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          <Link
            href="/"
            className={`font-roboto text-xl transition-colors ${
              pathname === "/" 
                ? "text-white" 
                : "text-zinc-400 hover:text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Browse Courses
          </Link>
          {isAuthenticated ? (
            <Link
              href="/account/courses"
              className={`font-roboto text-xl transition-colors ${
                pathname.startsWith("/account") 
                  ? "text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Account
            </Link>
          ) : (
            <Link
              href="/account/courses"
              className={`font-roboto text-xl transition-colors ${
                pathname.startsWith("/account") 
                  ? "text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
              onClick={(e) => {
                handleMyCoursesClick(e)
                setIsMobileMenuOpen(false)
              }}
            >
              My Courses
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout()
                setIsMobileMenuOpen(false)
              }}
              className="text-zinc-400 hover:text-white transition-colors font-roboto text-xl"
            >
              Log Out
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  handleLogInClick()
                  setIsMobileMenuOpen(false)
                }}
                className=" text-zinc-400 hover:text-white transition-colors font-roboto text-xl"
              >
                Log In
              </button>
              <Button
                onClick={() => {
                  handleSignUpClick()
                  setIsMobileMenuOpen(false)
                }}
                className="mt-4 py-6 px-8 text-xl text-white bg-teal-600 border-teal-600 hover:bg-teal-500"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
} 