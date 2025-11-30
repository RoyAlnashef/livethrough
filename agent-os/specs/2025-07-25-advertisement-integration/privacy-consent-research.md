# Privacy and Consent Research

## Overview
Research findings for implementing privacy-compliant advertisement integration with GDPR and CCPA compliance.

## Current Privacy Landscape

### 1. GDPR (General Data Protection Regulation)
- **Scope**: EU residents and EU-targeted services
- **Key Requirements**:
  - Explicit consent before data processing
  - Right to withdraw consent
  - Clear information about data usage
  - No pre-ticked consent boxes
  - Granular consent options

### 2. CCPA (California Consumer Privacy Act)
- **Scope**: California residents
- **Key Requirements**:
  - Notice of data collection
  - Right to opt-out
  - No discrimination against opt-outs
  - Clear disclosure of data sharing

### 3. Other Jurisdictions
- **LGPD (Brazil)**: Similar to GDPR
- **PIPEDA (Canada)**: Consent-based approach
- **State Laws**: Various US states implementing privacy laws

## Consent Management Requirements

### 1. Consent Categories
```typescript
interface ConsentPreferences {
  necessary: boolean;        // Always true, required for site function
  analytics: boolean;        // Google Analytics, performance tracking
  advertising: boolean;      // AdSense, ad tracking
  marketing: boolean;        // Email marketing, promotions
  social: boolean;          // Social media integration
}
```

### 2. Consent Storage
```typescript
// Local storage structure
interface StoredConsent {
  version: string;
  timestamp: number;
  preferences: ConsentPreferences;
  userAgent: string;
  ipHash?: string; // Hashed for privacy
}
```

### 3. Consent Banner Requirements
- **Clear Language**: Easy to understand
- **Granular Options**: Individual toggles for each category
- **Accept All/Reject All**: Clear options
- **Settings Link**: Easy access to change preferences
- **Cookie Information**: Clear explanation of what each category does

## Implementation Strategy

### 1. Consent Hook
```tsx
// hooks/use-consent.ts
export function useConsent() {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load consent from localStorage
    const stored = localStorage.getItem('livethrough-consent');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConsent(parsed.preferences);
      } catch (error) {
        console.error('Failed to parse consent:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateConsent = (preferences: ConsentPreferences) => {
    const consentData = {
      version: '1.0',
      timestamp: Date.now(),
      preferences,
      userAgent: navigator.userAgent,
    };
    
    localStorage.setItem('livethrough-consent', JSON.stringify(consentData));
    setConsent(preferences);
  };

  return {
    consent,
    isLoaded,
    updateConsent,
    hasConsent: (category: keyof ConsentPreferences) => consent?.[category] ?? false,
  };
}
```

### 2. Consent Banner Component
```tsx
// components/consent-banner.tsx
export function ConsentBanner() {
  const { consent, isLoaded, updateConsent } = useConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoaded && !consent) {
      setIsVisible(true);
    }
  }, [isLoaded, consent]);

  const handleAcceptAll = () => {
    updateConsent({
      necessary: true,
      analytics: true,
      advertising: true,
      marketing: true,
      social: true,
    });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    updateConsent({
      necessary: true,
      analytics: false,
      advertising: false,
      marketing: false,
      social: false,
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">We value your privacy</h3>
            <p className="text-zinc-300 text-sm">
              We use cookies and similar technologies to provide, protect, and improve our services. 
              By clicking "Accept All", you consent to our use of cookies for advertising, analytics, 
              and other purposes. You can customize your preferences in our settings.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRejectAll}>
              Reject All
            </Button>
            <Button onClick={handleAcceptAll}>
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Ad Consent Integration
```tsx
// components/ads/AdSlot.tsx
export function AdSlot({ slotId, className }: { slotId: string; className?: string }) {
  const { hasConsent } = useConsent();
  const { user } = useAuth();
  
  // Don't show ads to admins
  if (user?.role === 'admin') {
    return null;
  }

  // Don't show ads without consent
  if (!hasConsent('advertising')) {
    return (
      <div className={`${className} bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center`}>
        <div className="text-zinc-400 text-sm">Advertisement</div>
        <div className="text-zinc-500 text-xs">Consent required to display ads</div>
      </div>
    );
  }

  return (
    <div className={className} id={`ad-slot-${slotId}`}>
      <ins className="adsbygoogle" ... />
    </div>
  );
}
```

## Privacy Policy Updates

### 1. Required Sections
- **Data Collection**: What data we collect and why
- **Ad Partners**: List of advertising partners
- **Cookie Policy**: Detailed cookie information
- **User Rights**: How to exercise privacy rights
- **Contact Information**: How to contact about privacy

### 2. Cookie Policy
```typescript
interface CookieInfo {
  name: string;
  purpose: string;
  duration: string;
  category: 'necessary' | 'analytics' | 'advertising' | 'marketing' | 'social';
  provider: string;
}
```

## Technical Implementation

### 1. Consent-Aware Script Loading
```tsx
// utils/script-loader.ts
export function loadAdSenseScript() {
  const { hasConsent } = useConsent();
  
  if (!hasConsent('advertising')) {
    return;
  }

  // Load AdSense script only with consent
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`;
  document.head.appendChild(script);
}
```

### 2. Analytics Integration
```tsx
// utils/analytics.ts
export function initializeAnalytics() {
  const { hasConsent } = useConsent();
  
  if (!hasConsent('analytics')) {
    return;
  }

  // Initialize Google Analytics only with consent
  // Implementation details...
}
```

## Compliance Checklist

### GDPR Compliance
- [ ] Implement granular consent options
- [ ] Provide clear information about data usage
- [ ] Enable easy consent withdrawal
- [ ] Store consent records
- [ ] Respect user preferences
- [ ] Provide data export/deletion options

### CCPA Compliance
- [ ] Display privacy notice
- [ ] Provide opt-out mechanism
- [ ] Avoid discrimination against opt-outs
- [ ] Honor opt-out requests
- [ ] Maintain opt-out records

### General Privacy
- [ ] Minimize data collection
- [ ] Secure data storage
- [ ] Regular privacy audits
- [ ] User education
- [ ] Incident response plan

## Testing Strategy

### 1. Consent Flow Testing
- Test consent banner appearance
- Test consent storage and retrieval
- Test consent withdrawal
- Test ad display based on consent

### 2. Privacy Compliance Testing
- Test GDPR compliance for EU users
- Test CCPA compliance for California users
- Test opt-out functionality
- Test data deletion requests

### 3. User Experience Testing
- Test banner usability
- Test settings accessibility
- Test mobile responsiveness
- Test accessibility compliance 