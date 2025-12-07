"use client"

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useAdConsent } from '@/hooks/use-ad-consent'

interface AdSlotProps {
  slotId: string
  adUnitPath?: string
  size?: 'banner' | 'sidebar' | 'content' | 'footer'
  className?: string
  fallbackContent?: React.ReactNode
  enabled?: boolean
}

const AD_SIZES = {
  banner: { width: 728, height: 90 },
  sidebar: { width: 300, height: 250 },
  content: { width: 300, height: 250 },
  footer: { width: 728, height: 90 }
}

export default function AdSlot({ 
  slotId, 
  size = 'content',
  className,
  fallbackContent,
  enabled = true 
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [adBlocked, setAdBlocked] = useState(false)
  const { hasConsent } = useAdConsent()

  const dimensions = AD_SIZES[size]

  useEffect(() => {
    if (!enabled || !hasConsent) return

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (adRef.current) {
      observer.observe(adRef.current)
    }

    return () => observer.disconnect()
  }, [enabled, hasConsent])

  useEffect(() => {
    if (!isVisible || !enabled || !hasConsent) return

    // Track impression
    const trackImpression = async () => {
      try {
        await fetch('/api/ads/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            slotId,
            eventType: 'impression',
            timestamp: new Date().toISOString()
          })
        })
      } catch (error) {
        console.error('Failed to track impression:', error)
      }
    }

    trackImpression()

    // Check if AdSense is available
    if (typeof window !== 'undefined' && (window as unknown as { adsbygoogle?: unknown }).adsbygoogle) {
      try {
        // Create ad slot
        const adElement = document.createElement('ins')
        adElement.className = 'adsbygoogle'
        adElement.style.display = 'block'
        adElement.setAttribute('data-ad-client', process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '')
        adElement.setAttribute('data-ad-slot', slotId)
        adElement.setAttribute('data-ad-format', 'auto')
        adElement.setAttribute('data-full-width-responsive', 'true')

        if (adRef.current) {
          adRef.current.innerHTML = ''
          adRef.current.appendChild(adElement)

          // Push ad to AdSense
          try {
            (window as unknown as { adsbygoogle: { push: (config: unknown) => void } }).adsbygoogle.push({})
            setIsLoaded(true)
          } catch (error) {
            console.error('AdSense push error:', error)
            setHasError(true)
          }
        }
      } catch (error) {
        console.error('AdSense initialization error:', error)
        setHasError(true)
      }
    } else {
      // AdSense not loaded or ad blocker detected
      setAdBlocked(true)
      setHasError(true)
    }
  }, [isVisible, enabled, slotId, hasConsent])

  // Track click event
  const handleClick = async () => {
    try {
      await fetch('/api/ads/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          slotId,
          eventType: 'click',
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  // Don't render if not enabled or no consent
  if (!enabled || !hasConsent) {
    return null
  }

  return (
    <div
      ref={adRef}
      onClick={handleClick}
      className={cn(
        'ad-slot relative overflow-hidden cursor-pointer',
        size === 'sidebar' && 'w-full max-w-[300px]',
        size === 'banner' && 'w-full max-w-[728px]',
        size === 'content' && 'w-full max-w-[300px]',
        size === 'footer' && 'w-full max-w-[728px]',
        className
      )}
      style={{
        minHeight: `${dimensions.height}px`,
        backgroundColor: '#f5f5f5',
        border: '1px solid #e5e5e5',
        borderRadius: '4px'
      }}
    >
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-gray-500">Loading advertisement...</div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="flex items-center justify-center h-full p-4">
          {fallbackContent || (
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">
                {adBlocked ? 'Ad blocker detected' : 'Advertisement unavailable'}
              </div>
              <div className="text-xs text-gray-400">
                Please disable your ad blocker to support our site
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ad label */}
      <div className="absolute top-0 left-0 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-br">
        Advertisement
      </div>
    </div>
  )
} 