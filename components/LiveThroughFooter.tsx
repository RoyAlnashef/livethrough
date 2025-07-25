import Image from "next/image"
import Link from "next/link"
import { useAuthModal } from "@/components/course-marketplace/auth-modal-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"

export default function LiveThroughFooter() {
  const { openAuthModal } = useAuthModal()
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  const handleMyCoursesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault()
      openAuthModal()
    }
  }

  const handleLogout = async () => {
    // You may want to use the same supabase logic as header, or just route home
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

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/images/livethrough-logo-lockup-red.svg"
                  alt="LIVETHROUGH"
                  width={180}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Find the right courses, and learn to survive anything.
            </p>
            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>roy@livethrough.co</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>1-818-669-2723</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>

          {/* Menu Links Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Menu</h3>
            <nav className="flex flex-col space-y-2">
              {isAdmin && (
                <Link href="/dashboard/courses" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <Link href="/account/courses" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  My Account
                </Link>
              ) : (
                <Link href="/account/courses" className="text-zinc-400 hover:text-white transition-colors text-sm" onClick={handleMyCoursesClick}>
                  My Courses
                </Link>
              )}
              {isAuthenticated ? (
                <button onClick={handleLogout} className="text-zinc-400 hover:text-white transition-colors text-sm text-left">
                  Log Out
                </button>
              ) : (
                <>
                  <button onClick={handleLogInClick} className="text-zinc-400 hover:text-white transition-colors text-sm text-left">
                    Log In
                  </button>
                  <Button onClick={handleSignUpClick} variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-teal-500 text-sm">
                    Sign Up
                  </Button>
                </>
              )}
              {/* Policy Links */}
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
                Refund Policy
              </Link>
            </nav>
          </div>

          {/* Newsletter Signup Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Newsletter Signup</h3>
            <p className="text-zinc-400 text-sm">Get survival tips, course updates, and more in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={e => e.preventDefault()}>
              <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
              <input
                type="email"
                id="footer-newsletter-email"
                name="email"
                required
                placeholder="Your email"
                className="px-3 py-2 rounded bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex-1"
                autoComplete="email"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-zinc-400 text-sm">© 2025 LiveThrough.co. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  )
} 