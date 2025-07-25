# Google AdSense Integration Research

## Overview
Research findings for integrating Google AdSense into the LiveThrough platform.

## Google AdSense Requirements

### 1. Account Setup
- **Publisher Account**: Must be approved by Google
- **Site Requirements**: 
  - Original content
  - Clear navigation
  - No prohibited content
  - Privacy policy
  - Terms of service
- **Domain Verification**: Site must be verified and approved

### 2. Technical Implementation

#### AdSense Script Integration
```html
<!-- Global AdSense script (in _app.tsx or layout.tsx) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"></script>
```

#### Ad Unit Implementation
```tsx
// AdSlot component structure
<ins 
  className="adsbygoogle"
  style={{ display: 'block' }}
  data-ad-client="ca-pub-XXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX"
  data-ad-format="auto"
  data-full-width-responsive="true"
/>
```

### 3. Ad Unit Types for LiveThrough

#### Responsive Display Ads (Recommended)
- **Format**: `data-ad-format="auto"`
- **Responsive**: Automatically adjusts to container
- **Best for**: Course list interstitials, content area ads

#### Display Ads (Fixed Sizes)
- **Common Sizes**: 728x90, 300x250, 320x50
- **Best for**: Sidebar ads, specific placements

### 4. Implementation Strategy

#### Phase 1: Responsive Display Ads
```tsx
// AdSlot component with responsive ads
export function AdSlot({ slotId, className }: { slotId: string; className?: string }) {
  return (
    <div className={className} id={`ad-slot-${slotId}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

#### Phase 2: Custom Sizes (if needed)
```tsx
// For specific ad sizes
<ins 
  className="adsbygoogle"
  style={{ display: 'inline-block', width: '728px', height: '90px' }}
  data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
  data-ad-slot={slotId}
/>
```

## Privacy and Consent Requirements

### 1. GDPR Compliance
- **Consent Required**: Before loading ads in EU
- **Cookie Consent**: Must be obtained before ad scripts load
- **Opt-out Mechanism**: Users must be able to disable ads

### 2. CCPA Compliance
- **Notice**: Clear disclosure of data collection
- **Opt-out**: California residents can opt out
- **No Discrimination**: Cannot penalize users who opt out

### 3. Implementation Strategy
```tsx
// Consent-aware ad loading
export function AdSlot({ slotId, className }: { slotId: string; className?: string }) {
  const { hasConsent } = useConsent(); // Custom consent hook
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (hasConsent && !adLoaded) {
      // Load AdSense script and ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdLoaded(true);
    }
  }, [hasConsent, adLoaded]);

  if (!hasConsent) {
    return <div className={className}>Ad content (consent required)</div>;
  }

  return (
    <div className={className} id={`ad-slot-${slotId}`}>
      <ins className="adsbygoogle" ... />
    </div>
  );
}
```

## Performance Optimization

### 1. Lazy Loading
```tsx
// IntersectionObserver for lazy loading
export function AdSlot({ slotId, className }: { slotId: string; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={adRef} className={className} id={`ad-slot-${slotId}`}>
      {isVisible && <ins className="adsbygoogle" ... />}
    </div>
  );
}
```

### 2. Layout Shift Prevention
```tsx
// Reserve space for ads
<div 
  className={className} 
  id={`ad-slot-${slotId}`}
  style={{ 
    minHeight: '90px', // Reserve minimum height
    width: '100%' 
  }}
>
  <ins className="adsbygoogle" ... />
</div>
```

## Environment Configuration

### 1. Environment Variables
```env
# .env.local
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_MARKETPLACE=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_COURSE_SIDEBAR=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_COURSE_CONTENT=XXXXXXXXXX
```

### 2. Development vs Production
```tsx
// Test mode for development
const isTestMode = process.env.NODE_ENV === 'development';

export function AdSlot({ slotId, className }: { slotId: string; className?: string }) {
  if (isTestMode) {
    return (
      <div className={`${className} bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center`}>
        <div className="text-zinc-400 text-sm">Ad Slot: {slotId}</div>
        <div className="text-zinc-500 text-xs">Test Mode</div>
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

## Best Practices

### 1. Ad Placement Guidelines
- **Above the fold**: Higher CTR but may affect UX
- **Between content**: Natural reading flow
- **Sidebar**: Less intrusive, good for desktop
- **Mobile optimization**: Consider mobile-specific placements

### 2. User Experience
- **Limit ad density**: Max 3 ads per page
- **Clear labeling**: Mark ads as advertisements
- **Responsive design**: Ads must work on all devices
- **Loading states**: Show placeholder while ads load

### 3. Performance Monitoring
- **Core Web Vitals**: Monitor CLS, LCP, FID
- **Ad performance**: Track CTR, RPM, fill rate
- **User feedback**: Monitor bounce rate changes

## Implementation Checklist

- [ ] Set up Google AdSense account
- [ ] Get publisher ID and ad unit IDs
- [ ] Configure environment variables
- [ ] Implement consent management
- [ ] Create AdSlot component with lazy loading
- [ ] Add ad slots to identified locations
- [ ] Test on development environment
- [ ] Monitor performance metrics
- [ ] Deploy to staging for testing
- [ ] Go live with monitoring 