"use client";

import Image from "next/image"
import Link from "next/link"
import { useAuthModal } from "@/components/course-marketplace/auth-modal-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Mail, MapPin } from "lucide-react"
import { AdSlot } from "@/components/ads"

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

  const handleLogInClick = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authModalInitialState', 'login')
    }
    openAuthModal()
  }

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement newsletter signup logic
    console.log('Newsletter signup submitted')
  }

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800" role="contentinfo" aria-label="Site footer">
      {/* Footer Banner Ad */}
      {/* <div className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center">
            <AdSlot
              slotId="footer-banner-ad-slot"
              adUnitPath="/footer/banner"
              size="banner"
              enabled={process.env.NODE_ENV === 'production'}
            />
          </div>
        </div>
      </div> */}
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Link href="/" aria-label="Go to homepage">
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
              Find the right survival courses, and learn how to LiveThrough anything.
            </p>
            <address className="pt-4 space-y-2 not-italic">
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a href="mailto:roy@livethrough.co" className="hover:text-white transition-colors">
                  roy@livethrough.co
                </a>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400 text-sm">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>Los Angeles, CA</span>
              </div>
            </address>
          </div>

          {/* Menu Links Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Menu</h3>
            <nav className="flex flex-col space-y-2" role="navigation" aria-label="Footer navigation">
              {isAdmin && (
                <Link 
                  href="/dashboard/courses" 
                  className="text-zinc-400 hover:text-white transition-colors text-sm focus:outline-none rounded"
                  aria-label="Go to admin dashboard"
                >
                  Admin
                </Link>
              )}
              <Link 
                href="/" 
                className="text-zinc-400 hover:text-white transition-colors text-sm focus:outline-none rounded"
                aria-label="Browse all courses"
              >
                Browse Courses
              </Link>
              {isAuthenticated ? (
                <Link 
                  href="/account/courses" 
                  className="text-zinc-400 hover:text-white transition-colors text-sm focus:outline-none rounded"
                  aria-label="Go to my account"
                >
                  My Account
                </Link>
              ) : (
                <Link 
                  href="/account/courses" 
                  className="text-zinc-400 hover:text-white transition-colors text-sm focus:outline-none rounded" 
                  onClick={handleMyCoursesClick}
                  aria-label="Go to my courses (opens login modal if not authenticated)"
                >
                  My Courses
                </Link>
              )}
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout} 
                  className="text-zinc-400 hover:text-white transition-colors text-sm text-left focus:outline-none rounded"
                  aria-label="Log out of account"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleLogInClick} 
                    className="text-zinc-400 hover:text-white transition-colors text-sm text-left focus:outline-none rounded"
                    aria-label="Log in to account"
                  >
                    Log In
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Resources</h3>
            <nav className="flex flex-col space-y-2" role="navigation" aria-label="Footer resources navigation">
              <Link 
                href="/privacy-policy" 
                className="text-zinc-400 hover:text-white transition-colors text-sm focus:outline-none rounded"
                aria-label="View privacy policy"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms-of-service" 
                className="text-zinc-400 hover:text-white transition-colors text-sm focus:outline-none rounded"
                aria-label="View terms of service"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookie-policy" 
                className="text-zinc-400 hover:text-white transition-colors text-sm focus:outline-none rounded"
                aria-label="View cookie policy"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>

          {/* Newsletter Signup Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Newsletter Signup</h3>
            <p className="text-zinc-400 text-sm">Get survival tips, course updates, and more in your inbox.</p>
            <form 
              className="flex flex-col sm:flex-row gap-2" 
              onSubmit={handleNewsletterSubmit}
              aria-labelledby="newsletter-heading"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
              <input
                type="email"
                id="footer-newsletter-email"
                name="email"
                required
                placeholder="Your email"
                className="px-3 py-2 rounded bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 flex-1"
                autoComplete="email"
                aria-label="Email address for newsletter"
                aria-describedby="newsletter-description"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors focus:outline-none"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>
            <p id="newsletter-description" className="sr-only">Enter your email address to receive survival tips and course updates</p>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <div className="text-zinc-400 text-sm">© 2025 LiveThrough.co. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  )
} 