"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAdConsent } from '@/hooks/use-ad-consent'
import { X, Settings } from 'lucide-react'

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
    <div className="fixed md:bottom-6 md:right-6 bottom-4 right-4 max-w-sm w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <h3 className="text-white font-semibold text-sm">
              Cookie Preferences
            </h3>
          </div>
          <button
            onClick={hideConsentBanner}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Close cookie preferences"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-zinc-400 text-xs leading-relaxed">
            We use cookies and similar technologies to provide, protect, and improve our services. 
            By clicking &quot;Accept All&quot;, you consent to our use of cookies for analytics and marketing purposes.
          </p>
          
          {showDetails && (
            <div className="space-y-2 p-3 bg-zinc-800 rounded-md border border-zinc-700">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="necessary"
                  checked={consent.necessary}
                  disabled
                  className="h-3 w-3"
                />
                <Label htmlFor="necessary" className="text-xs text-zinc-300">
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
                  className="h-3 w-3"
                />
                <Label htmlFor="analytics" className="text-xs text-zinc-300">
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
                  className="h-3 w-3"
                />
                <Label htmlFor="marketing" className="text-xs text-zinc-300">
                  Marketing cookies (show personalized ads)
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-4">
          {showDetails ? (
            <Button
              size="sm"
              onClick={handleSavePreferences}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8"
            >
              Save Preferences
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 text-xs h-8 flex-1"
              >
                <Settings className="h-3 w-3 mr-1" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAcceptNecessary}
                className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 text-xs h-8 flex-1"
              >
                Necessary Only
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8 flex-1"
              >
                Accept All
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 