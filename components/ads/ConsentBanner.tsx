"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAdConsent } from '@/hooks/use-ad-consent'

export default function ConsentBanner() {
  const { consent, updateConsent, showConsentBanner, hideConsentBanner } = useAdConsent()
  const [showDetails, setShowDetails] = useState(false)

  if (!showConsentBanner) {
    return null
  }

  const handleAcceptAll = () => {
    updateConsent({
      analytics: true,
      marketing: true,
      necessary: true
    })
  }

  const handleAcceptNecessary = () => {
    updateConsent({
      analytics: false,
      marketing: false,
      necessary: true
    })
  }

  const handleSavePreferences = () => {
    // The consent state is already updated via the checkboxes
    hideConsentBanner()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">
              We use cookies and similar technologies
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              We use cookies and similar technologies to provide, protect, and improve our services. 
              By clicking "Accept All", you consent to our use of cookies for analytics and marketing purposes.
            </p>
            
            {showDetails && (
              <div className="space-y-3 mb-4 p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="necessary"
                    checked={consent.necessary}
                    disabled
                  />
                  <Label htmlFor="necessary" className="text-sm text-zinc-300">
                    Necessary cookies (always active)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="analytics"
                    checked={consent.analytics}
                    onCheckedChange={(checked) => 
                      updateConsent({ analytics: checked as boolean })
                    }
                  />
                  <Label htmlFor="analytics" className="text-sm text-zinc-300">
                    Analytics cookies (help us improve our site)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={consent.marketing}
                    onCheckedChange={(checked) => 
                      updateConsent({ marketing: checked as boolean })
                    }
                  />
                  <Label htmlFor="marketing" className="text-sm text-zinc-300">
                    Marketing cookies (show personalized ads)
                  </Label>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-zinc-300 border-zinc-700 hover:bg-zinc-800"
            >
              {showDetails ? 'Hide Details' : 'Customize'}
            </Button>
            
            {showDetails ? (
              <Button
                size="sm"
                onClick={handleSavePreferences}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Save Preferences
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptNecessary}
                  className="text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                >
                  Necessary Only
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Accept All
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 