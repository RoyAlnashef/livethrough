"use client"

import { useState, useEffect } from 'react'

interface AdConsent {
  analytics: boolean
  marketing: boolean
  necessary: boolean
}

interface UseAdConsentReturn {
  consent: AdConsent
  hasConsent: boolean
  updateConsent: (newConsent: Partial<AdConsent>) => void
  showConsentBanner: boolean
  hideConsentBanner: () => void
}

const DEFAULT_CONSENT: AdConsent = {
  analytics: false,
  marketing: false,
  necessary: true // Always true as it's necessary for site functionality
}

export function useAdConsent(): UseAdConsentReturn {
  const [consent, setConsent] = useState<AdConsent>(DEFAULT_CONSENT)
  const [showConsentBanner, setShowConsentBanner] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check for existing consent in localStorage
    const savedConsent = localStorage.getItem('ad-consent')
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent)
        setConsent(parsedConsent)
        setHasConsent(true)
      } catch (error) {
        console.error('Error parsing saved consent:', error)
        setShowConsentBanner(true)
      }
    } else {
      // Show consent banner if no consent has been given
      setShowConsentBanner(true)
    }
  }, [])

  const updateConsent = (newConsent: Partial<AdConsent>) => {
    const updatedConsent = { ...consent, ...newConsent }
    setConsent(updatedConsent)
    
    // Save to localStorage
    localStorage.setItem('ad-consent', JSON.stringify(updatedConsent))
    
    // Check if we have marketing consent for ads
    setHasConsent(updatedConsent.marketing)
    
    // Hide banner if consent is given
    if (updatedConsent.marketing || updatedConsent.analytics) {
      setShowConsentBanner(false)
    }
  }

  const hideConsentBanner = () => {
    setShowConsentBanner(false)
  }

  return {
    consent,
    hasConsent,
    updateConsent,
    showConsentBanner,
    hideConsentBanner
  }
} 