"use client";

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useAuthModal } from "@/components/course-marketplace/auth-modal-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Mail, MapPin, Check, Loader2 } from "lucide-react"
import { subscribeToNewsletter } from "@/lib/newsletter-actions"
// import { AdSlot } from "@/components/ads"

export default function LiveThroughFooter() {
  const { openAuthModal } = useAuthModal()
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  // Newsletter form state
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

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

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email.trim()) return
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const result = await subscribeToNewsletter(email)
      
      if (result.success) {
        setSubmitStatus('success')
        setStatusMessage(result.message)
        setEmail('')
      } else {
        setSubmitStatus('error')
        setStatusMessage(result.message)
      }
    } catch {
      setSubmitStatus('error')
      setStatusMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 pb-8 border-b sm:border-b-0 border-b-zinc-800">
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
            <p className="text-white text-lg leading-relaxed">
            Find the best courses, and learn how to survive anything.
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
          <div className="space-y-4 pb-8 border-b sm:border-b-0 border-b-zinc-800">
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
          <div className="space-y-4 pb-8 border-b sm:border-b-0 border-b-zinc-800">
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
          <div className="space-y-4 pb-8 border-b sm:border-b-0 border-b-zinc-800">
            <h3 className="text-white font-semibold text-lg">Subscribe to our newsletter</h3>
            <p className="text-zinc-400 text-sm">Sign up for survival tips and resources, course updates, and more.</p>
            <form 
              className="flex flex-col md:flex-row lg:flex-col gap-4" 
              onSubmit={handleNewsletterSubmit}
              aria-labelledby="newsletter-heading"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
              <input
                type="email"
                id="footer-newsletter-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email"
                disabled={isSubmitting || submitStatus === 'success'}
                className="px-3 py-2 rounded bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 flex-1 min-w-0 disabled:opacity-50"
                autoComplete="email"
                aria-label="Email address for newsletter"
                aria-describedby="newsletter-description"
              />
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="px-4 py-2 rounded bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center md:min-w-[100px] w-full md:w-auto flex-shrink-0"
                aria-label="Subscribe to newsletter"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : submitStatus === 'success' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
            {submitStatus !== 'idle' && (
              <p className={`text-sm mt-2 ${
                submitStatus === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {statusMessage}
              </p>
            )}
            <p id="newsletter-description" className="sr-only">Subscribe for survival tips, resources, course updates, and more.</p>
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