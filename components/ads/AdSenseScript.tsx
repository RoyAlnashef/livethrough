"use client"

import { useEffect, useState } from 'react'

interface AdSenseScriptProps {
  clientId: string
  enabled?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
}

export default function AdSenseScript({ 
  clientId, 
  enabled = true,
  onLoad,
  onError 
}: AdSenseScriptProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Check if script is already loaded
    if ((window as any).adsbygoogle) {
      setIsLoaded(true)
      onLoad?.()
      return
    }

    // Check for ad blocker
    const checkAdBlocker = () => {
      const testAd = document.createElement('div')
      testAd.innerHTML = '&nbsp;'
      testAd.className = 'adsbox'
      testAd.style.position = 'absolute'
      testAd.style.left = '-10000px'
      document.body.appendChild(testAd)
      
      const isBlocked = testAd.offsetHeight === 0
      document.body.removeChild(testAd)
      
      return isBlocked
    }

    if (checkAdBlocker()) {
      setHasError(true)
      onError?.(new Error('Ad blocker detected'))
      return
    }

    // Load AdSense script
    const script = document.createElement('script')
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
    script.async = true
    script.crossOrigin = 'anonymous'
    
    script.onload = () => {
      setIsLoaded(true)
      onLoad?.()
    }
    
    script.onerror = () => {
      setHasError(true)
      const error = new Error('Failed to load AdSense script')
      onError?.(error)
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup if component unmounts before script loads
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [clientId, enabled, onLoad, onError])

  // This component doesn't render anything visible
  return null
} 